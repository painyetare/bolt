"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  ChevronDown,
  Filter,
  MapPin,
  Search,
  Star,
  Users,
  Package,
  X,
  Clock,
  AlignLeft,
  Grid,
  List,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from "lucide-react"
import { useSellerStore } from "@/data/sellers"
import SellerCard from "@/components/seller-card"
import { motion, AnimatePresence } from "framer-motion"

export default function SellersPage() {
  const router = useRouter()
  const { sellers } = useSellerStore()
  const [filteredSellers, setFilteredSellers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("rating")
  const [filterOption, setFilterOption] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState([0])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [activeFilters, setActiveFilters] = useState([])
  const [page, setPage] = useState(1)
  const itemsPerPage = 12
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchInputRef = useRef(null)

  // Get all unique specialties from sellers
  const allSpecialties = [...new Set(sellers.flatMap((seller) => seller.specialties || []).filter(Boolean))].sort()

  // Calculate seller statistics
  const totalSellers = sellers.length
  const verifiedSellers = sellers.filter((s) => s.verified).length
  const totalProducts = sellers.reduce((sum, seller) => sum + seller.products.length, 0)
  const averageRating =
    sellers.length > 0 ? (sellers.reduce((sum, seller) => sum + seller.rating, 0) / sellers.length).toFixed(1) : 0

  useEffect(() => {
    if (sellers) {
      let filtered = [...sellers]

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (seller) =>
            seller.name.toLowerCase().includes(query) ||
            seller.description.toLowerCase().includes(query) ||
            (seller.specialties && seller.specialties.some((s) => s.toLowerCase().includes(query))) ||
            (seller.location && seller.location.toLowerCase().includes(query)),
        )
      }

      // Apply category filter
      if (filterOption !== "all") {
        filtered = filtered.filter((seller) => {
          if (filterOption === "verified") return seller.verified
          if (filterOption === "unverified") return !seller.verified
          return false
        })
      }

      // Apply specialty filter
      if (specialtyFilter !== "all") {
        filtered = filtered.filter((seller) => {
          if (seller.specialties) {
            return seller.specialties.some((s) => s.toLowerCase() === specialtyFilter.toLowerCase())
          }
          return false
        })
      }

      // Apply rating filter
      if (ratingFilter[0] > 0) {
        filtered = filtered.filter((seller) => seller.rating >= ratingFilter[0])
      }

      // Apply sorting
      if (sortOption === "rating") {
        filtered.sort((a, b) => b.rating - a.rating)
      } else if (sortOption === "products") {
        filtered.sort((a, b) => b.products.length - a.products.length)
      } else if (sortOption === "followers") {
        filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0))
      } else if (sortOption === "newest") {
        filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
      } else if (sortOption === "alphabetical") {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      }

      setFilteredSellers(filtered)
      setIsLoading(false)

      // Update active filters
      const newActiveFilters = []
      if (filterOption !== "all") newActiveFilters.push(filterOption)
      if (specialtyFilter !== "all") newActiveFilters.push(specialtyFilter)
      if (ratingFilter[0] > 0) newActiveFilters.push(`${ratingFilter[0]}+ stars`)
      setActiveFilters(newActiveFilters)
    }
  }, [sellers, searchQuery, sortOption, filterOption, specialtyFilter, ratingFilter])

  const resetFilters = () => {
    setSearchQuery("")
    setFilterOption("all")
    setSpecialtyFilter("all")
    setRatingFilter([0])
    setSortOption("rating")
    setPage(1)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const removeFilter = (filter) => {
    if (filter.includes("stars")) {
      setRatingFilter([0])
    } else if (filter === "verified" || filter === "unverified") {
      setFilterOption("all")
    } else {
      setSpecialtyFilter("all")
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage)
  const paginatedSellers = filteredSellers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Featured sellers (top 3 by rating)
  const featuredSellers = [...sellers]
    .filter((seller) => seller.verified)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  // Sort options with icons
  const sortOptions = [
    { value: "rating", label: "Highest Rating", icon: <Star className="h-4 w-4 mr-2 text-yellow-400" /> },
    { value: "products", label: "Most Products", icon: <Package className="h-4 w-4 mr-2 text-blue-400" /> },
    { value: "followers", label: "Most Followers", icon: <Users className="h-4 w-4 mr-2 text-green-400" /> },
    { value: "newest", label: "Newest First", icon: <Clock className="h-4 w-4 mr-2 text-purple-400" /> },
    { value: "alphabetical", label: "Alphabetical", icon: <AlignLeft className="h-4 w-4 mr-2 text-gray-400" /> },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black cosmic-bg">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] opacity-5 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              Discover Trusted Sellers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Find verified sellers with high-quality products and exceptional service
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 rounded-full blur-md transition-opacity duration-300 ${isSearchFocused ? "opacity-30" : "opacity-0"}`}
              ></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search by name, specialty, or location..."
                  className="pl-12 py-6 bg-black/60 border-red-500/30 text-white text-lg rounded-full shadow-lg focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-black to-red-950/30 rounded-lg p-4 backdrop-blur-sm border border-red-500/20 shadow-lg"
            >
              <Users className="h-6 w-6 text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">{totalSellers}</p>
              <p className="text-gray-400 text-sm">Total Sellers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-black to-green-950/30 rounded-lg p-4 backdrop-blur-sm border border-green-500/20 shadow-lg"
            >
              <Check className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">{verifiedSellers}</p>
              <p className="text-gray-400 text-sm">Verified Sellers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-black to-blue-950/30 rounded-lg p-4 backdrop-blur-sm border border-blue-500/20 shadow-lg"
            >
              <ShoppingBag className="h-6 w-6 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
              <p className="text-gray-400 text-sm">Total Products</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-br from-black to-yellow-950/30 rounded-lg p-4 backdrop-blur-sm border border-yellow-500/20 shadow-lg"
            >
              <Star className="h-6 w-6 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">{averageRating}</p>
              <p className="text-gray-400 text-sm">Average Rating</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Sellers */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Featured Sellers</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSellers.map((seller, index) => (
            <SellerCard key={seller.id} seller={seller} featured={true} index={index} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white flex items-center"
          >
            <Users className="h-6 w-6 mr-3 text-red-400" />
            All Sellers
          </motion.h2>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-950/30 flex items-center gap-2 shadow-md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>

            <Select
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[180px] bg-black/60 border-red-500/30 text-white shadow-md">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-black border-red-500/30 text-white">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="flex items-center">
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden md:flex">
              <div className="flex bg-black/60 border border-red-500/30 rounded-md overflow-hidden shadow-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-3 ${viewMode === "grid" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-3 ${viewMode === "list" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 shadow-sm"
                onClick={() => removeFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={resetFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="bg-black/60 border-red-500/30 mb-8 p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-400" />
                      Seller Type
                    </h3>
                    <Select
                      value={filterOption}
                      onValueChange={(value) => {
                        setFilterOption(value)
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-red-500/30 text-white">
                        <SelectItem value="all">All Sellers</SelectItem>
                        <SelectItem value="verified">
                          <div className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-400" />
                            Verified Only
                          </div>
                        </SelectItem>
                        <SelectItem value="unverified">
                          <div className="flex items-center">
                            <X className="h-4 w-4 mr-2 text-gray-400" />
                            Unverified Only
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-blue-400" />
                      Specialty
                    </h3>
                    <Select
                      value={specialtyFilter}
                      onValueChange={(value) => {
                        setSpecialtyFilter(value)
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
                        <SelectValue placeholder="Filter by specialty" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-red-500/30 text-white max-h-[200px]">
                        <SelectItem value="all">All Specialties</SelectItem>
                        {allSpecialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty.toLowerCase()}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-400" />
                      Minimum Rating: <span className="ml-2 text-yellow-400 font-bold">{ratingFilter[0]}</span>
                    </h3>
                    <Slider
                      defaultValue={[0]}
                      max={5}
                      step={0.5}
                      value={ratingFilter}
                      onValueChange={(value) => {
                        setRatingFilter(value)
                        setPage(1)
                      }}
                      className="py-4"
                    />
                    <div className="flex justify-between text-gray-400 text-sm mt-2">
                      <span>0</span>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="text-gray-400 mb-6 flex items-center">
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          Showing <span className="text-white font-medium mx-1">{filteredSellers.length}</span>
          {filteredSellers.length === 1 ? "seller" : "sellers"}
        </div>

        {/* Seller Grid/List */}
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="hidden md:flex bg-black/60 border border-red-500/30 mb-6 shadow-md">
            <TabsTrigger value="grid" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Grid className="h-4 w-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-0">
            {filteredSellers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedSellers.map((seller, index) => (
                    <SellerCard key={seller.id} seller={seller} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-950/30"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          className={
                            pageNum === page
                              ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                              : "border-red-500/30 text-red-400 hover:bg-red-950/30"
                          }
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-950/30"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-black/40 rounded-lg border border-red-500/20 shadow-lg"
              >
                <Search className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Sellers Found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any sellers matching your search criteria. Try adjusting your filters or search
                  terms.
                </p>
                <Button
                  className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {filteredSellers.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedSellers.map((seller, index) => (
                    <motion.div
                      key={seller.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Card className="bg-black border border-red-500/20 overflow-hidden group hover:border-red-500/40 transition-colors">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 bg-gradient-to-br from-red-900 to-red-700 p-6 flex items-center justify-center relative overflow-hidden">
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="h-20 w-20 rounded-full overflow-hidden bg-black/40 border-2 border-white/20 relative z-10">
                              {seller.logo ? (
                                <img
                                  src={seller.logo || "/placeholder.svg"}
                                  alt={seller.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-red-900 text-white text-2xl font-bold">
                                  {seller.name.charAt(0)}
                                </div>
                              )}
                              {seller.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-black">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold text-white">{seller.name}</h3>
                                  {seller.verified && (
                                    <Badge className="bg-green-600">
                                      <Check className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center mt-1 mb-3">
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-yellow-400 font-medium ml-2 mr-2">{seller.rating}</span>
                                  <span className="text-gray-500 mx-1">•</span>
                                  <span className="text-white mr-2">{seller.products.length} products</span>
                                  <span className="text-gray-500 mx-1">•</span>
                                  <span className="text-white">{seller.followers || 0} followers</span>
                                </div>
                              </div>

                              <div className="hidden md:flex items-center">
                                <Button
                                  className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                                  onClick={() =>
                                    router.push(`/sellers/${seller.username || seller.name.toLowerCase()}`)
                                  }
                                >
                                  View Products
                                </Button>
                              </div>
                            </div>

                            {seller.location && (
                              <div className="flex items-center text-gray-400 text-sm mb-3">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{seller.location}</span>
                              </div>
                            )}

                            <p className="text-gray-400 mb-4 line-clamp-2">{seller.description}</p>

                            {/* Product Categories */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {seller.products &&
                                  seller.products.some(
                                    (p) =>
                                      p.category?.toLowerCase().includes("footwear") ||
                                      p.category?.toLowerCase().includes("shoes"),
                                  ) && (
                                    <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-500/30">
                                      <ShoppingBag className="h-3 w-3 mr-1" />
                                      Footwear
                                    </Badge>
                                  )}
                                {seller.products &&
                                  seller.products.some(
                                    (p) =>
                                      p.category?.toLowerCase().includes("apparel") ||
                                      p.category?.toLowerCase().includes("clothing"),
                                  ) && (
                                    <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-500/30">
                                      <ShoppingBag className="h-3 w-3 mr-1" />
                                      Athletic Apparel
                                    </Badge>
                                  )}
                                {seller.products &&
                                  seller.products.some(
                                    (p) =>
                                      p.category?.toLowerCase().includes("equipment") ||
                                      p.category?.toLowerCase().includes("gear"),
                                  ) && (
                                    <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-500/30">
                                      <Package className="h-3 w-3 mr-1" />
                                      Sports Equipment
                                    </Badge>
                                  )}
                              </div>
                            </div>

                            {seller.specialties && seller.specialties.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {seller.specialties.map((specialty, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="border-red-500/30 text-gray-300 bg-black/40"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="mt-4 md:hidden">
                              <Button
                                className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                                onClick={() => router.push(`/sellers/${seller.username || seller.name.toLowerCase()}`)}
                              >
                                View Products
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-950/30"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          className={
                            pageNum === page
                              ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                              : "border-red-500/30 text-red-400 hover:bg-red-950/30"
                          }
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-950/30"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-black/40 rounded-lg border border-red-500/20 shadow-lg"
              >
                <Search className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Sellers Found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any sellers matching your search criteria. Try adjusting your filters or search
                  terms.
                </p>
                <Button
                  className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-none"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Become a Seller CTA */}
      <div className="container mx-auto px-4 py-16 mb-16">
        <div className="bg-gradient-to-br from-black to-red-950/30 rounded-xl p-8 border border-red-500/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">Become a Seller on Repgalaxy</h2>
              <p className="text-gray-300 mb-6">
                Join our growing community of trusted sellers and reach thousands of customers looking for quality
                products. Set up your store, list your products, and start selling today!
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>No setup fees, get started for free</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Powerful seller dashboard and analytics</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Direct communication with customers</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <Button
                className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg"
                onClick={() => router.push("/sellers/become-seller")}
              >
                Apply to Become a Seller
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-gray-400 mt-4 text-sm">Applications are typically reviewed within 48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
