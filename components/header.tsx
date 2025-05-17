"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/lib/i18n"
import MobileMenu from "@/components/mobile-menu"
import LanguageSwitcher from "@/components/language-switcher"
import { DiscordProfile } from "@/components/discord-profile"

export function Header() {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-24">
              <Image
                src="/placeholder.svg?height=50&width=120"
                alt="W2C Logo"
                width={120}
                height={50}
                className="h-12 w-auto"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("Home")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
            <Link
              href="/products"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/products") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("Products")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/products") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
            <Link
              href="/sellers"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/sellers") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("Sellers")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/sellers") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
            <Link
              href="/faq"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/faq") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("FAQ")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/faq") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
            <Link
              href="/how-to"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/how-to") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("How To")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/how-to") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
            <Link
              href="/tools"
              className={`font-medium hover:text-red-400 transition-colors nav-link relative overflow-hidden group ${
                isActive("/tools") ? "text-red-400" : ""
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {t("Tools")}
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red-900 transform ${
                  isActive("/tools") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-300`}
              ></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            <Link
              href="https://discord.gg/4PTQa7zsTs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border border-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(255,0,0,0.5)] hidden md:block hover:scale-105 transform duration-300"
            >
              {t("Join Discord")}
            </Link>
            <div className="flex items-center gap-2">
              <DiscordProfile />
            </div>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

// Also export as default for backward compatibility
export default Header
