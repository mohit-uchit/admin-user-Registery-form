import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    console.log("[v0] Starting user fetch request...")

    console.log("[v0] Connecting to database...")
    await connectDB()
    console.log("[v0] Database connected successfully")

    console.log("[v0] Querying all users...")
    const users = await User.find({})
      .select("-hashedPassword") // Exclude password from response
      .sort({ createdAt: -1 })

    console.log(`[v0] Successfully found ${users.length} users`)

    return NextResponse.json({
      success: true,
      users: users,
    })
  } catch (error) {
    console.error("[v0] Detailed error in GET /api/admin/users:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
