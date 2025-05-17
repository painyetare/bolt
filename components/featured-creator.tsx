"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

export function FeaturedCreator({
  creatorName = 'Flavius "CloneSoles"',
  imageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-47cLCVYVHpv5cSoUXYv2VCC1cn6Vkq.png",
  statsImageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4SfzYCNGJ015mJdkORwLzO1fXDEDdR.png",
  linkUrl = "/linktree",
}) {
  const { t, language } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative w-full max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-red-950/30 to-black border border-red-600/30 shadow-[0_0_30px_rgba(180,0,0,0.3)]"
        whileHover={{
          boxShadow: "0 0 40px rgba(180,0,0,0.4)",
          transition: { duration: 0.3 },
        }}
      >
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 p-6">
            <div
              className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden border-4 border-red-600/50 shadow-[0_0_20px_rgba(180,0,0,0.5)] cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image src={imageUrl || "/placeholder.svg"} alt={creatorName} fill className="object-cover" />

              {/* Social Media Stats Overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* TikTok Stats */}
                    <div className="mb-6 text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="white">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <div className="text-2xl font-bold text-white">1,000,000+</div>
                      <div className="text-sm text-gray-300">Views</div>
                      <div className="text-xl font-bold text-white mt-1">10,000+</div>
                      <div className="text-sm text-gray-300">Subscribers</div>
                    </div>

                    {/* YouTube Stats */}
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="white">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <div className="text-2xl font-bold text-white">300,000+</div>
                      <div className="text-sm text-gray-300">Views</div>
                      <div className="text-xl font-bold text-white mt-1">2,000+</div>
                      <div className="text-sm text-gray-300">Subscribers</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-red-600/20 rounded-full blur-xl"></div>
            <div className="absolute -top-3 -right-3 w-32 h-32 bg-red-600/20 rounded-full blur-xl"></div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-3/5 p-6 md:p-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {creatorName}
            </motion.h2>

            <motion.p
              className="text-gray-300 mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("featured_creator_description")}
            </motion.p>

            {/* Spacer to move button lower */}
            <div className="mt-8"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-auto"
            >
              <Link
                href={linkUrl}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(180,0,0,0.5)] hover:shadow-[0_0_20px_rgba(180,0,0,0.7)]"
              >
                {t("learn_more")}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Also export as default for backward compatibility
export default FeaturedCreator
