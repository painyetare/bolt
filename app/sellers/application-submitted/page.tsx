import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ApplicationSubmittedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for applying to become a seller. We've received your application and will review it within 1-3
          business days. You'll receive an email notification once your application has been reviewed.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-red-900 hover:bg-red-800">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-red-600/50 hover:bg-red-900/20">
            <Link href="/sellers">Browse Sellers</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
