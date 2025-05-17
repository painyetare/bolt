"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, MapPin, Star, Package, Award, ShoppingBag, MessageCircle } from "lucide-react"
import { SellerStatusIndicator } from "@/components/seller-status-indicator"
import { motion } from "framer-motion"

export default function SellerCard({
  seller,
  featured = false,
  index = 0,
}: {
  seller: any
  featured?: boolean
  index?: number
}) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const {
    id,
    name,
    logo: image,
    rating,
    reviewCount: reviews = 0,
    location,
    specialties = [],
    verified,
    username,
    products = [],
    description,
  } = seller

  // Calculate product count by category
  const productCategories = {
    footwear: products.filter(
      (p) => p.category?.toLowerCase().includes("footwear") || p.category?.toLowerCase().includes("shoes"),
    ).length,
    apparel: products.filter(
      (p) => p.category?.toLowerCase().includes("apparel") || p.category?.toLowerCase().includes("clothing"),
    ).length,
    equipment: products.filter(
      (p) => p.category?.toLowerCase().includes("equipment") || p.category?.toLowerCase().includes("gear"),
    ).length,
  }

  // Get the top 3 categories
  const topCategories = Object.entries(productCategories)
    .filter(([_, count]) => count > 0)
    .sort(([_, countA], [__, countB]) => Number(countB) - Number(countA))
    .slice(0, 3)
    .map(([category]) => category)

  // Category labels
  const categoryLabels = {
    footwear: "Footwear",
    apparel: "Athletic Apparel",
    equipment: "Sports Equipment",
  }

  // Category icons
  const categoryIcons = {
    footwear: <ShoppingBag className="h-3 w-3 mr-1" />,
    apparel: <ShoppingBag className="h-3 w-3 mr-1" />,
    equipment: <Package className="h-3 w-3 mr-1" />,
  }

  const handleChatClick = () => {
    // Check if user is logged in
    const hasDiscordSession = document.cookie.includes("discord_user_id")

    if (hasDiscordSession) {
      // If logged in, redirect to chat
      router.push(`/dashboard/messages?seller=${id || username}`)
    } else {
      // If not logged in, redirect to login
      router.push(`/auth/login?redirect=/dashboard/messages?seller=${id || username}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-black border border-red-500/20 overflow-hidden h-full flex flex-col relative group">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-600/20 blur-xl"></div>
        </div>

        {featured && (
          <div className="bg-gradient-to-r from-red-700 to-red-500 text-white text-xs font-medium px-3 py-1.5 text-center flex items-center justify-center">
            <Award className="h-3.5 w-3.5 mr-1.5 text-yellow-300" />
            Featured Seller
          </div>
        )}

        <CardContent className="p-5 flex-grow relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-2 border-red-500/30 shadow-lg shadow-red-500/10">
                {image ? (
                  <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
                )}
              </div>
              {verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-black">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              <SellerStatusIndicator sellerId={id} className="absolute top-0 right-0 border-2 border-black" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">{name}</h3>
                {verified && (
                  <Badge className="ml-2 bg-green-600 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <span className="text-yellow-400 font-medium text-sm ml-2">
                  {rating} ({reviews})
                </span>
              </div>

              {location && (
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </div>
              )}
            </div>
          </div>

          {description && <p className="text-gray-400 text-sm mt-4 line-clamp-2">{description}</p>}

          {/* Product Categories */}
          {topCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {topCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/30 transition-colors"
                >
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                </Badge>
              ))}
            </div>
          )}

          {/* Specialties */}
          {specialties && specialties.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-red-500/30 text-gray-300 bg-black/40">
                    {specialty}
                  </Badge>
                ))}
                {specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs border-red-500/30 text-gray-300 bg-black/40">
                    +{specialties.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 relative z-10">
          <div className="w-full space-y-2">
            <Link href={`/sellers/${username || name.toLowerCase()}`} className="w-full">
              <Button className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none text-white font-medium">
                View Products
              </Button>
            </Link>

            {/* Chat button */}
            <Button
              variant="outline"
              className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
              onClick={handleChatClick}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Seller
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
