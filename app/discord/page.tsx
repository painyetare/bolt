"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DiscordRedirect() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // In a real implementation, this would redirect to your actual Discord invite link
    const discordInviteUrl = "https://discord.gg/w2c-ro"

    // Only redirect if the user is actually on the discord page
    // This prevents accidental redirects from other pages
    if (window.location.pathname === "/discord") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = discordInviteUrl
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
      <h1 className="text-2xl font-bold mb-2">Redirecting to Discord...</h1>
      <p className="text-gray-400 mb-4">You will be redirected to our Discord server in {countdown} seconds.</p>
      <p className="text-sm text-gray-600">
        If you are not redirected,{" "}
        <a href="https://discord.gg/w2c-ro" className="text-purple-500 hover:underline">
          click here
        </a>
        .
      </p>
    </div>
  )
}
