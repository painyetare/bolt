"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Truck,
  Package,
  Scale,
  Ruler,
  MapPin,
  Calculator,
  BarChart4,
  Clock,
  DollarSign,
  Info,
  Check,
  Trash2,
  Zap,
  ShieldCheck,
  FileText,
} from "lucide-react"

// Shipping line data based on cnfans.com
const shippingLines = [
  {
    id: "super-dhl",
    name: "Super DHL Line",
    provider: "CNFans Express",
    deliveryTime: "10-15 working days",
    firstKgPrice: 19.99,
    additionalKgPrice: 7.5,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000, // cm³/kg
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Truck />,
    color: "amber",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "yanwen",
    name: "Yanwen",
    provider: "CNFans Air",
    deliveryTime: "15-25 working days",
    firstKgPrice: 15.99,
    additionalKgPrice: 6.25,
    minWeight: 0.1,
    maxWeight: 20,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Clock />,
    color: "green",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "4px-om",
    name: "4PX-OM",
    provider: "4PX",
    deliveryTime: "20-30 working days",
    firstKgPrice: 14.99,
    additionalKgPrice: 5.9,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Package />,
    color: "blue",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "dhl-duty-free",
    name: "DHL Duty Free (Sensitive)",
    provider: "DHL",
    deliveryTime: "10-15 working days",
    firstKgPrice: 22.99,
    additionalKgPrice: 8.5,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Zap />,
    color: "yellow",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "eub-duty-free",
    name: "EUB Duty Free $6.0",
    provider: "EUB",
    deliveryTime: "15-25 working days",
    firstKgPrice: 16.99,
    additionalKgPrice: 6.0,
    minWeight: 0.1,
    maxWeight: 2,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <ShieldCheck />,
    color: "purple",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "eub-duty-free-2",
    name: "EUB Duty Free $8.99",
    provider: "EUB",
    deliveryTime: "15-25 working days",
    firstKgPrice: 18.99,
    additionalKgPrice: 8.99,
    minWeight: 0.1,
    maxWeight: 2,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <ShieldCheck />,
    color: "purple",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "eub-duty-free-3",
    name: "EUB Duty Free $6.8",
    provider: "EUB",
    deliveryTime: "15-25 working days",
    firstKgPrice: 16.8,
    additionalKgPrice: 6.8,
    minWeight: 0.1,
    maxWeight: 2,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 6000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <ShieldCheck />,
    color: "purple",
    description:
      "1 tax-free air cargo delivery line to Europe countries. The tax-free means it includes the prepayment for customs tax. Most items to purchase, and brands without copyright infringement can be shipped. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 6000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "triangulation-cargo",
    name: "Triangulation Air Cargo (Documents)",
    provider: "Special Cargo",
    deliveryTime: "8-15 working days",
    firstKgPrice: 24.99,
    additionalKgPrice: 10.5,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Documents only"],
    volumetricFactor: 6000,
    insuranceIncluded: true,
    insuranceCost: "Included",
    icon: <FileText className="h-4 w-4" />,
    color: "cyan",
    description:
      "1 tax-free air cargo delivery line to Europe countries. For documents and courier parcels. 2-3 day delivery in most cases. Please pay attention.",
  },
  {
    id: "e2m-line",
    name: "E2M Line",
    provider: "E2M",
    deliveryTime: "10-17 working days",
    firstKgPrice: 20.99,
    additionalKgPrice: 7.8,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 5000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Truck />,
    color: "green",
    description:
      "A customs-safe integration with cross-border postal services. It is recommended if you want to be careful about customs. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 5000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
  {
    id: "sfh-line",
    name: "SFH Line",
    provider: "SFH",
    deliveryTime: "10-15 working days",
    firstKgPrice: 19.99,
    additionalKgPrice: 7.5,
    minWeight: 0.1,
    maxWeight: 30,
    trackingAvailable: true,
    restrictions: ["Branded items", "Liquids", "Batteries"],
    volumetricFactor: 5000,
    insuranceIncluded: false,
    insuranceCost: "3% of declared value",
    icon: <Truck />,
    color: "green",
    description:
      "A customs-safe integration with cross-border postal services. It is recommended if you want to be careful about customs. Goods of the actual weight less certain weight, need to be calculated according to volume weight. Volumetric weight calculation formula: length × width × height (cm) ÷ 5000 = volumetric weight (kg). If the volumetric weight is greater than the actual weight, the volumetric weight shall prevail. Guarantee that all official taxes will have been handled before delivery to you.",
  },
]

type Country = {
  code: string
  name: string
  region: string
}

type CalculationHistoryItem = {
  id: number
  from: string
  to: string
  method: string
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  volumetricWeight?: number
  chargeableWeight: number
  cost: number
  timestamp: number
}

export default function ShippingCalculatorPage() {
  const [weight, setWeight] = useState<string>("")
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" })
  const [fromCountry, setFromCountry] = useState<string>("CN")
  const [toCountry, setToCountry] = useState<string>("RO")
  const [shippingMethod, setShippingMethod] = useState<string>("")
  const [result, setResult] = useState<null | {
    cost: number
    time: string
    chargeableWeight: number
    volumetricWeight?: number
    methodDetails: any
  }>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [calculationCount, setCalculationCount] = useState(0)
  const [recentCalculations, setRecentCalculations] = useState<CalculationHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<"calculator" | "history">("calculator")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [compareMode, setCompareMode] = useState(false)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedCalculations = localStorage.getItem("shippingCalculations")
    if (savedCalculations) {
      try {
        const parsed = JSON.parse(savedCalculations)
        setRecentCalculations(parsed)
        setCalculationCount(parsed.length)
      } catch (e) {
        console.error("Failed to parse calculations:", e)
      }
    }

    // Set loading to false after a short delay to ensure hydration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("shippingCalculations", JSON.stringify(recentCalculations))
  }, [recentCalculations])

  // Update the countries array to prioritize European countries since the shipping lines are for Europe
  const countries: Country[] = [
    { code: "RO", name: "Romania", region: "Europe" },
    { code: "DE", name: "Germany", region: "Europe" },
    { code: "FR", name: "France", region: "Europe" },
    { code: "UK", name: "United Kingdom", region: "Europe" },
    { code: "IT", name: "Italy", region: "Europe" },
    { code: "ES", name: "Spain", region: "Europe" },
    { code: "NL", name: "Netherlands", region: "Europe" },
    { code: "BE", name: "Belgium", region: "Europe" },
    { code: "PL", name: "Poland", region: "Europe" },
    { code: "CN", name: "China", region: "Asia" },
    { code: "US", name: "United States", region: "North America" },
    { code: "JP", name: "Japan", region: "Asia" },
    { code: "AU", name: "Australia", region: "Oceania" },
    { code: "BR", name: "Brazil", region: "South America" },
    { code: "MX", name: "Mexico", region: "North America" },
    { code: "RU", name: "Russia", region: "Europe" },
    { code: "IN", name: "India", region: "Asia" },
  ]

  const calculateShipping = () => {
    if (!weight || !fromCountry || !toCountry || (!shippingMethod && !compareMode)) return

    setIsCalculating(true)

    // Simulate calculation delay for better UX
    setTimeout(() => {
      // Calculate volumetric weight if dimensions are provided
      let volumetricWeight = 0
      if (dimensions.length && dimensions.width && dimensions.height) {
        const volume = Number(dimensions.length) * Number(dimensions.width) * Number(dimensions.height)

        // If comparing all methods, calculate for each method's volumetric factor
        if (compareMode) {
          const results = shippingLines.map((line) => {
            const volWeight = volume / line.volumetricFactor
            const actualWeight = Number(weight)
            const chargeableWeight = Math.max(volWeight, actualWeight)

            let cost
            if (chargeableWeight <= 1) {
              cost = line.firstKgPrice
            } else {
              cost = line.firstKgPrice + (chargeableWeight - 1) * line.additionalKgPrice
            }

            return {
              cost: Number(cost.toFixed(2)),
              time: line.deliveryTime,
              chargeableWeight: Number(chargeableWeight.toFixed(2)),
              volumetricWeight: Number(volWeight.toFixed(2)),
              methodDetails: line,
            }
          })

          setResult(results)

          // Add to history - just the cheapest option
          const cheapestOption = [...results].sort((a, b) => a.cost - b.cost)[0]

          const newCalculation = {
            id: Date.now(),
            from: countries.find((c) => c.code === fromCountry)?.name || fromCountry,
            to: countries.find((c) => c.code === toCountry)?.name || toCountry,
            method: cheapestOption.methodDetails.name,
            weight: Number(weight),
            dimensions: dimensions.length
              ? {
                  length: Number(dimensions.length),
                  width: Number(dimensions.width),
                  height: Number(dimensions.height),
                }
              : undefined,
            volumetricWeight: cheapestOption.volumetricWeight,
            chargeableWeight: cheapestOption.chargeableWeight,
            cost: cheapestOption.cost,
            timestamp: Date.now(),
          }

          setRecentCalculations((prev) => [newCalculation, ...prev.slice(0, 9)])
          setCalculationCount((prev) => prev + 1)
        } else {
          // Calculate for a single method
          const selectedMethod = shippingLines.find((m) => m.id === shippingMethod)
          if (!selectedMethod) {
            setIsCalculating(false)
            return
          }

          volumetricWeight = volume / selectedMethod.volumetricFactor
          const actualWeight = Number(weight)
          const chargeableWeight = Math.max(volumetricWeight, actualWeight)

          let cost
          if (chargeableWeight <= 1) {
            cost = selectedMethod.firstKgPrice
          } else {
            cost = selectedMethod.firstKgPrice + (chargeableWeight - 1) * selectedMethod.additionalKgPrice
          }

          const calculationResult = {
            cost: Number(cost.toFixed(2)),
            time: selectedMethod.deliveryTime,
            chargeableWeight: Number(chargeableWeight.toFixed(2)),
            volumetricWeight: Number(volumetricWeight.toFixed(2)),
            methodDetails: selectedMethod,
          }

          setResult(calculationResult)

          // Add to history
          const newCalculation = {
            id: Date.now(),
            from: countries.find((c) => c.code === fromCountry)?.name || fromCountry,
            to: countries.find((c) => c.code === toCountry)?.name || toCountry,
            method: selectedMethod.name,
            weight: Number(weight),
            dimensions: dimensions.length
              ? {
                  length: Number(dimensions.length),
                  width: Number(dimensions.width),
                  height: Number(dimensions.height),
                }
              : undefined,
            volumetricWeight: calculationResult.volumetricWeight,
            chargeableWeight: calculationResult.chargeableWeight,
            cost: calculationResult.cost,
            timestamp: Date.now(),
          }

          setRecentCalculations((prev) => [newCalculation, ...prev.slice(0, 9)])
          setCalculationCount((prev) => prev + 1)
        }
      } else {
        // No dimensions provided, use actual weight only
        if (compareMode) {
          const results = shippingLines.map((line) => {
            const actualWeight = Number(weight)

            let cost
            if (actualWeight <= 1) {
              cost = line.firstKgPrice
            } else {
              cost = line.firstKgPrice + (actualWeight - 1) * line.additionalKgPrice
            }

            return {
              cost: Number(cost.toFixed(2)),
              time: line.deliveryTime,
              chargeableWeight: actualWeight,
              methodDetails: line,
            }
          })

          setResult(results)

          // Add to history - just the cheapest option
          const cheapestOption = [...results].sort((a, b) => a.cost - b.cost)[0]

          const newCalculation = {
            id: Date.now(),
            from: countries.find((c) => c.code === fromCountry)?.name || fromCountry,
            to: countries.find((c) => c.code === toCountry)?.name || toCountry,
            method: cheapestOption.methodDetails.name,
            weight: Number(weight),
            chargeableWeight: Number(weight),
            cost: cheapestOption.cost,
            timestamp: Date.now(),
          }

          setRecentCalculations((prev) => [newCalculation, ...prev.slice(0, 9)])
          setCalculationCount((prev) => prev + 1)
        } else {
          // Calculate for a single method
          const selectedMethod = shippingLines.find((m) => m.id === shippingMethod)
          if (!selectedMethod) {
            setIsCalculating(false)
            return
          }

          const actualWeight = Number(weight)

          let cost
          if (actualWeight <= 1) {
            cost = selectedMethod.firstKgPrice
          } else {
            cost = selectedMethod.firstKgPrice + (actualWeight - 1) * selectedMethod.additionalKgPrice
          }

          const calculationResult = {
            cost: Number(cost.toFixed(2)),
            time: selectedMethod.deliveryTime,
            chargeableWeight: actualWeight,
            methodDetails: selectedMethod,
          }

          setResult(calculationResult)

          // Add to history
          const newCalculation = {
            id: Date.now(),
            from: countries.find((c) => c.code === fromCountry)?.name || fromCountry,
            to: countries.find((c) => c.code === toCountry)?.name || toCountry,
            method: selectedMethod.name,
            weight: Number(weight),
            chargeableWeight: actualWeight,
            cost: calculationResult.cost,
            timestamp: Date.now(),
          }

          setRecentCalculations((prev) => [newCalculation, ...prev.slice(0, 9)])
          setCalculationCount((prev) => prev + 1)
        }
      }

      setIsCalculating(false)
    }, 1000)
  }

  const resetForm = () => {
    setWeight("")
    setDimensions({ length: "", width: "", height: "" })
    setShippingMethod("")
    setResult(null)
    setCompareMode(false)
  }

  const clearHistory = () => {
    setRecentCalculations([])
    setCalculationCount(0)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Filter history based on search query
  const filteredHistory = recentCalculations.filter(
    (item) =>
      item.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return <ShippingCalculatorSkeleton />
  }

  return (
    <div className="min-h-screen bg-black text-white cosmic-bg">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                CNFans Shipping Calculator
              </h1>
              <p className="text-gray-400">Calculate shipping costs with actual CNFans shipping lines</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-red-600/50 hover:bg-red-900/20">
                English
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="bg-red-900/30 text-white border-red-900/50">
              <Truck className="h-3.5 w-3.5 mr-1" />
              International
            </Badge>
            <Badge variant="secondary" className="bg-amber-900/30 text-white border-amber-900/50">
              <Package className="h-3.5 w-3.5 mr-1" />
              CNFans Data
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/30 text-white border-blue-900/50">
              <Scale className="h-3.5 w-3.5 mr-1" />
              Volumetric Weight
            </Badge>
            <Badge variant="secondary" className="bg-green-900/30 text-white border-green-900/50">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Global
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search calculation history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black border-red-900/30 focus:border-red-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "calculator" ? "default" : "outline"}
                className={
                  activeTab === "calculator" ? "bg-red-900 hover:bg-red-800" : "border-red-600/50 hover:bg-red-900/20"
                }
                onClick={() => setActiveTab("calculator")}
              >
                Calculator
              </Button>
              <Button
                variant={activeTab === "history" ? "default" : "outline"}
                className={
                  activeTab === "history" ? "bg-red-900 hover:bg-red-800" : "border-red-600/50 hover:bg-red-900/20"
                }
                onClick={() => setActiveTab("history")}
              >
                History
                {recentCalculations.length > 0 && (
                  <span className="ml-2 bg-red-950 text-red-400 text-xs px-1.5 py-0.5 rounded-full">
                    {recentCalculations.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  {calculationCount}
                  <Calculator className="h-5 w-5 ml-2 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg">
                  {recentCalculations.length > 0
                    ? `$${(
                        recentCalculations.reduce((acc, curr) => acc + curr.cost, 0) / recentCalculations.length
                      ).toFixed(2)}`
                    : "-"}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600/50 hover:bg-red-900/20"
                    onClick={resetForm}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                    </svg>
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600/50 hover:bg-red-900/20"
                    onClick={clearHistory}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === "calculator" && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Package details */}
                  <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-red-500" />
                        Package Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2 flex items-center">
                          <Scale className="w-4 h-4 mr-2 text-red-500" />
                          Weight (kg)
                        </label>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="bg-black/50 border-red-900/30 focus:border-red-500"
                          placeholder="0.5"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-white text-sm font-medium flex items-center">
                            <Ruler className="w-4 h-4 mr-2 text-red-500" />
                            Dimensions (cm)
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center"
                          >
                            {showAdvanced ? "Hide dimensions" : "Show dimensions"}
                          </Button>
                        </div>

                        <AnimatePresence>
                          {showAdvanced && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-gray-400 text-xs mb-1">Length</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={dimensions.length}
                                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                                    className="bg-black/50 border-red-900/30 focus:border-red-500"
                                    placeholder="20"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-400 text-xs mb-1">Width</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={dimensions.width}
                                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                                    className="bg-black/50 border-red-900/30 focus:border-red-500"
                                    placeholder="15"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-400 text-xs mb-1">Height</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={dimensions.height}
                                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                                    className="bg-black/50 border-red-900/30 focus:border-red-500"
                                    placeholder="10"
                                  />
                                </div>
                              </div>

                              <div className="mt-2 text-xs text-gray-500 flex items-start">
                                <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                <span>
                                  Dimensions help calculate volumetric weight, which may affect shipping cost.
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping details */}
                  <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-red-500" />
                        Shipping Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">From Country</label>
                        <Select value={fromCountry} onValueChange={setFromCountry}>
                          <SelectTrigger className="bg-black/50 border-red-900/30 focus:border-red-500">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-red-900/30">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">To Country</label>
                        <Select value={toCountry} onValueChange={setToCountry}>
                          <SelectTrigger className="bg-black/50 border-red-900/30 focus:border-red-500">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-red-900/30">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-white text-sm font-medium">Shipping Method</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCompareMode(!compareMode)
                              if (!compareMode) {
                                setShippingMethod("")
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center"
                          >
                            {compareMode ? "Select single method" : "Compare all methods"}
                          </Button>
                        </div>

                        {!compareMode && (
                          <div className="grid grid-cols-1 gap-3">
                            {shippingLines.map((method) => (
                              <div
                                key={method.id}
                                className={`border ${
                                  shippingMethod === method.id
                                    ? "border-red-500/50 bg-red-900/20"
                                    : "border-gray-800/80 bg-black/50 hover:border-red-500/30"
                                } rounded-lg p-3 cursor-pointer transition-colors`}
                                onClick={() => setShippingMethod(method.id)}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                      shippingMethod === method.id
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-gray-800/50 text-gray-400"
                                    }`}
                                  >
                                    {method.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">{method.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{method.deliveryTime}</div>
                                  </div>
                                  <div className="ml-auto">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 ${
                                        shippingMethod === method.id
                                          ? "border-red-500 bg-red-500/20"
                                          : "border-gray-600"
                                      } flex items-center justify-center`}
                                    >
                                      {shippingMethod === method.id && (
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2 ml-11">
                                  First kg: ${method.firstKgPrice.toFixed(2)}, Additional kg: $
                                  {method.additionalKgPrice.toFixed(2)}
                                  {method.maxWeight < 5 && (
                                    <span className="block mt-1 text-amber-500">Max weight: {method.maxWeight}kg</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {compareMode && (
                          <div className="bg-black/50 border border-red-500/30 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <BarChart4 className="w-5 h-5 mr-2 text-red-400" />
                              <span className="text-white">Compare all shipping methods</span>
                            </div>
                            <p className="text-xs text-gray-400">
                              We'll calculate costs for all available shipping methods and show you the best options.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add a warning message for non-European destinations since these shipping lines are for Europe */}
                {fromCountry && toCountry && countries.find((c) => c.code === toCountry)?.region !== "Europe" && (
                  <div className="mt-4 bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 text-sm">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-amber-400">Warning: Non-European Destination</p>
                        <p className="text-gray-300 mt-1">
                          The shipping lines shown are primarily for European destinations. Rates and availability may
                          differ for {countries.find((c) => c.code === toCountry)?.name}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculate button */}
                <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm mb-6">
                  <CardContent className="pt-6">
                    <Button
                      onClick={calculateShipping}
                      disabled={
                        isCalculating || !weight || !fromCountry || !toCountry || (!shippingMethod && !compareMode)
                      }
                      className="w-full bg-red-900 hover:bg-red-800 text-white"
                    >
                      {isCalculating ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-5 h-5 mr-2" />
                          Calculate Shipping
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Results section */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {Array.isArray(result) ? (
                        // Compare mode results
                        <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm relative mb-6">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>

                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                                <BarChart4 className="w-4 h-4 text-white" />
                              </div>
                              Shipping Options Comparison
                            </CardTitle>
                            <CardDescription>Comparing all available shipping methods for your package</CardDescription>
                          </CardHeader>

                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-800">
                                    <th className="text-left py-2 px-4">Shipping Method</th>
                                    <th className="text-left py-2 px-4">Delivery Time</th>
                                    <th className="text-left py-2 px-4">Weight</th>
                                    <th className="text-left py-2 px-4">Cost</th>
                                    <th className="text-left py-2 px-4"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result
                                    .filter(
                                      (r) =>
                                        r.chargeableWeight >= r.methodDetails.minWeight &&
                                        r.chargeableWeight <= r.methodDetails.maxWeight,
                                    )
                                    .sort((a, b) => a.cost - b.cost)
                                    .map((r, index) => (
                                      <tr
                                        key={r.methodDetails.id}
                                        className={`border-b border-gray-800 ${index === 0 ? "bg-red-900/10" : ""}`}
                                      >
                                        <td className="py-3 px-4">
                                          <div className="flex items-center">
                                            {index === 0 && (
                                              <Badge className="mr-2 bg-red-900/50 text-white border-red-500/50">
                                                Best
                                              </Badge>
                                            )}
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-${r.methodDetails.color}-900/20 text-${r.methodDetails.color}-400`}
                                            >
                                              {r.methodDetails.icon}
                                            </div>
                                            <div>
                                              <div className="font-medium">{r.methodDetails.name}</div>
                                              <div className="text-xs text-gray-500">{r.methodDetails.provider}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4">{r.time}</td>
                                        <td className="py-3 px-4">
                                          {r.volumetricWeight ? (
                                            <div>
                                              <div>{r.chargeableWeight} kg</div>
                                              <div className="text-xs text-gray-500">
                                                (Volumetric: {r.volumetricWeight} kg)
                                              </div>
                                            </div>
                                          ) : (
                                            <div>{r.chargeableWeight} kg</div>
                                          )}
                                        </td>
                                        <td className="py-3 px-4 font-bold">${r.cost}</td>
                                        <td className="py-3 px-4">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-red-600/50 hover:bg-red-900/20"
                                            onClick={() => {
                                              setCompareMode(false)
                                              setShippingMethod(r.methodDetails.id)
                                            }}
                                          >
                                            Select
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-6 text-sm text-gray-400 bg-black/50 border border-gray-800/50 rounded-lg p-4">
                              <div className="flex items-start">
                                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                                <div>
                                  Prices shown are based on CNFans shipping data. Actual shipping costs may vary
                                  depending on package specifics and customs processing.
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        // Single method result
                        <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>

                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                              Shipping Estimate: {result.methodDetails.name}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div className="bg-black/50 border border-gray-800/80 rounded-lg p-5 flex flex-col items-center justify-center">
                                <DollarSign className="w-8 h-8 text-red-500 mb-2" />
                                <div className="text-gray-400 text-sm mb-1">Estimated Cost</div>
                                <div className="text-3xl font-bold text-white">${result.cost}</div>
                              </div>

                              <div className="bg-black/50 border border-gray-800/80 rounded-lg p-5 flex flex-col items-center justify-center">
                                <Clock className="w-8 h-8 text-red-500 mb-2" />
                                <div className="text-gray-400 text-sm mb-1">Delivery Time</div>
                                <div className="text-2xl font-bold text-white">{result.time}</div>
                              </div>

                              <div className="bg-black/50 border border-gray-800/80 rounded-lg p-5 flex flex-col items-center justify-center">
                                <Scale className="w-8 h-8 text-red-500 mb-2" />
                                <div className="text-gray-400 text-sm mb-1">Chargeable Weight</div>
                                <div className="text-2xl font-bold text-white">{result.chargeableWeight} kg</div>
                                {result.volumetricWeight && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Volumetric: {result.volumetricWeight} kg
                                  </div>
                                )}
                              </div>
                            </div>
                            // Add a description section to the single method result card
                            <div className="bg-black/50 border border-gray-800/80 rounded-lg p-5 mb-6">
                              <h3 className="text-lg font-medium mb-3 flex items-center">
                                <Info className="w-5 h-5 mr-2 text-red-500" />
                                Shipping Line Description
                              </h3>
                              <p className="text-sm text-gray-400">{result.methodDetails.description}</p>
                            </div>
                            <div className="bg-black/50 border border-gray-800/80 rounded-lg p-5 mb-6">
                              <h3 className="text-lg font-medium mb-3 flex items-center">
                                <Info className="w-5 h-5 mr-2 text-red-500" />
                                Shipping Details
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500 mb-1">Provider</div>
                                  <div className="text-white">{result.methodDetails.provider}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Tracking Available</div>
                                  <div className="text-white">
                                    {result.methodDetails.trackingAvailable ? "Yes" : "No"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Insurance</div>
                                  <div className="text-white">
                                    {result.methodDetails.insuranceIncluded
                                      ? "Included"
                                      : result.methodDetails.insuranceCost}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Restrictions</div>
                                  <div className="text-white">{result.methodDetails.restrictions.join(", ")}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">First kg Price</div>
                                  <div className="text-white">${result.methodDetails.firstKgPrice.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Additional kg Price</div>
                                  <div className="text-white">${result.methodDetails.additionalKgPrice.toFixed(2)}</div>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 bg-black/50 border border-gray-800/50 rounded-lg p-4">
                              <div className="flex items-start">
                                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                                <div>
                                  This is an estimate based on CNFans shipping data. Actual shipping costs and delivery
                                  times may vary depending on carrier, package specifics, and customs processing.
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Calculation History</h2>
                  {recentCalculations.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/50 hover:bg-red-900/20"
                      onClick={clearHistory}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>

                {filteredHistory.length > 0 ? (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredHistory.map((calc) => (
                      <motion.div key={calc.id} variants={item}>
                        <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">${calc.cost}</CardTitle>
                              <Badge variant="outline" className="border-red-600/50 text-red-400">
                                {calc.method}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(calc.timestamp)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                              <div>
                                <div className="text-gray-500 mb-1">From</div>
                                <div className="text-white">{calc.from}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">To</div>
                                <div className="text-white">{calc.to}</div>
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="text-gray-500 mb-1">Weight</div>
                              <div className="text-white flex items-center">
                                <Scale className="h-3 w-3 mr-1" />
                                {calc.chargeableWeight} kg
                                {calc.volumetricWeight && calc.volumetricWeight > calc.weight && (
                                  <span className="text-xs text-gray-500 ml-2">(Volumetric)</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm text-center py-12">
                    <CardContent>
                      <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-medium mb-2">No Calculation History</h3>
                      <p className="text-gray-400 mb-4">Your calculation history will appear here</p>
                      <Button
                        variant="default"
                        className="bg-red-900 hover:bg-red-800"
                        onClick={() => setActiveTab("calculator")}
                      >
                        Start Calculating
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

const ShippingCalculatorSkeleton = () => (
  <div className="min-h-screen bg-black text-white cosmic-bg">
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-gray-700 rounded"></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 w-full bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="h-64 bg-gray-700 rounded-lg"></div>
          <div className="h-64 bg-gray-700 rounded-lg"></div>
        </div>

        <div className="h-24 bg-gray-700 rounded-lg mb-6"></div>
      </div>
    </main>
  </div>
)
