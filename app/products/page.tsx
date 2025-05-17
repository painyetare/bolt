"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useProductStore, type Product, type ProductQuality } from "@/data/products"
import { brands } from "@/data/brands"
import { categories } from "@/data/categories"
import { Search, SlidersHorizontal, X, FileSearch } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { RequestProductDialog } from "@/components/request-product-dialog"
import { Switch } from "@/components/ui/switch"
import { useWomenProducts } from "@/data/women-products"

export default function ProductsPage() {
  const { t } = useTranslation()
  const { products: mensProducts } = useProductStore()
  const { products: womensProducts } = useWomenProducts()

  const [isWomenSection, setIsWomenSection] = useState(false)
  const products = isWomenSection ? womensProducts : mensProducts

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedQuality, setSelectedQuality] = useState<ProductQuality | "">("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [sortOption, setSortOption] = useState<string>("newest")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Apply filters and search
  useEffect(() => {
    let result = [...products]

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((product) =>
        product.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase()),
      )
    }

    // Apply brand filter
    if (selectedBrand && selectedBrand !== "all") {
      const brandId = Number.parseInt(selectedBrand)
      result = result.filter((product) => product.brandId === brandId)
    }

    // Apply quality filter
    if (selectedQuality && selectedQuality !== "all") {
      result = result.filter((product) => product.quality === selectedQuality)
    }

    // Apply price range filter
    result = result.filter((product) => product.numericPrice >= priceRange[0] && product.numericPrice <= priceRange[1])

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result = [...result].sort((a, b) => a.numericPrice - b.numericPrice)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.numericPrice - a.numericPrice)
        break
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
      default:
        result = [...result].sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
          return dateB - dateA
        })
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedQuality, priceRange, sortOption])

  // Update filtered products when switching between men's and women's sections
  useEffect(() => {
    // Reset page to 1 when switching sections
    setCurrentPage(1)
  }, [isWomenSection])

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedBrand("")
    setSelectedQuality("")
    setPriceRange([0, 200])
    setSortOption("newest")
  }

  // Get max price from all products for the slider
  const maxPrice = Math.max(...products.map((p) => p.numericPrice), 200)

  // Toggle women's section
  const toggleWomenSection = () => {
    setIsWomenSection(!isWomenSection)
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isWomenSection ? "women-section" : "cosmic-bg"}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{isWomenSection ? t("Women's Products") : t("All Products")}</h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isWomenSection ? "text-pink-300" : "text-gray-400"}`}>
              {t("Women's Section")}
            </span>
            <Switch
              checked={isWomenSection}
              onCheckedChange={toggleWomenSection}
              className={isWomenSection ? "data-[state=checked]:bg-pink-500" : ""}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? t("Hide Filters") : t("Show Filters")}
          </Button>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Sort by")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("Newest")}</SelectItem>
              <SelectItem value="price-low">{t("Price: Low to High")}</SelectItem>
              <SelectItem value="price-high">{t("Price: High to Low")}</SelectItem>
              <SelectItem value="rating">{t("Highest Rated")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t("Search products...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <RequestProductDialog>
          <Button
            className={`${isWomenSection ? "bg-pink-500 hover:bg-pink-600" : "bg-red-500 hover:bg-red-600"} text-white flex items-center gap-2`}
          >
            <FileSearch size={18} />
            {t("Request a Product")}
          </Button>
        </RequestProductDialog>
      </div>

      {showFilters && (
        <div
          className={`bg-black/40 backdrop-blur-sm ${isWomenSection ? "border-pink-900/20" : "border-red-900/20"} border rounded-lg p-4 mb-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">{t("Filters")}</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              {t("Reset All")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("Category")}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("All Categories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Categories")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t("Brand")}</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder={t("All Brands")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Brands")}</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t("Quality")}</label>
              <Select
                value={selectedQuality}
                onValueChange={(value) => setSelectedQuality(value as ProductQuality | "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("All Qualities")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Qualities")}</SelectItem>
                  <SelectItem value="AAA+">{t("AAA+")}</SelectItem>
                  <SelectItem value="AA">{t("AA")}</SelectItem>
                  <SelectItem value="Budget">{t("Budget")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {t("Price Range")}: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className={`mt-6 ${isWomenSection ? "women-slider" : ""}`}
              />
            </div>
          </div>

          {/* Active filters */}
          {(selectedCategory || selectedBrand || selectedQuality || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedCategory("")}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {selectedBrand && selectedBrand !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {brands.find((b) => b.id.toString() === selectedBrand)?.name || selectedBrand}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setSelectedBrand("")}>
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {selectedQuality && selectedQuality !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedQuality}
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setSelectedQuality("")}>
                    <X size={12} />
                  </Button>
                </Badge>
              )}

              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${priceRange[0]} - ${priceRange[1]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setPriceRange([0, maxPrice])}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      <Separator className="mb-8" />

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {t("Showing")} {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} {t("of")}{" "}
          {filteredProducts.length} {t("products")}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.imageUrl}
                productId={product.productId}
                quality={product.quality}
                slug={product.slug}
                qcPictureUrl={product.qcPictureUrl}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t("Previous")}
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 p-0 ${isWomenSection && currentPage === page ? "bg-pink-600 hover:bg-pink-700" : ""}`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("Next")}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          className={`text-center py-12 bg-black/40 backdrop-blur-sm ${isWomenSection ? "border-pink-900/20" : "border-red-900/20"} border rounded-lg`}
        >
          <h3 className="text-xl font-semibold mb-2">{t("No products found")}</h3>
          <p className="text-muted-foreground mb-4">{t("Try adjusting your filters or search query")}</p>
          <Button onClick={resetFilters} className={isWomenSection ? "bg-pink-600 hover:bg-pink-700" : ""}>
            {t("Reset All Filters")}
          </Button>
        </div>
      )}

      {/* Women's section specific styles */}
      <style jsx global>{`
        .women-section {
          background-color: #0a0a0a;
          position: relative;
          background-image: radial-gradient(circle, rgba(255, 105, 180, 0.05) 1px, transparent 1px),
            radial-gradient(circle, rgba(255, 105, 180, 0.03) 2px, transparent 2px),
            radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 100px 100px, 70px 70px;
          background-position: 0 0, 25px 25px, 35px 35px;
        }
        
        .women-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.2) 0%, rgba(0, 0, 0, 0.95) 100%);
          z-index: -1;
        }
        
        .women-section .data-\[state\=checked\]\:bg-pink-500[data-state=checked] {
          background-color: rgb(236, 72, 153);
        }
        
        .women-section .women-slider [data-state="range"] {
          background-color: rgb(236, 72, 153);
        }
        
        .women-section .women-slider [data-state="dragging"] {
          background-color: rgb(236, 72, 153);
        }
        
        .women-section .women-slider [data-state="dragging"] > span {
          background-color: rgb(236, 72, 153);
        }
        
        .women-section .women-slider [data-state="range"] > span {
          background-color: rgb(236, 72, 153);
          border-color: rgb(236, 72, 153);
        }
      `}</style>
    </div>
  )
}
