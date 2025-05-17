"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, Package, Star, Users, ShoppingBag, MessageCircle, Settings, LogOut } from "lucide-react"
import SellerMobileNav from "@/components/seller-mobile-nav"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [seller, setSeller] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [productCount, setProductCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])

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

        // Get product count
        const { count: productCountData, error: productError } = await supabase
          .from("seller_products")
          .select("*", { count: "exact", head: true })
          .eq("seller_id", sellerId)

        if (!productError) {
          setProductCount(productCountData || 0)
        }

        // For demo purposes, set a random message count
        setMessageCount(Math.floor(Math.random() * 10))
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

  const handleLogout = async () => {
    try {
      // Clear cookies
      document.cookie = "seller_logged_in=; path=/; max-age=0"
      document.cookie = "seller_id=; path=/; max-age=0"

      // Clear localStorage
      localStorage.removeItem("seller")

      // Sign out from Supabase
      await supabase.auth.signOut()

      router.push("/sellers/login")
    } catch (error) {
      console.error("Error logging out:", error)
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-400">Welcome back, {seller.name}</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Products</p>
                  <h3 className="text-2xl font-bold">{productCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Package className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <h3 className="text-2xl font-bold">{seller.rating.toFixed(1)}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <h3 className="text-2xl font-bold">{seller.followers || 0}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages</p>
                  <h3 className="text-2xl font-bold">{messageCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2 bg-black/40 border-red-500/20">
                <CardHeader>
                  <CardTitle>Seller Profile</CardTitle>
                  <CardDescription className="text-gray-400">Your public profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-2 border-red-500/30">
                        {seller.logo ? (
                          <img
                            src={seller.logo || "/placeholder.svg"}
                            alt={seller.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">{seller.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{seller.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400">@{seller.username}</p>
                          {seller.verified && (
                            <Badge className="bg-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                      <p className="text-gray-300">{seller.description || "No description provided."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Location</h4>
                        <p className="text-gray-300">{seller.location || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Joined</h4>
                        <p className="text-gray-300">{new Date(seller.join_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {seller.specialties && seller.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {seller.specialties.map((specialty: string, index: number) => (
                            <Badge key={index} variant="outline" className="border-red-500/30 text-red-400">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="border-red-500/30 text-red-400"
                        onClick={() => router.push("/dashboard/settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-red-500/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">Manage your seller account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
                      onClick={() => router.push("/dashboard/seller-products")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Manage Products
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500"
                      onClick={() => router.push("/dashboard/messages")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View Messages
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500"
                      onClick={() => router.push("/sellers/" + seller.username)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-black/40 border-red-500/20">
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription className="text-gray-400">Manage your product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="mb-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
                  onClick={() => router.push("/dashboard/seller-products")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Go to Product Management
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-black/40 border-red-500/20">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription className="text-gray-400">Communicate with your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="mb-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500"
                  onClick={() => router.push("/dashboard/messages")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Go to Messages
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-black/40 border-red-500/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription className="text-gray-400">Manage your seller account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="mb-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
