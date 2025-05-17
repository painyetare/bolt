"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaDiscord } from "react-icons/fa"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDiscordLogin = () => {
    setIsLoading(true)
    window.location.href = "/api/auth/discord"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black cosmic-bg">
      <Card className="w-[400px] bg-black/60 border-red-500/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">Login to Repgalaxy</CardTitle>
          <CardDescription className="text-center">
            Connect with Discord to access your account and chat with sellers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-6 flex items-center justify-center gap-2"
          >
            <FaDiscord className="h-5 w-5" />
            {isLoading ? "Connecting..." : "Login with Discord"}
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-gray-400 text-center">
          By logging in, you agree to join our Discord server and accept our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}
