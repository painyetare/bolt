interface QualityBadgeProps {
  quality: string
}

export function QualityBadge({ quality }: QualityBadgeProps) {
  let badgeColor = ""
  const textColor = "text-white"
  let label = quality

  switch (quality.toUpperCase()) {
    case "AAA+":
      badgeColor = "bg-gradient-to-r from-yellow-500 to-amber-500"
      label = "AAA+"
      break
    case "AAA":
      badgeColor = "bg-gradient-to-r from-yellow-600 to-amber-600"
      label = "AAA"
      break
    case "AA":
      badgeColor = "bg-gradient-to-r from-blue-500 to-blue-600"
      label = "AA"
      break
    case "A":
      badgeColor = "bg-gradient-to-r from-green-500 to-green-600"
      label = "A"
      break
    case "B":
      badgeColor = "bg-gradient-to-r from-orange-500 to-orange-600"
      label = "B"
      break
    case "PREMIUM":
      badgeColor = "bg-gradient-to-r from-purple-500 to-purple-600"
      label = "Premium"
      break
    case "STANDARD":
      badgeColor = "bg-gradient-to-r from-gray-500 to-gray-600"
      label = "Standard"
      break
    default:
      badgeColor = "bg-gradient-to-r from-gray-700 to-gray-800"
      label = quality
  }

  return <div className={`${badgeColor} px-2 py-1 rounded-md text-xs font-bold ${textColor} shadow-lg`}>{label}</div>
}
