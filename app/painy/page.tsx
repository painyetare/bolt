"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Instagram,
  Youtube,
  Twitter,
  ExternalLink,
  Copy,
  Check,
  Globe,
  ShoppingBag,
  HelpCircle,
  MessageCircle,
  ChevronDown,
  Heart,
  Share2,
  Clock,
  Star,
  Users,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Custom TikTok icon to match the style
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.589 6.686C19.3 6.06 18.773 5.561 18.132 5.289C17.143 4.857 15.64 4.857 15.64 4.857C15.64 4.857 14.137 4.857 13.148 5.289C12.507 5.561 11.98 6.06 11.691 6.686C11.246 7.647 11.246 9.657 11.246 9.657C11.246 9.657 11.246 11.667 11.691 12.628C11.98 13.254 12.507 13.753 13.148 14.025C14.137 14.457 15.64 14.457 15.64 14.457C15.64 14.457 17.143 14.457 18.132 14.025C18.773 13.753 19.3 13.254 19.589 12.628C20.034 11.667 20.034 9.657 20.034 9.657C20.034 9.657 20.034 7.647 19.589 6.686Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.36 16.457C8.72 16.457 8.09 16.223 7.59 15.783C7.09 15.343 6.75 14.727 6.63 14.047C6.51 13.367 6.62 12.667 6.93 12.057C7.24 11.447 7.74 10.967 8.36 10.697C8.98 10.427 9.67 10.387 10.31 10.577C10.95 10.767 11.5 11.177 11.87 11.737C12.24 12.297 12.41 12.977 12.34 13.657C12.27 14.337 11.97 14.967 11.49 15.447C11.19 15.747 10.83 15.987 10.43 16.147C10.03 16.307 9.6 16.387 9.17 16.377"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Social media links
const socialLinks = [
  {
    name: "Instagram",
    username: "@w2c.ro",
    url: "https://instagram.com/w2c.ro",
    icon: <Instagram className="h-5 w-5" />,
    color: "from-purple-600 to-pink-500",
    followers: "50K+",
  },
  {
    name: "TikTok",
    username: "@w2c.ro",
    url: "https://tiktok.com/@w2c.ro",
    icon: <TikTokIcon />,
    color: "from-gray-900 to-black",
    followers: "100K+",
  },
  {
    name: "YouTube",
    username: "@w2c.ro",
    url: "https://youtube.com/@w2c.ro",
    icon: <Youtube className="h-5 w-5" />,
    color: "from-red-700 to-red-600",
    followers: "25K+",
  },
  {
    name: "Twitter",
    username: "@w2c.ro",
    url: "https://twitter.com/w2c.ro",
    icon: <Twitter className="h-5 w-5" />,
    color: "from-blue-600 to-blue-500",
    followers: "15K+",
  },
]

// Website links
const websiteLinks = [
  {
    name: "Main Website",
    description: "Browse our full catalog of products",
    url: "/",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: "Products",
    description: "Explore our latest collections",
    url: "/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    name: "How To Order",
    description: "Learn how to place your first order",
    url: "/how-to",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    name: "Contact Us",
    description: "Get in touch with our team",
    url: "/contact",
    icon: <MessageCircle className="h-5 w-5" />,
  },
]

// Featured products
const featuredProducts = [
  {
    id: 1,
    name: "Nike Air Force 1",
    price: "$120",
    image: "/placeholder.svg?height=100&width=100",
    url: "/products/nike-air-force-1",
  },
  {
    id: 2,
    name: "Adidas Yeezy Boost",
    price: "$220",
    image: "/placeholder.svg?height=100&width=100",
    url: "/products/adidas-yeezy-boost",
  },
  {
    id: 3,
    name: "Jordan 4 Retro",
    price: "$190",
    image: "/placeholder.svg?height=100&width=100",
    url: "/products/jordan-4-retro",
  },
]

