import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/auth"
import { AdminHeader } from "@/components/admin-header"
import { UserRegistrationForm } from "@/components/user-registration-form"
import { UserManagementDashboard } from "@/components/user-management-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  if (!checkAdminAuth()) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register New User</TabsTrigger>
            <TabsTrigger value="manage">Manage Users</TabsTrigger>
          </TabsList>
          <TabsContent value="register" className="mt-6">
            <UserRegistrationForm />
          </TabsContent>
          <TabsContent value="manage" className="mt-6">
            <UserManagementDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
