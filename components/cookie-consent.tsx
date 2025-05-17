"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-black border border-red-900/50 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-2">Cookies and GDPR!</h3>
      <p className="text-sm mb-3">
        For purposes such as displaying personalized content, we use cookies or similar technologies. By clicking
        "Accept", you agree to allow the collection of information through cookies or similar technologies. About the
        possibility of withdrawing consent, learn more about cookies in the section{" "}
        <Link href="/cookie-policy" className="text-red-700 hover:underline">
          Cookie Policy
        </Link>
      </p>
      <Button className="w-full bg-red-900 hover:bg-red-800 text-white" onClick={() => setIsVisible(false)}>
        Accept All
      </Button>
    </div>
  )
}

// Also export as default for backward compatibility
export default CookieConsent
