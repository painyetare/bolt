"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TruckIcon,
  Link2Icon,
  Ruler,
  DollarSign,
  Wrench,
  ArrowRight,
  Chrome,
  Download,
  Star,
  Zap,
  ShoppingCart,
  Globe,
} from "lucide-react"
import Footer from "@/components/footer"
import LanguageSwitcher from "@/components/language-switcher"
import { useTranslation } from "@/lib/i18n"

export default function ToolsPage() {
  const { t, language } = useTranslation()

  const tools = [
    {
      id: "shipping-calculator",
      name: "Shipping Calculator",
      description: "Calculate shipping costs for your packages from various agents",
      icon: <TruckIcon className="h-8 w-8 text-red-500" />,
      link: "/tools/shipping-calculator",
      color: "from-red-600 to-red-800",
    },
    {
      id: "link-converter",
      name: "Link Converter",
      description: "Convert between Chinese shopping sites and CNFans links",
      icon: <Link2Icon className="h-8 w-8 text-red-500" />,
      link: "/tools/link-converter",
      color: "from-red-600 to-red-800",
    },
    {
      id: "size-converter",
      name: "Size Converter",
      description: "Convert between different international size standards",
      icon: <Ruler className="h-8 w-8 text-red-500" />,
      link: "/tools/size-converter",
      color: "from-red-600 to-red-800",
      comingSoon: true,
    },
    {
      id: "currency-converter",
      name: "Currency Converter",
      description: "Convert between different currencies with real-time rates",
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      link: "/tools/currency-converter",
      color: "from-red-600 to-red-800",
      comingSoon: true,
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const extensionFeatures = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      title: "One-Click Conversion",
      description: "Instantly convert any Chinese shopping link with a single click",
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-yellow-400" />,
      title: "Direct to Cart",
      description: "Add items directly to your CNFans cart from any Chinese shopping site",
    },
    {
      icon: <Globe className="h-5 w-5 text-yellow-400" />,
      title: "Multi-Site Support",
      description: "Works with Taobao, Tmall, 1688, Weidian, and more",
    },
    {
      icon: <Star className="h-5 w-5 text-yellow-400" />,
      title: "Price Comparison",
      description: "Compare prices across different sellers instantly",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,0,0,0.1)_0,rgba(0,0,0,0)_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,0,0,0.08)_0,rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(180,0,0,0.08)_0,rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0,rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/30 text-red-400 text-sm font-medium mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Utility Tools
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400"
            >
              Tools
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl"
            >
              Useful tools to help you with your shopping experience on Chinese websites
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <LanguageSwitcher />
          </motion.div>
        </div>

        {/* Chrome Extension Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 relative overflow-hidden rounded-2xl border border-red-900/30 bg-gradient-to-br from-black/80 via-red-950/10 to-black/80 backdrop-blur-sm"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,rgba(180,0,0,0.15)_0,rgba(0,0,0,0)_70%)]"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,rgba(180,0,0,0.1)_0,rgba(0,0,0,0)_70%)]"></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-900/40 text-red-400 text-sm font-medium">
                <Chrome className="h-4 w-4" />
                <span>New</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400">
                CNFans Chrome Extension
              </h2>

              <p className="text-lg text-gray-300">
                Shop smarter with our official Chrome extension. Convert links, compare prices, and add items directly
                to your cart from any Chinese shopping site with just one click.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {extensionFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1 p-1.5 rounded-full bg-red-950/50 border border-red-900/30">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href="https://chrome.google.com/webstore/category/extensions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white border border-red-900/50 group hover:shadow-[0_0_15px_rgba(180,0,0,0.3)] transition-all duration-300">
                    <span className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Install Extension
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </span>
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-800 rounded-lg blur opacity-30"></div>
                <div className="relative bg-black/80 border border-red-900/50 rounded-lg overflow-hidden shadow-2xl">
                  <div className="h-10 bg-gradient-to-r from-gray-900 to-black flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto flex items-center bg-gray-800/50 rounded-full px-3 py-1 text-xs text-gray-400">
                      <Chrome className="h-3 w-3 mr-1.5" /> CNFans Extension
                    </div>
                  </div>
                  <div className="p-4">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="CNFans Chrome Extension Screenshot"
                      className="w-full rounded border border-gray-800"
                    />
                    <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded text-sm text-gray-400">
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2 flex items-center justify-center">
                          <Link2Icon className="h-2 w-2 text-white" />
                        </div>
                        <span className="text-gray-300">Taobao Link Detected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">https://item.taobao.com/item.htm?id=12345...</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-red-900/50 bg-red-950/30 hover:bg-red-900/50 text-red-400"
                        >
                          Convert
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href={tool.comingSoon ? "#" : tool.link} className={tool.comingSoon ? "cursor-not-allowed" : ""}>
                <Card className="h-full bg-black/40 backdrop-blur-sm border-red-900/20 hover:border-red-600/40 shadow-lg hover:shadow-red-900/20 transition-all duration-300 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gradient-to-br from-red-950/50 to-black/50 rounded-xl border border-red-900/30 shadow-inner transform group-hover:scale-105 transition-transform duration-300">
                        <div className="text-red-400 group-hover:text-red-300 transition-colors duration-300">
                          {tool.icon}
                        </div>
                      </div>

                      {tool.comingSoon && (
                        <span className="absolute top-4 right-6 bg-red-950/70 text-red-200 text-xs font-medium px-3 py-1 rounded-full border border-red-900/40 shadow-lg">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-2xl mt-4 font-bold text-white group-hover:text-red-200 transition-colors duration-300">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {tool.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      className={`w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white border border-red-900/50 group-hover:shadow-[0_0_15px_rgba(180,0,0,0.3)] transition-all duration-300 ${
                        tool.comingSoon ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={tool.comingSoon}
                    >
                      {tool.comingSoon ? (
                        "Coming Soon"
                      ) : (
                        <span className="flex items-center justify-center w-full">
                          Use Tool
                          <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* More Tools Coming Soon */}
        <motion.div
          className="mt-28 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-900/50"></div>
            <div className="mx-4 p-3 bg-red-950/30 rounded-full border border-red-900/30 shadow-inner">
              <Wrench className="h-6 w-6 text-red-400" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-900/50"></div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400">
            More Tools Coming Soon
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            We're constantly working on new tools to make your shopping experience better. Check back soon for more
            useful features.
          </p>
        </motion.div>

        {/* Ready to Shop */}
        <motion.div
          className="mt-28 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto px-8 py-12 border border-red-900/20 rounded-2xl bg-gradient-to-b from-black/80 to-red-950/10 shadow-[0_0_30px_rgba(180,0,0,0.15)] backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-400">
              Ready to Shop?
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Browse our extensive collection of high-quality replica products at unbeatable prices.
            </p>

            <Link href="/products">
              <Button className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white px-8 py-6 rounded-full text-lg font-medium hover:scale-105 transform transition-all duration-300 shadow-[0_0_20px_rgba(180,0,0,0.3)] border border-red-900/50">
                <span className="flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
