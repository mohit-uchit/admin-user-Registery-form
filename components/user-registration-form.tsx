"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, QrCode } from "lucide-react"
import { INDIAN_STATES } from "@/models/User"

interface FormData {
  title: string
  name: string // Changed from fullName to name
  fatherHusbandName: string
  mobileNo: string // Changed from mobileNumber to mobileNo
  emailId: string // Changed from emailAddress to emailId
  dateOfBirth: string
  passoutPercentage: string // Changed from passOutPercentage to passoutPercentage
  state: string
  address: string
  courseName: string
  experience: string
  collegeName: string
  profilePhoto: File | null
  qrCode: File | null
}

export function UserRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    name: "", // Changed from fullName
    fatherHusbandName: "",
    mobileNo: "", // Changed from mobileNumber
    emailId: "", // Changed from emailAddress
    dateOfBirth: "",
    passoutPercentage: "", // Changed from passOutPercentage
    state: "",
    address: "",
    courseName: "",
    experience: "",
    collegeName: "",
    profilePhoto: null,
    qrCode: null,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "profilePhoto" | "qrCode", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const formDataToSend = new FormData()

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "profilePhoto" && key !== "qrCode" && value) {
          formDataToSend.append(key, value as string)
        }
      })

      // Add files
      if (formData.profilePhoto) {
        formDataToSend.append("profilePhoto", formData.profilePhoto)
      }
      if (formData.qrCode) {
        formDataToSend.append("qrCode", formData.qrCode)
      }

      const response = await fetch("/api/admin/register-user", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setMessage("User registered successfully! Email sent to user.")
        // Reset form
        setFormData({
          title: "",
          name: "", // Changed from fullName
          fatherHusbandName: "",
          mobileNo: "", // Changed from mobileNumber
          emailId: "", // Changed from emailAddress
          dateOfBirth: "",
          passoutPercentage: "", // Changed from passOutPercentage
          state: "",
          address: "",
          courseName: "",
          experience: "",
          collegeName: "",
          profilePhoto: null,
          qrCode: null,
        })
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">User Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title and Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Select value={formData.title} onValueChange={(value) => handleInputChange("title", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Mr" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Row 2: Father/Husband Name */}
          <div className="space-y-2">
            <Label htmlFor="fatherHusbandName">Father/Husband Name *</Label>
            <Input
              id="fatherHusbandName"
              value={formData.fatherHusbandName}
              onChange={(e) => handleInputChange("fatherHusbandName", e.target.value)}
              placeholder="Enter father/husband name"
              required
            />
          </div>

          {/* Row 3: Mobile and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile Number *</Label>
              <Input
                id="mobileNo"
                value={formData.mobileNo}
                onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailId">Email Address *</Label>
              <Input
                id="emailId"
                type="email"
                value={formData.emailId}
                onChange={(e) => handleInputChange("emailId", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Row 4: DOB and Pass out Percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passoutPercentage">Pass out Percentage *</Label>
              <Input
                id="passoutPercentage"
                value={formData.passoutPercentage}
                onChange={(e) => handleInputChange("passoutPercentage", e.target.value)}
                placeholder="Enter percentage"
                required
              />
            </div>
          </div>

          {/* Row 5: State */}
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 6: Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your complete address"
              rows={3}
              required
            />
          </div>

          {/* Row 7: Course Name and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => handleInputChange("courseName", e.target.value)}
                placeholder="Enter course name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="e.g., 2 years"
                required
              />
            </div>
          </div>

          {/* Row 8: College Name */}
          <div className="space-y-2">
            <Label htmlFor="collegeName">College Name *</Label>
            <Input
              id="collegeName"
              value={formData.collegeName}
              onChange={(e) => handleInputChange("collegeName", e.target.value)}
              placeholder="Enter college/institution name"
              required
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label>Upload Photo *</Label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  {formData.profilePhoto ? formData.profilePhoto.name : "Click to upload your photo"}
                </div>
                <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("profilePhoto", e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* QR Code Upload */}
            <div className="space-y-2">
              <Label>Upload QR Code (Optional)</Label>
              <div className="relative border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <QrCode className="mx-auto h-12 w-12 text-green-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  {formData.qrCode ? formData.qrCode.name : "Click to upload QR code"}
                </div>
                <div className="text-xs text-gray-500">PNG, JPG up to 5MB (Optional)</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("qrCode", e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {message && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering User..." : "Register User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
