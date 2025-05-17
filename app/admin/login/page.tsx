"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LogIn } from "lucide-react"
import { loginAdmin } from "@/lib/auth-service"
import Link from "next/link"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await loginAdmin(username, password)

      if (result.success) {
        // Store admin auth in localStorage
        localStorage.setItem("admin-auth", "authenticated")
        router.push("/admin")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-black/40 border-red-500/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Admin Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-500/50 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-black/50 border-red-500/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-red-500/30 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></span>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-gray-400">
            <Link href="/sellers/login" className="text-gray-400 hover:text-gray-300">
              Seller login
            </Link>
            <span className="mx-2">•</span>
            <Link href="/auth/login" className="text-gray-400 hover:text-gray-300">
              Customer login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
