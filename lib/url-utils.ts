export function getLoginDomain(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/user/profile`
}

export function getPublicProfileLink(registrationNumber: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const token = generateViewToken(registrationNumber)
  return `${baseUrl}/user/${token}`
}

export function generateViewToken(registrationNumber: string): string {
  // Create a simple base64 encoded token with timestamp for basic security
  const data = {
    regNum: registrationNumber,
    timestamp: Date.now(),
  }

  return Buffer.from(JSON.stringify(data)).toString("base64url")
}

export function decodeViewToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    const data = JSON.parse(decoded)

    // Check if token is not older than 30 days (optional security measure)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    if (data.timestamp < thirtyDaysAgo) {
      return null
    }

    return data.regNum
  } catch (error) {
    console.error("Error decoding view token:", error)
    return null
  }
}
