"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Database, Loader2, Users, Package } from "lucide-react"
import { seedSellers } from "@/lib/seed-sellers"
import { seedProducts } from "@/lib/seed-products"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sellerResult, setSellerResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const [productResult, setProductResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(
    null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sellers")

  // Check authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth")
    if (adminAuth !== "authenticated") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsCheckingAuth(false)
  }, [router])

  const handleSeedSellers = async () => {
    setIsLoading(true)
    setSellerResult(null)
    try {
      const result = await seedSellers()
      setSellerResult(result)
    } catch (error) {
      console.error("Error seeding sellers:", error)
      setSellerResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedProducts = async () => {
    setIsLoading(true)
    setProductResult(null)
    try {
      const result = await seedProducts()
      setProductResult(result)
    } catch (error) {
      console.error("Error seeding products:", error)
      setProductResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedAll = async () => {
    setIsLoading(true)
    setSellerResult(null)
    setProductResult(null)

    try {
      // First seed sellers
      const sellerResult = await seedSellers()
      setSellerResult(sellerResult)

      if (sellerResult.success) {
        // Then seed products
        const productResult = await seedProducts()
        setProductResult(productResult)
      } else {
        setProductResult({ success: false, error: "Seller seeding failed, cannot seed products" })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      setSellerResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-4xl bg-black/40 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Seed Database</CardTitle>
          <CardDescription className="text-gray-400">
            Initialize your database with test data for development and testing
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="all">All Data</TabsTrigger>
            </TabsList>

            <TabsContent value="sellers">
              {sellerResult && (
                <Alert
                  variant={sellerResult.success ? "default" : "destructive"}
                  className={`mb-4 ${
                    sellerResult.success
                      ? "bg-green-900/20 border-green-500/50 text-green-200"
                      : "bg-red-900/20 border-red-500/50 text-red-200"
                  }`}
                >
                  {sellerResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{sellerResult.message || sellerResult.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <p className="text-gray-300">
                  This will seed your database with test sellers and an admin user. All test accounts will have the
                  password "123".
                </p>
                <div className="bg-black/60 p-4 rounded-md border border-red-500/20">
                  <h3 className="font-medium text-white mb-2">Test Accounts:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      <span className="font-medium">Admin:</span> username: admin, password: 123
                    </li>
                    <li>
                      <span className="font-medium">Sellers:</span> nike, adidas, puma, underarmour, newbalance (all
                      with password: 123)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
                    onClick={handleSeedSellers}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Seeding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Seed Sellers
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products">
              {productResult && (
                <Alert
                  variant={productResult.success ? "default" : "destructive"}
                  className={`mb-4 ${
                    productResult.success
                      ? "bg-green-900/20 border-green-500/50 text-green-200"
                      : "bg-red-900/20 border-red-500/50 text-red-200"
                  }`}
                >
                  {productResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{productResult.message || productResult.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <p className="text-gray-300">
                  This will seed your database with test products associated with the sellers. Make sure to seed sellers
                  first.
                </p>
                <div className="bg-black/60 p-4 rounded-md border border-red-500/20">
                  <h3 className="font-medium text-white mb-2">Test Products:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>Nike Air Force 1</li>
                    <li>Adidas Ultraboost</li>
                    <li>Puma RS-X</li>
                    <li>Under Armour HOVR</li>
                    <li>New Balance 990</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
                    onClick={handleSeedProducts}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Seeding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Seed Products
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-4">
                {sellerResult && (
                  <Alert
                    variant={sellerResult.success ? "default" : "destructive"}
                    className={`mb-4 ${
                      sellerResult.success
                        ? "bg-green-900/20 border-green-500/50 text-green-200"
                        : "bg-red-900/20 border-red-500/50 text-red-200"
                    }`}
                  >
                    {sellerResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>Sellers: {sellerResult.message || sellerResult.error}</AlertDescription>
                  </Alert>
                )}

                {productResult && (
                  <Alert
                    variant={productResult.success ? "default" : "destructive"}
                    className={`mb-4 ${
                      productResult.success
                        ? "bg-green-900/20 border-green-500/50 text-green-200"
                        : "bg-red-900/20 border-red-500/50 text-red-200"
                    }`}
                  >
                    {productResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>Products: {productResult.message || productResult.error}</AlertDescription>
                  </Alert>
                )}

                <p className="text-gray-300">
                  This will seed your database with all test data including sellers, admin, and products.
                </p>

                <div className="bg-black/60 p-4 rounded-md border border-red-500/20">
                  <h3 className="font-medium text-white mb-2">What will be seeded:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      <span className="font-medium">Admin user:</span> username: admin, password: 123
                    </li>
                    <li>
                      <span className="font-medium">5 Sellers:</span> nike, adidas, puma, underarmour, newbalance
                    </li>
                    <li>
                      <span className="font-medium">5 Products:</span> One for each seller
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500"
                    onClick={handleSeedAll}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Seeding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Seed All Data
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" className="border-red-500/30 text-red-400" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
