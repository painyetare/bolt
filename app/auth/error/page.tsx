"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Unknown error"

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "invalid_state":
        return "Invalid state parameter. This could be due to a CSRF attack or the session expired."
      case "no_code":
        return "No authorization code was provided by Discord."
      default:
        return errorCode
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black cosmic-bg">
      <Card className="w-[400px] bg-black/60 border-red-500/30 shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">There was a problem signing you in with Discord</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-950/20 border border-red-500/30 rounded-md p-4 text-red-400 text-sm">
            {getErrorMessage(error)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
