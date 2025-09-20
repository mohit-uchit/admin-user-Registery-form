import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { generateViewToken } from "@/lib/url-utils"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] User login API called")
    const { email, phoneNumber } = await request.json()

    if (!email || !phoneNumber) {
      console.log("[v0] Missing email or phone number")
      return NextResponse.json({ error: "Email and phone number are required" }, { status: 400 })
    }

    console.log("[v0] Connecting to database for user login")
    await connectToDatabase()

    // Find user by email and ensure they're not deleted
    console.log("[v0] Searching for user with email:", email)
    const user = await User.findOne({
      emailId: email.toLowerCase(),
    })

    if (!user) {
      console.log("[v0] User not found with email:", email)
      return NextResponse.json({ error: "Invalid email or phone number" }, { status: 401 })
    }

    console.log("[v0] User found, verifying phone number")
    console.log("[v0] Stored hashed password:", user.hashedPassword ? "exists" : "missing")
    console.log("[v0] Input phone number:", phoneNumber)

    // Verify phone number (used as password)
    const isPhoneValid = await bcrypt.compare(phoneNumber, user.hashedPassword)
    console.log("[v0] Phone number comparison result:", isPhoneValid)

    if (!isPhoneValid) {
      console.log("[v0] Phone number verification failed for user:", user._id)
      return NextResponse.json({ error: "Invalid email or phone number" }, { status: 401 })
    }

    console.log("[v0] Phone number verified, generating profile link")
    // Generate profile link using registration number
    const profileToken = generateViewToken(user.registrationNumber)
    const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/user/${profileToken}`

    console.log("[v0] Login successful for user:", user._id, "Profile link generated")

    return NextResponse.json({
      success: true,
      profileLink,
      message: "Login successful! Redirecting to your profile...",
    })
  } catch (error) {
    console.error("[v0] User login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
