import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

interface UserData {
  name: string
  emailId?: string
  mobileNo?: string
  registrationNumber?: string
  courseName?: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    console.log("[v0] Creating email transporter...")
    console.log("[v0] SMTP Configuration:", {
      host: process.env.SMTP_HOST || "smtp.zoho.eu",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      user: process.env.ZOHO_SMTP_USER || process.env.SMTP_USER,
      hasPassword: !!(process.env.ZOHO_SMTP_PASSWORD || process.env.SMTP_PASSWORD),
    })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.eu",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.ZOHO_SMTP_USER || process.env.SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASSWORD || process.env.SMTP_PASSWORD,
      },
      tls: {
        minVersion: "TLSv1.2",
      },
      debug: true,
      logger: true,
    })

    console.log("[v0] Verifying SMTP connection...")
    await transporter.verify()
    console.log("[v0] ✅ SMTP connection verified successfully!")

    console.log("[v0] Sending email to:", to)
    console.log("[v0] Email subject:", subject)

    const info = await transporter.sendMail({
      from: `"Certificate System" <${process.env.SMTP_FROM_EMAIL || process.env.ZOHO_SMTP_USER || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    console.log("[v0] 🎉 Email sent successfully!")
    console.log("[v0] Message ID:", info.messageId)
    console.log("[v0] Email response:", info.response)
    return true
  } catch (error) {
    console.error("[v0] ❌ Email sending failed:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return false
  }
}

export function getRegistrationEmailTemplate(userData: UserData | string, accessLink: string): string {
  const userName = typeof userData === "string" ? userData : userData.name
  const userEmail = typeof userData === "object" ? userData.emailId : ""
  const userMobile = typeof userData === "object" ? userData.mobileNo : ""
  const regNumber = typeof userData === "object" ? userData.registrationNumber : ""
  const courseName = typeof userData === "object" ? userData.courseName : ""

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Successful</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 0 10px; }
        .welcome-text { font-size: 18px; color: #2c3e50; margin-bottom: 25px; }
        .user-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .user-details h3 { color: #2c3e50; margin-top: 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: bold; color: #495057; }
        .detail-value { color: #6c757d; }
        .access-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; margin: 25px 0; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: transform 0.2s; }
        .access-button:hover { transform: translateY(-2px); }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; }
        .success-icon { font-size: 48px; color: #28a745; text-align: center; margin-bottom: 20px; }
        @media (max-width: 600px) {
          .container { margin: 10px; padding: 15px; }
          .header { padding: 20px; margin: -15px -15px 20px -15px; }
          .header h1 { font-size: 24px; }
          .detail-row { flex-direction: column; }
          .detail-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Registration Successful!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to our Certificate System</p>
        </div>
        
        <div class="content">
          <div class="success-icon">✅</div>
          
          <p class="welcome-text">
            Dear <strong>${userName}</strong>,<br>
            Congratulations! Your registration has been completed successfully.
          </p>

          ${
            typeof userData === "object"
              ? `
          <div class="user-details">
            <h3>📋 Your Registration Details</h3>
            ${regNumber ? `<div class="detail-row"><span class="detail-label">Registration Number:</span><span class="detail-value">${regNumber}</span></div>` : ""}
            <div class="detail-row"><span class="detail-label">Full Name:</span><span class="detail-value">${userName}</span></div>
            ${userEmail ? `<div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${userEmail}</span></div>` : ""}
            ${userMobile ? `<div class="detail-row"><span class="detail-label">Mobile:</span><span class="detail-value">${userMobile}</span></div>` : ""}
            ${courseName ? `<div class="detail-row"><span class="detail-label">Course:</span><span class="detail-value">${courseName}</span></div>` : ""}
          </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #495057; margin-bottom: 20px;">
              Click the button below to access your profile and view your details:
            </p>
            <a href="${accessLink}" class="access-button">
              🔗 Access Your Profile
            </a>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>📌 Important:</strong> Save this email for your records. You can use this link to access your profile anytime.
            </p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for registering with us!</p>
          <p style="font-size: 12px; color: #adb5bd;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