export default function PainyPage() {
  const [activeTab, setActiveTab] = useState("links")
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [likeCount, setLikeCount] = useState(1243)
  const [isLiked, setIsLiked] = useState(false)
  const [shareCount, setShareCount] = useState(358)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    copyToClipboard()
    setShareCount(shareCount + 1)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced cosmic background with animated stars and nebulae */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>

        {/* Animated stars */}
        <div className="absolute inset-0">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>

        {/* Nebula effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-red-900/5 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[100px] animate-pulse-slow delay-1000"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-repeat opacity-5"></div>
      </div>

      <div className="container max-w-md mx-auto px-4 py-16 relative z-10">
        {/* Enhanced Profile Section with animations and effects */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Profile Image with animated glow */}
          <motion.div className="relative w-32 h-32 mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 blur-sm animate-pulse"></div>
            <div className="absolute inset-0.5 rounded-full bg-black"></div>
            <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-red-500">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="W2C.RO Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating particles around the profile image */}
            <div className="absolute -top-2 -left-2 w-2 h-2 rounded-full bg-red-500 animate-float-slow"></div>
            <div className="absolute top-1 -right-2 w-1.5 h-1.5 rounded-full bg-red-400 animate-float-slow delay-500"></div>
            <div className="absolute -bottom-1 left-1/4 w-1 h-1 rounded-full bg-red-300 animate-float-slow delay-1000"></div>
          </motion.div>

          {/* Enhanced Profile Info with animated text */}
          <motion.h1
            className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-gradient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            W2C.RO
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative"
          >
            <p className="text-gray-400 text-center mb-2 max-w-xs">Your premier destination for replica products</p>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-white">{likeCount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="w-px h-8 bg-red-900/30"></div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-white">500+</div>
              <div className="text-xs text-gray-500">Products</div>
            </div>
            <div className="w-px h-8 bg-red-900/30"></div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-white">{shareCount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Shares</div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex gap-3 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    size="icon"
                    className={`rounded-full border-red-800 ${isLiked ? "bg-red-900/30 text-red-400" : "text-red-500 hover:bg-red-900/20 hover:text-red-400"} transition-all`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Unlike" : "Like"} profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="rounded-full border-red-800 text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-all"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="rounded-full border-red-800 text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-all"
                    size="sm"
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy profile link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </motion.div>

        {/* Enhanced Tabs with animations */}
        <div className="mb-8">
          <motion.div
            className="flex justify-center space-x-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={() => setActiveTab("links")}
              variant={activeTab === "links" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "links"
                  ? "bg-red-800 hover:bg-red-700 text-white"
                  : "border-red-800 text-gray-400 hover:text-white hover:bg-red-900/20"
              }`}
            >
              My Links
            </Button>
            <Button
              onClick={() => setActiveTab("social")}
              variant={activeTab === "social" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "social"
                  ? "bg-red-800 hover:bg-red-700 text-white"
                  : "border-red-800 text-gray-400 hover:text-white hover:bg-red-900/20"
              }`}
            >
              Follow Me
            </Button>
            <Button
              onClick={() => setActiveTab("products")}
              variant={activeTab === "products" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "products"
                  ? "bg-red-800 hover:bg-red-700 text-white"
                  : "border-red-800 text-gray-400 hover:text-white hover:bg-red-900/20"
              }`}
            >
              Products
            </Button>
          </motion.div>

          {/* Tab Content with enhanced animations */}
          <AnimatePresence mode="wait">
            {activeTab === "links" ? (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {websiteLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link href={link.url}>
                      <div className="group relative overflow-hidden">
                        {/* Enhanced glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/0 to-red-900/0 group-hover:from-red-900/20 group-hover:via-red-900/20 group-hover:to-red-900/0 transition-all duration-500"></div>

                        {/* Card content with improved styling */}
                        <div className="relative bg-gray-900/50 backdrop-blur-sm border border-red-900/20 hover:border-red-800/40 rounded-xl p-4 transition-all duration-300 flex items-center">
                          <div className="bg-gradient-to-br from-red-900 to-red-800 p-3 rounded-full mr-4 group-hover:shadow-[0_0_15px_rgba(180,0,0,0.5)] transition-all duration-300">
                            {link.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-white group-hover:text-red-400 transition-colors">
                              {link.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{link.description}</p>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Featured section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: websiteLinks.length * 0.1, duration: 0.5 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Featured</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/10 p-0"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="mr-1">Sort by</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 rounded-2xl blur-md"></div>
                      <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-4 border border-red-900/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-red-400 mr-2" />
                            <span className="text-sm text-gray-400">Latest Updates</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-400">4.9</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          New products added daily! Check out our latest arrivals and restocks.
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-red-400 mr-2" />
                            <span className="text-xs text-gray-400">5.2k views today</span>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : activeTab === "social" ? (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    className="block"
                  >
                    <div className="group relative overflow-hidden">
                      {/* Enhanced card content with improved styling */}
                      <div
                        className={`relative bg-gradient-to-r ${social.color} rounded-xl p-4 transition-all duration-300 transform hover:shadow-lg hover:shadow-red-900/20`}
                      >
                        <div className="flex items-center">
                          <div className="bg-white/10 p-2.5 rounded-full mr-4">{social.icon}</div>
                          <div>
                            <h3 className="font-medium text-lg text-white">{social.name}</h3>
                            <p className="text-white/70 text-sm">{social.username}</p>
                          </div>
                          <div className="ml-auto flex items-center">
                            <span className="text-white/70 text-sm mr-2">{social.followers}</span>
                            <ExternalLink className="h-5 w-5 text-white/70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}

                {/* Enhanced Social Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: socialLinks.length * 0.1, duration: 0.5 }}
                  className="mt-8"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 rounded-2xl blur-md"></div>
                    <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-6 border border-red-900/20">
                      <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 animate-gradient">
                        Our Community
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/50 rounded-lg p-4 text-center border border-red-900/10 hover:border-red-900/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(180,0,0,0.2)]">
                          <TikTokIcon />
                          <div className="text-2xl font-bold mt-2">1M+</div>
                          <div className="text-sm text-gray-400">TikTok Views</div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4 text-center border border-red-900/10 hover:border-red-900/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(180,0,0,0.2)]">
                          <Youtube className="h-5 w-5 mx-auto" />
                          <div className="text-2xl font-bold mt-2">300K+</div>
                          <div className="text-sm text-gray-400">YouTube Views</div>
                        </div>
                      </div>

                      {/* Added engagement metrics */}
                      <div className="mt-4 bg-black/30 rounded-lg p-4 border border-red-900/10">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Engagement Rate</h4>
                        <div className="w-full bg-gray-900 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-red-600 to-red-400 h-2.5 rounded-full"
                            style={{ width: "78%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">0%</span>
                          <span className="text-xs text-red-400">78%</span>
                          <span className="text-xs text-gray-500">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium text-white mb-4">Featured Products</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {featuredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Link href={product.url}>
                          <div className="relative overflow-hidden">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 rounded-2xl blur-md"></div>
                            <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-4 border border-red-900/20 flex items-center">
                              <div className="relative w-16 h-16 mr-4 rounded-lg overflow-hidden border border-red-900/30">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{product.name}</h4>
                                <p className="text-red-400">{product.price}</p>
                              </div>
                              <ExternalLink className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 rounded-2xl blur-md"></div>
                    <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-6 border border-red-900/20 text-center">
                      <h3 className="text-lg font-medium text-white mb-2">Explore Our Full Catalog</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Discover thousands of high-quality replica products at unbeatable prices.
                      </p>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white shadow-[0_0_15px_rgba(180,0,0,0.3)]"
                      >
                        <Link href="/products">View All Products</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Footer */}
        <motion.div
          className="text-center text-sm text-gray-600 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent mb-4"></div>
          <p>© {new Date().getFullYear()} W2C.RO. All rights reserved.</p>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        @keyframes float-slow {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .stars-small, .stars-medium, .stars-large {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.1;
          animation: twinkle 5s ease-in-out infinite;
        }
        
        .stars-medium {
          background-image: radial-gradient(3px 3px at 50px 160px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0));
          background-size: 300px 300px;
          animation: twinkle 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .stars-large {
          background-image: radial-gradient(4px 4px at 120px 120px, #fff, rgba(0,0,0,0)),
                            radial-gradient(3px 3px at 200px 250px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 300px 100px, #fff, rgba(0,0,0,0));
          background-size: 400px 400px;
          animation: twinkle 9s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}
