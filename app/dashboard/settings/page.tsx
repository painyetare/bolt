"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Loader2, Save } from "lucide-react"
import SellerMobileNav from "@/components/seller-mobile-nav"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { hashPassword } from "@/lib/auth-service"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [seller, setSeller] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    location: "",
    logo: "",
    specialties: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Check authentication and load seller data
  useEffect(() => {
    const checkAuth = async () => {
      // Check if seller is logged in via cookie
      const sellerLoggedIn = document.cookie.includes("seller_logged_in=true")
      const sellerId = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("seller_id="))
        ?.split("=")[1]

      if (!sellerLoggedIn || !sellerId) {
        router.push("/sellers/login")
        return
      }

      try {
        // Get seller data from Supabase
        const { data, error } = await supabase.from("sellers").select("*").eq("id", sellerId).single()

        if (error || !data) {
          throw new Error("Failed to fetch seller data")
        }

        setSeller(data)

        // Initialize form data
        setFormData({
          name: data.name || "",
          email: data.email || "",
          description: data.description || "",
          location: data.location || "",
          logo: data.logo || "",
          specialties: data.specialties ? data.specialties.join(", ") : "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } catch (error) {
        console.error("Error fetching seller data:", error)
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        router.push("/sellers/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!seller) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare update data
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        description: formData.description,
        location: formData.location,
        logo: formData.logo,
        specialties: formData.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }

      // Update seller in Supabase
      const { error } = await supabase.from("sellers").update(updateData).eq("id", seller.id)

      if (error) throw error

      setSuccess("Profile updated successfully")

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })

      // Update local seller state
      setSeller((prev) => ({ ...prev, ...updateData }))
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")

      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!seller) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match")
        setIsSaving(false)
        return
      }

      if (formData.newPassword.length < 3) {
        setError("New password must be at least 3 characters")
        setIsSaving(false)
        return
      }

      // Verify current password
      const hashedCurrentPassword = hashPassword(formData.currentPassword)

      const { data: passwordCheck, error: passwordError } = await supabase
        .from("sellers")
        .select("id")
        .eq("id", seller.id)
        .eq("password", hashedCurrentPassword)
        .single()

      if (passwordError || !passwordCheck) {
        setError("Current password is incorrect")
        setIsSaving(false)
        return
      }

      // Hash new password
      const hashedNewPassword = hashPassword(formData.newPassword)

      // Update password in Supabase
      const { error } = await supabase.from("sellers").update({ password: hashedNewPassword }).eq("id", seller.id)

      if (error) throw error

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccess("Password updated successfully")

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      setError("Failed to update password. Please try again.")

      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!seller) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SellerMobileNav />

      <div className="container mx-auto px-4 py-12 pt-24 md:pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your seller profile and account settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Card className="md:col-span-2 bg-black/40 border-red-500/20">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription className="text-gray-400">Update your seller profile information</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-900/20 border-green-500/50 text-green-200">
                  <Check className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Store Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-black/50 border-red-600/50 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="bg-black/50 border-red-600/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma separated)</Label>
                  <Input
                    id="specialties"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleChange}
                    placeholder="e.g. Footwear, Athletic Apparel, Sports Equipment"
                    className="bg-black/50 border-red-600/50"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-red-900 hover:bg-red-800" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="bg-black/40 border-red-500/20">
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription className="text-gray-400">Update your account password</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="bg-black/50 border-red-600/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="bg-black/50 border-red-600/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-black/50 border-red-600/50"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-red-900 hover:bg-red-800" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="md:col-span-3 bg-black/40 border-red-500/20">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription className="text-gray-400">Your account details and information</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="font-medium">{seller.username}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className="font-medium">
                    {seller.verified ? (
                      <span className="text-green-400">Verified</span>
                    ) : (
                      <span className="text-yellow-400">Pending Verification</span>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Joined Date</p>
                  <p className="font-medium">{new Date(seller.join_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
