"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Package, MessageCircle, Settings, Home, LogOut } from "lucide-react"
import { useSellerStore } from "@/app/sellerStore" // Update import path

export default function SellerMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { logout } = useSellerStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/sellers/login"
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
    { href: "/dashboard/seller-products", label: "My Products", icon: <Package className="h-5 w-5 mr-2" /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageCircle className="h-5 w-5 mr-2" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-500/20 md:hidden">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-red-500">
          Seller Dashboard
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black border-red-500/20 text-white">
            <div className="flex flex-col h-full">
              <div className="py-6">
                <h2 className="text-xl font-bold text-red-500 mb-6">Seller Dashboard</h2>
                <nav className="space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                        pathname === link.href
                          ? "bg-red-900/30 text-white"
                          : "text-gray-400 hover:bg-red-900/20 hover:text-white"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto pb-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
