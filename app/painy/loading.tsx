import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-white">Loading...</h2>
    </div>
  )
}
