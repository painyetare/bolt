"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  image: string
  title: string
  price: string
  productId?: string
}

interface ProductSlideshowProps {
  products: Product[]
  title?: string
  viewAllLink?: string
}

export function ProductSlideshow({
  products,
  title = "Featured Products",
  viewAllLink = "/products",
}: ProductSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const productsPerSlide = 4

  // Calculate total number of slides
  const totalSlides = Math.ceil(products.length / productsPerSlide)

  // Update visible products when currentSlide changes
  useEffect(() => {
    const startIndex = currentSlide * productsPerSlide
    setVisibleProducts(products.slice(startIndex, startIndex + productsPerSlide))
  }, [currentSlide, products])

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalSlides])

  // Handle navigation
  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
          {title}
        </h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
            <span className="mr-2">View All</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="slideshow-container relative py-8 px-4">
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="product-slide group transform transition-all hover:scale-103">
                <div className="relative aspect-square overflow-hidden mb-4 rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/50 z-10 group-hover:opacity-70 transition-opacity duration-200"></div>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-contain p-4 z-0 transition-transform duration-300 group-hover:scale-108"
                  />
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-red-400 transition-colors duration-200">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-red-300">{product.price}</p>
                  <div className="mt-4 text-xs text-red-300 opacity-70">CLICK FOR DETAILS</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-900/50 hover:bg-red-800 rounded-full h-10 w-10 p-0"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-900/50 hover:bg-red-800 rounded-full h-10 w-10 p-0"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slide indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? "w-8 bg-red-500" : "w-2 bg-red-800"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default ProductSlideshow
