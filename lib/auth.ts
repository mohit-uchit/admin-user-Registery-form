import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export function checkAdminAuth(): boolean {
  const cookieStore = cookies()
  const adminToken = cookieStore.get("admin-token")
  return adminToken?.value === "authenticated"
}

export function setAdminAuth() {
  const cookieStore = cookies()
  cookieStore.set("admin-token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export function clearAdminAuth() {
  const cookieStore = cookies()
  cookieStore.delete("admin-token")
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
}

export async function validateUserCredentials(email: string, phoneNumber: string): Promise<string | null> {
  try {
    await connectToDatabase()

    const user = await User.findOne({
      emailId: email.toLowerCase(),
      deletedAt: null,
    })

    if (!user) {
      return null
    }

    const isPhoneValid = await bcrypt.compare(phoneNumber, user.hashedPassword)

    if (isPhoneValid) {
      return user.registrationNumber
    }

    return null
  } catch (error) {
    console.error("Error validating user credentials:", error)
    return null
  }
}
