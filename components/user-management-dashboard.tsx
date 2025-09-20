"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Link, Search, Users } from "lucide-react"
import { UserEditForm } from "./user-edit-form"
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

export function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      console.log("[v0] Attempting to fetch users...")
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        console.error("[v0] Fetch failed with status:", response.status)
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Successfully fetched users:", data)
      setUsers(data.users || [])
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      setUsers([]) // Set empty array instead of failing
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log("[v0] Attempting to permanently delete user:", userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      console.log("[v0] Delete response:", data)

      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId))
        console.log("[v0] User removed from state, refreshing list from database...")
        await fetchUsers() // Refresh the entire list to ensure consistency
        toast.success(data.message || "User permanently deleted")
      } else {
        toast.error(data.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
      toast.error("Error deleting user")
    }
  }

  const handleGenerateLink = async (user: User) => {
    try {
      console.log("[v0] 🔗 Generating link for user:", user.name, "Email:", user.emailId)

      const response = await fetch("/api/admin/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      })

      if (response.ok) {
        const data = await response.json()
        const link = data.publicUrl || `${window.location.origin}/user/${data.token}`
        console.log("[v0] ✅ Link generated successfully:", link)

        try {
          await navigator.clipboard.writeText(link)
          console.log("[v0] 📋 Link copied to clipboard successfully!")
          toast.success("User profile link copied to clipboard!")
        } catch (clipboardError) {
          console.error("[v0] ❌ Failed to copy to clipboard:", clipboardError)
          toast.error("Link generated but failed to copy to clipboard")
        }

        console.log("[v0] 📧 Attempting to send registration email...")
        console.log("[v0] Email details:", {
          to: user.emailId,
          userName: user.name,
          registrationNumber: user.registrationNumber,
          course: user.courseName,
        })

        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.emailId,
            subject: "Your Registration Details - Access Link",
            type: "registration",
            userData: user,
            viewLink: link,
          }),
        })

        const emailResult = await emailResponse.json()
        console.log("[v0] Email API response:", emailResult)

        if (emailResponse.ok && emailResult.success) {
          console.log("[v0] ✅ Registration email sent successfully!")
          toast.success("Link generated and email sent successfully!")
        } else {
          console.error("[v0] ❌ Email sending failed:", emailResult)
          toast.error(`Link generated but email failed: ${emailResult.error || "Unknown error"}`)
        }
      } else {
        const errorData = await response.json()
        console.error("[v0] ❌ Failed to generate link:", errorData)
        toast.error("Failed to generate link")
      }
    } catch (error) {
      console.error("[v0] ❌ Error in handleGenerateLink:", error)
      toast.error("Error generating link")
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
    setIsEditDialogOpen(false)
    setSelectedUser(null)
    toast.success("User updated successfully")
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNo.includes(searchTerm) ||
      user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Badge variant="secondary">{filteredUsers.length} users found</Badge>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.title} {user.name}
                    </TableCell>
                    <TableCell>{user.emailId}</TableCell>
                    <TableCell>{user.mobileNo}</TableCell>
                    <TableCell>{user.registrationNumber}</TableCell>
                    <TableCell>{user.courseName}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleGenerateLink(user)}>
                          <Link className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found matching your search criteria.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserEditForm
              user={selectedUser}
              onUserUpdated={handleUserUpdated}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
