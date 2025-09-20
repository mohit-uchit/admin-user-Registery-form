import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { uploadProfilePhoto, uploadQRCode } from "@/lib/cloudinary"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[v0] Updating user with ID: ${params.id}`)

    await connectDB()

    const formData = await request.formData()

    // Extract form fields
    const updateData: any = {
      title: formData.get("title"),
      name: formData.get("name"),
      fatherHusbandName: formData.get("fatherHusbandName"),
      mobileNo: formData.get("mobileNo"),
      emailId: formData.get("emailId"),
      dateOfBirth: formData.get("dateOfBirth"),
      passoutPercentage: Number.parseFloat(formData.get("passoutPercentage") as string),
      state: formData.get("state"),
      address: formData.get("address"),
      courseName: formData.get("courseName"),
      experience: formData.get("experience"),
      collegeName: formData.get("collegeName"),
      updatedAt: new Date(),
    }

    // Handle file uploads if provided
    const profilePhoto = formData.get("profilePhoto") as File
    const qrCode = formData.get("qrCode") as File

    if (profilePhoto && profilePhoto.size > 0) {
      console.log("[v0] Uploading new profile photo...")
      const photoUrl = await uploadProfilePhoto(profilePhoto)
      updateData.photoUrl = photoUrl
    }

    if (qrCode && qrCode.size > 0) {
      console.log("[v0] Uploading new QR code...")
      const qrCodeUrl = await uploadQRCode(qrCode)
      updateData.qrCodeUrl = qrCodeUrl
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true }).select(
      "-hashedPassword",
    )

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    console.log("[v0] User updated successfully")

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[v0] Permanently deleting user with ID: ${params.id}`)

    await connectDB()

    const deletedUser = await User.findByIdAndDelete(params.id)

    if (!deletedUser) {
      console.log("[v0] User not found for deletion")
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    console.log("[v0] User permanently deleted successfully:", {
      userId: deletedUser._id,
      userName: deletedUser.name,
      email: deletedUser.emailId,
    })

    return NextResponse.json({
      success: true,
      message: "User permanently deleted from database",
    })
  } catch (error) {
    console.error("[v0] Error permanently deleting user:", error)
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 })
  }
}
