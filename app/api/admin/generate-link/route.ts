import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { getPublicProfileLink } from "@/lib/url-utils"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Generating user view link...")

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const publicProfileUrl = getPublicProfileLink(user.registrationNumber)
    const token = publicProfileUrl.split("/user/")[1] // Extract token for backward compatibility

    console.log("[v0] Public profile link generated:", publicProfileUrl)
    console.log("[v0] View link generated successfully")

    return NextResponse.json({
      success: true,
      token: token,
      publicUrl: publicProfileUrl,
      message: "Link generated successfully",
    })
  } catch (error) {
    console.error("[v0] Error generating link:", error)
    return NextResponse.json({ success: false, message: "Failed to generate link" }, { status: 500 })
  }
}
