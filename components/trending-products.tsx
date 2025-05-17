"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguageStore } from "@/data/translations"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp } from "lucide-react"

export function TrendingProducts() {
  const { language } = useLanguageStore()

  // Sample trending products - reduced to 3 for simplicity
  const trendingProducts = [
    {
      id: 1,
      name: "Nike Tech Fleece Set",
      image: "/placeholder.svg?height=300&width=300",
      price: "$59.99",
      trend: "+12% this week",
    },
    {
      id: 2,
      name: "Jordan 4 Retro",
      image: "/placeholder.svg?height=300&width=300",
      price: "$89.99",
      trend: "+28% this week",
    },
    {
      id: 3,
      name: "Louis Vuitton Wallet",
      image: "/placeholder.svg?height=300&width=300",
      price: "$45.99",
      trend: "+8% this week",
    },
  ]

  return (
    <div className="relative py-12">
      <motion.div
        className="mb-10 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-3xl font-bold text-white">Trending Products</h2>
        </div>
        <Link href="/products" className="flex items-center text-red-400 hover:text-red-300 transition-colors">
          <span className="mr-1">View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href="/products">
        <motion.div
          className="bg-black border border-red-600/30 rounded-xl overflow-hidden shadow-[0_0_10px_rgba(255,0,0,0.15)] h-full"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
          }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            {/* Product image */}
            <div className="relative h-48 w-full overflow-hidden">
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
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4 z-0"
                />
              </motion.div>
            </div>
          </div>

          {/* Product info */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <motion.h3
                className="font-bold text-lg"
                animate={{
                  color: isHovered ? "#f87171" : "#ffffff",
                }}
                transition={{ duration: 0.3 }}
              >
                {product.name}
              </motion.h3>
            </div>

            <motion.p
              className="text-xl font-bold"
              animate={{
                color: isHovered ? "#f87171" : "#ffffff",
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {product.price}
            </motion.p>

            <motion.div
              className="mt-3 text-center py-2 rounded-lg bg-red-600/20 text-red-400 text-sm font-medium"
              animate={{
                backgroundColor: isHovered ? "rgba(220, 38, 38, 0.3)" : "rgba(220, 38, 38, 0.2)",
                color: isHovered ? "#f87171" : "#f87171",
              }}
              transition={{ duration: 0.3 }}
            >
              CLICK FOR DETAILS
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// Also export as default for backward compatibility
export default TrendingProducts
