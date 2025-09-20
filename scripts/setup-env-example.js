// This script creates an example .env file with all required environment variables
// Run this to see what environment variables you need to set up

const fs = require("fs")

const envExample = `# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/admin_system

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Zoho Email Configuration (SMTP)
ZOHO_SMTP_USER=your_email@zoho.com
ZOHO_SMTP_PASSWORD=your_app_password

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`

fs.writeFileSync(".env.example", envExample)
console.log("Created .env.example file with all required environment variables")
console.log("Please copy this to .env and fill in your actual values")
console.log("Note: For Zoho email, you may need to:")
console.log("1. Enable IMAP/POP access in Zoho Mail settings")
console.log("2. Generate an app-specific password if 2FA is enabled")
console.log("3. Use your full Zoho email address as the username")
