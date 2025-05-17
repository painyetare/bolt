"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white hover:text-red-400 transition-colors" aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg z-50 border-t border-red-900/30"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("Home")}
                </Link>
                <Link
                  href="/products"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/products") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("Products")}
                </Link>
                <Link
                  href="/sellers"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/sellers") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("Sellers")}
                </Link>
                <Link
                  href="/faq"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/faq") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("FAQ")}
                </Link>
                <Link
                  href="/how-to"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/how-to") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("How To")}
                </Link>
                <Link
                  href="/tools"
                  onClick={closeMenu}
                  className={`py-2 px-4 rounded-md ${
                    isActive("/tools") ? "bg-red-900/20 text-red-400" : "hover:bg-red-900/10"
                  }`}
                >
                  {t("Tools")}
                </Link>

                <div className="pt-2 border-t border-red-900/20">
                  <Link
                    href="https://discord.gg/4PTQa7zsTs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-black border border-red-600/50 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-red-900/20 transition-all"
                  >
                    {t("Join Discord")}
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
