"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSellerStore } from "@/data/sellers"

export default function SellersIndexPage() {
  const router = useRouter()
  const { currentSeller } = useSellerStore()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (currentSeller) {
      router.push("/dashboard")
    } else {
      // Otherwise redirect to login
      router.push("/sellers/login")
    }
  }, [currentSeller, router])

  // This page is just a redirect, so we don't need to render anything
  return null
}
