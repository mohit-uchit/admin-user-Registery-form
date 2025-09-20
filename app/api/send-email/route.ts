import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, getRegistrationEmailTemplate } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] 📧 Send email API called")
    const body = await request.json()
    console.log("[v0] Request body received:", {
      hasTo: !!body.to,
      hasUserData: !!body.userData,
      hasViewLink: !!body.viewLink,
      subject: body.subject,
    })

    const email = body.to || body.email || body.userData?.emailId
    const fullName = body.userData?.name || body.fullName || body.name
    const viewLink = body.viewLink || body.accessLink
    const userData = body.userData

    console.log("[v0] Extracted email parameters:", {
      email,
      fullName,
      viewLink,
      hasUserData: !!userData,
    })

    if (!email || !fullName) {
      console.log("[v0] ❌ Missing required fields:", {
        hasEmail: !!email,
        hasFullName: !!fullName,
      })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Email and fullName are required",
        },
        { status: 400 },
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const accessLink = viewLink || `${baseUrl}/user/profile`

    console.log("[v0] Using access link:", accessLink)
    console.log("[v0] Generating email template...")

    const emailHtml = getRegistrationEmailTemplate(userData || { name: fullName }, accessLink)

    console.log("[v0] 🚀 Attempting to send email...")
    console.log("[v0] Email details:", {
      to: email,
      subject: "Registration Successful - Access Your Profile",
      templateGenerated: !!emailHtml,
    })

    const success = await sendEmail({
      to: email,
      subject: "Registration Successful - Access Your Profile",
      html: emailHtml,
    })

    if (success) {
      console.log("[v0] ✅ Email sent successfully to:", email)
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
      })
    } else {
      console.log("[v0] ❌ Email sending failed for:", email)
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: "SMTP sending failed",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] ❌ Email API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
