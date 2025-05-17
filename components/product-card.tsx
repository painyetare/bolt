"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { generateProductLink } from "@/data/imported-products"
import { useTranslation } from "@/lib/i18n"
import { motion } from "framer-motion"
import { ExternalLink, Eye } from "lucide-react"

interface ProductCardProps {
  id: number
  name: string
  price: string
  image: string
  productId: string
  quality?: "AAA+" | "AA" | "Budget"
  slug?: string
  qcPictureUrl?: string
}

export function ProductCard({ id, name, price, image, productId, quality, slug, qcPictureUrl }: ProductCardProps) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  // Create the link with the exact format using the helper function
  const productLink = generateProductLink(productId, "WD")

  // Get quality badge color
  const getQualityBadgeColor = (quality?: string) => {
    switch (quality) {
      case "AAA+":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      case "AA":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      case "Budget":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  // Get quality text
  const getQualityText = (quality?: string) => {
    switch (quality) {
      case "AAA+":
        return t("aaaPlusQuality")
      case "AA":
        return t("aaQuality")
      case "Budget":
        return t("budgetFriendly")
      default:
        return ""
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-red-900/30 shadow-[0_0_15px_rgba(180,0,0,0.2)] bg-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quality badge */}
      {quality && (
        <div className="absolute top-3 right-3 z-20">
          <Badge
            className={`${getQualityBadgeColor(quality)} border px-2 py-1 text-xs font-semibold`}
            variant="outline"
          >
            {getQualityText(quality)}
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/50 z-10"
          animate={{ opacity: isHovered ? 0.8 : 0.5 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-4 z-0" />
        </motion.div>

        {/* Quick view button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <a
            href={`/products/${id}`}
            className="bg-black/70 hover:bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 border border-red-900/50"
          >
            <Eye className="h-4 w-4" />
            <span>{t("Quick View")}</span>
          </a>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5 bg-black">
        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{name}</h3>
        <p className="text-xl font-bold mb-4 text-red-400">{price}</p>

        {/* Buy Button */}
        <a
          href={productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white rounded-md text-center py-3 px-4 font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(180,0,0,0.5)] flex items-center justify-center"
        >
          <span>{t("View Product")}</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>

        {/* View QC Button - Always show this button */}
        <a
          href={qcPictureUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full bg-black border border-red-600/50 hover:bg-red-900/20 text-white rounded-md text-center py-3 px-4 font-medium transition-all duration-300 flex items-center justify-center"
        >
          <span>{t("View QC")}</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </motion.div>
  )
}

// Also export as default for backward compatibility
export default ProductCard
