"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { toast } from "sonner"

interface User {
  _id: string
  title: string
  name: string
  fatherHusbandName: string
  mobileNo: string
  emailId: string
  dateOfBirth: string
  passoutPercentage: number
  state: string
  address: string
  courseName: string
  experience: string
  collegeName: string
  photoUrl: string
  qrCodeUrl: string
  registrationNumber: string
  createdAt: string
  updatedAt: string
}

interface UserEditFormProps {
  user: User
  onUserUpdated: (user: User) => void
  onCancel: () => void
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export function UserEditForm({ user, onUserUpdated, onCancel }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    title: user.title,
    name: user.name,
    fatherHusbandName: user.fatherHusbandName,
    mobileNo: user.mobileNo,
    emailId: user.emailId,
    dateOfBirth: user.dateOfBirth,
    passoutPercentage: user.passoutPercentage,
    state: user.state,
    address: user.address,
    courseName: user.courseName,
    experience: user.experience,
    collegeName: user.collegeName,
  })

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [qrCode, setQrCode] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (file: File | null, type: "profile" | "qr") => {
    if (type === "profile") {
      setProfilePhoto(file)
    } else {
      setQrCode(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })

      // Add files if selected
      if (profilePhoto) {
        formDataToSend.append("profilePhoto", profilePhoto)
      }
      if (qrCode) {
        formDataToSend.append("qrCode", qrCode)
      }

      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdated(updatedUser.user)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Error updating user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title and Full Name */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Select value={formData.title} onValueChange={(value) => handleInputChange("title", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
        </div>

        {/* Father/Husband Name */}
        <div className="md:col-span-2">
          <Label htmlFor="fatherHusbandName">Father/Husband Name *</Label>
          <Input
            id="fatherHusbandName"
            value={formData.fatherHusbandName}
            onChange={(e) => handleInputChange("fatherHusbandName", e.target.value)}
            required
          />
        </div>

        {/* Mobile and Email */}
        <div>
          <Label htmlFor="mobileNo">Mobile Number *</Label>
          <Input
            id="mobileNo"
            value={formData.mobileNo}
            onChange={(e) => handleInputChange("mobileNo", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="emailId">Email Address *</Label>
          <Input
            id="emailId"
            type="email"
            value={formData.emailId}
            onChange={(e) => handleInputChange("emailId", e.target.value)}
            required
          />
        </div>

        {/* Date of Birth and Pass out Percentage */}
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="passoutPercentage">Pass out Percentage *</Label>
          <Input
            id="passoutPercentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.passoutPercentage}
            onChange={(e) => handleInputChange("passoutPercentage", Number.parseFloat(e.target.value))}
            required
          />
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />
        </div>

        {/* Course Name and Experience */}
        <div>
          <Label htmlFor="courseName">Course Name *</Label>
          <Input
            id="courseName"
            value={formData.courseName}
            onChange={(e) => handleInputChange("courseName", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="experience">Experience *</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            placeholder="e.g., 2 years"
            required
          />
        </div>

        {/* College Name */}
        <div className="md:col-span-2">
          <Label htmlFor="collegeName">College Name *</Label>
          <Input
            id="collegeName"
            value={formData.collegeName}
            onChange={(e) => handleInputChange("collegeName", e.target.value)}
            required
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={user.photoUrl || "/placeholder.svg"}
              alt="Current profile"
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, "profile")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {profilePhoto ? profilePhoto.name : "Click to upload new photo"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            {user.qrCodeUrl ? (
              <img
                src={user.qrCodeUrl || "/placeholder.svg"}
                alt="Current QR code"
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No QR Code</span>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, "qr")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-green-400 mb-2" />
                <p className="text-sm text-gray-600">{qrCode ? qrCode.name : "Click to upload new QR code"}</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB (Optional)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update User"}
        </Button>
      </div>
    </form>
  )
}
