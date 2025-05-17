import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SellerStatusIndicatorProps {
  sellerId: string
  className?: string
}

export function SellerStatusIndicator({ sellerId, className }: SellerStatusIndicatorProps) {
  // In a real app, you would fetch the seller's status from an API or store
  // For demo purposes, we'll use a simple algorithm based on the seller ID
  const getSellerStatus = (id: string) => {
    // Convert the ID to a number for deterministic status
    const numericValue = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Use modulo to get a status (0 = offline, 1 = away, 2 = online)
    const statusCode = numericValue % 3

    switch (statusCode) {
      case 0:
        return { status: "offline", label: "Offline", color: "bg-gray-400" }
      case 1:
        return { status: "away", label: "Away", color: "bg-yellow-400" }
      case 2:
        return { status: "online", label: "Online", color: "bg-green-400" }
      default:
        return { status: "offline", label: "Offline", color: "bg-gray-400" }
    }
  }

  const { status, label, color } = getSellerStatus(sellerId)

  const getResponseTime = (status: string) => {
    switch (status) {
      case "online":
        return "Usually responds within minutes"
      case "away":
        return "Usually responds within a few hours"
      case "offline":
        return "Usually responds within 24 hours"
      default:
        return "Response time unknown"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("w-3 h-3 rounded-full", color, className)} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-gray-400">{getResponseTime(status)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
