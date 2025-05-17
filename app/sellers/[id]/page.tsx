"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getSellerByUsername, type Seller } from "@/data/sellers"
import { useProductStore, type Product } from "@/data/products"
import { useLanguageStore } from "@/store/languageStore"
import { translations } from "@/lib/translations"
import { useCartStore } from "@/data/cart"
import { useWishlistStore } from "@/data/wishlist"
import { ArrowLeft, Check, Heart, HeartOff, MapPin, ShoppingCart, Star, User, Calendar, Package } from "lucide-react"
import Link from "next/link"
import SellerMobileNav from "@/components/seller-mobile-nav"

export default function SellerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguageStore()
  const { products } = useProductStore()
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [sellerProducts, setSellerProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("products")
  const [isFollowing, setIsFollowing] = useState(false)

  // Get translations based on selected language
  const t = language === "zh" ? translations.zh : language === "ro" ? translations.ro : translations.en

  useEffect(() => {
    if (params?.id) {
      const sellerName = Array.isArray(params.id) ? params.id[0] : params.id

      // Find seller by name (converted to lowercase for case-insensitive matching)
      const fetchedSeller = getSellerByUsername(sellerName.toLowerCase())

      if (fetchedSeller) {
        setSeller(fetchedSeller)

        // Get products for this seller
        const sellerProds = products.filter((product) => fetchedSeller.products.includes(product.id.toString()))
        setSellerProducts(sellerProds)
      }
      setIsLoading(false)
    }
  }, [params, products])

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    // In a real app, you would update the follower count in the database
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
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
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <User className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">{t.sellerNotFound}</h1>
        <p className="text-gray-400 mb-6 max-w-md">{t.sellerNotFoundDesc}</p>
        <Button onClick={() => router.push("/sellers")} className="bg-red-500 hover:bg-red-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToSellers}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <SellerMobileNav />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6 border-red-500/50 text-red-400"
          onClick={() => router.push("/sellers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToSellers}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seller Info */}
          <div className="lg:col-span-1">
            <Card className="bg-black/20 border-red-500/20 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-red-900 to-red-700"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12">
                  <div className="h-24 w-24 rounded-full border-4 border-black overflow-hidden bg-black/40">
                    {seller.logo ? (
                      <img
                        src={seller.logo || "/placeholder.svg"}
                        alt={seller.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-3xl font-bold">
                        {seller.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-4">
                  <h1 className="text-2xl font-bold text-white">{seller.name}</h1>
                  {seller.verified ? (
                    <Badge className="mt-2 bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      {t.verified}
                    </Badge>
                  ) : (
                    <Badge className="mt-2 bg-gray-600">{t.notVerified}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <p className="text-gray-400 text-sm">{t.products}</p>
                    <p className="text-white font-bold">{seller.products.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t.followers}</p>
                    <p className="text-white font-bold">{seller.followers || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t.rating}</p>
                    <div className="flex items-center justify-center">
                      <p className="text-white font-bold mr-1">{seller.rating}</p>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-800" />

                {seller.location && (
                  <div className="flex items-center mb-4">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-300">{seller.location}</p>
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-300">
                    {t.joinedOn} {seller.joinDate}
                  </p>
                </div>

                {seller.specialties && seller.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-2">{t.specialties}</p>
                    <div className="flex flex-wrap gap-2">
                      {seller.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="border-red-500/50 text-red-400">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    variant={isFollowing ? "destructive" : "outline"}
                    className={isFollowing ? "" : "border-red-500/50 text-red-400"}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? (
                      <>
                        <HeartOff className="mr-2 h-4 w-4" />
                        {t.unfollowSeller}
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        {t.followSeller}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Seller Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{t.products}</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{t.about}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                <h2 className="text-xl font-bold text-white">{t.featuredProducts}</h2>

                {sellerProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sellerProducts.map((product) => (
                      <Card key={product.id} className="bg-black/20 border-red-500/20 overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={product.image || "/placeholder.svg?height=300&width=300"}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-white"
                              }`}
                            />
                          </button>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-xl font-bold text-red-500">{product.price}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < product.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm ml-2">({product.reviewCount || 0})</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Link href={`/products/${product.id}`} passHref>
                            <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                              {t.viewProduct}
                            </Button>
                          </Link>
                          {product.inStock ? (
                            <Button
                              size="sm"
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {t.addToCart}
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              {t.outOfStock}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-black/20 rounded-lg border border-red-500/20">
                    <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t.noProducts}</h3>
                  </div>
                )}

                {sellerProducts.length > 4 && (
                  <div className="text-center mt-6">
                    <Button variant="outline" className="border-red-500/50 text-red-400">
                      {t.viewAllProducts}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about">
                <Card className="bg-black/20 border-red-500/20">
                  <CardHeader>
                    <CardTitle>{t.about}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-line">{seller.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
