import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { decodeViewToken } from "@/lib/url-utils"

interface UserViewPageProps {
  params: {
    token: string
  }
}

async function getUserByToken(token: string) {
  try {
    const registrationNumber = decodeViewToken(token)
    if (!registrationNumber) {
      return null
    }

    await connectToDatabase()

    const user = await User.findOne({ registrationNumber }).select("-hashedPassword")
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function UserViewPage({ params }: UserViewPageProps) {
  const user = await getUserByToken(params.token)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
      {/* Profile Photo - Top Right */}
      <div className="fixed top-4 right-4 z-10">
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
          <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-lg font-semibold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* QR Code - Bottom Right with 30px padding */}
      {user.qrCodeUrl && (
        <div className="fixed bottom-8 right-8 z-10">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <Image
              src={user.qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              width={120}
              height={120}
              className="rounded"
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">User Information</CardTitle>
            <p className="text-blue-100 mt-2">Registration Details</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.title}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.name}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Father/Husband Name</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.fatherHusbandName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.mobileNo}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.emailId}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pass out Percentage</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.passoutPercentage}%</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">State</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.state}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border min-h-[80px]">{user.address}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Registration Number</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200 font-mono text-blue-800">
                    {user.registrationNumber}
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Educational Information</h3>

                <div>
                  <label className="text-sm font-medium text-gray-600">Course Name</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.courseName}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.experience}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">College Name</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">{user.collegeName}</div>
                </div>

                {/* Registration Date */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="text-sm font-medium text-blue-800">Registration Date</label>
                  <div className="mt-1 text-blue-900 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <label className="text-sm font-medium text-green-800">Last Updated</label>
                  <div className="mt-1 text-green-900 font-semibold">
                    {new Date(user.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
