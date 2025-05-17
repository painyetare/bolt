"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function DiscordTestPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have a session cookie
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setSession(data.session)
        }
      } catch (err) {
        setError("Failed to check session")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setSession(null)
    } catch (err) {
      setError("Failed to logout")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Discord Authentication Test</CardTitle>
          <CardDescription>Test the Discord authentication flow</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : session ? (
            <div>
              <div className="mb-4">
                <strong>Logged in as:</strong> {session.username}
              </div>
              {session.avatar && (
                <img
                  src={`https://cdn.discordapp.com/avatars/${session.id}/${session.avatar}.png`}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
              )}
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center">Not logged in</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {session ? (
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin}>Login with Discord</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
