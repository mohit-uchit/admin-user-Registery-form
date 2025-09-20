import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">User Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The user information you're looking for could not be found. This might be because:
          </p>
          <ul className="text-sm text-gray-500 text-left space-y-1">
            <li>• The link has expired</li>
            <li>• The link is invalid</li>
            <li>• The user data has been removed</li>
          </ul>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
