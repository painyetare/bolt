"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, MessageSquare, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function DiscordProfile() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    // Check if the user is logged in by looking for the discord_username cookie
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift() || ""
      return ""
    }

    const discordUsername = getCookieValue("discord_username")
    const discordAvatar = getCookieValue("discord_avatar")

    if (discordUsername) {
      setIsLoggedIn(true)
      setUsername(discordUsername)
      setAvatar(discordAvatar)
    }
  }, [])

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleLogout = () => {
    router.push("/api/auth/logout")
  }

  const handleMessages = () => {
    router.push("/dashboard/messages")
  }

  const handleProfile = () => {
    router.push("/dashboard")
  }

  if (!isLoggedIn) {
    return (
      <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-950/30" onClick={handleLogin}>
        <User className="h-4 w-4 mr-2" />
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black border-red-500/30" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-gray-500">Discord User</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMessages}>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
