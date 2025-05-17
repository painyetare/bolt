import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { ProductSlideshow } from "@/components/product-slideshow"
import { FeaturedCreator } from "@/components/featured-creator"
import { TestimonialCard } from "@/components/testimonial-card"
import { CookieConsent } from "@/components/cookie-consent"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Shield, Truck } from "lucide-react"

export default function Home() {
  // Get featured categories (first 6)
  const featuredCategories = categories.slice(0, 6)
  const featuredProducts = products.filter((p) => p.featured).slice(0, 10)

  return (
    <div className="flex min-h-screen flex-col cosmic-bg">
      <main className="flex-1">
        {/* Hero Section - Centered with removed image */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black to-transparent opacity-90" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('https://i.imgur.com/0n4Uvms.png')", // Need to upload: Hero background image
            }}
          />
          <div className="container relative z-20 px-4 py-28 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="max-w-xl text-center">
                <div className="inline-block mb-4 rounded-full bg-red-900/30 px-4 py-1.5 text-sm font-medium text-red-400 border border-red-800/50 backdrop-blur-sm">
                  Premium Rep Catalog
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  <span className="block">Elevate Your</span>
                  <span className="block mt-1 text-red-500 text-glow-red">Rep Game</span>
                </h1>
                <p className="mb-8 text-lg text-white/80 leading-relaxed">
                  Discover the best replica products from trusted sellers. Your one-stop destination for high-quality
                  reps with verified sellers and detailed product information.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/how-to">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-white border-red-800 hover:bg-red-900/20 px-8 py-6 rounded-xl"
                    >
                      How It Works
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - New section */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black p-6 rounded-xl border border-red-900/30 shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:translate-y-[-5px]">
                <div className="bg-red-900/20 p-3 rounded-full w-fit mb-4">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Sellers</h3>
                <p className="text-gray-400">
                  All sellers are verified and rated by our community for reliability and quality.
                </p>
              </div>
              <div className="bg-black p-6 rounded-xl border border-red-900/30 shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:translate-y-[-5px]">
                <div className="bg-red-900/20 p-3 rounded-full w-fit mb-4">
                  <Truck className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Shipping Guides</h3>
                <p className="text-gray-400">
                  Detailed shipping guides and calculators to help you get your products safely.
                </p>
              </div>
              <div className="bg-black p-6 rounded-xl border border-red-900/30 shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:translate-y-[-5px]">
                <div className="bg-red-900/20 p-3 rounded-full w-fit mb-4">
                  <ShoppingBag className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Ratings</h3>
                <p className="text-gray-400">
                  Detailed quality ratings and reviews for all products to ensure you know what you're getting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Enhanced with better styling */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Browse our extensive collection of high-quality replica products across various categories
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCategories.map((category) => (
                <CategoryCard key={category.name} name={category.name} image={category.image} count={category.count} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/products">
                <Button variant="outline" className="border-red-800 hover:bg-red-900/20 text-white">
                  View All Categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Slideshow - Enhanced with better styling */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Featured Products</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our handpicked selection of the highest quality replica products available right now
              </p>
            </div>
            <ProductSlideshow products={featuredProducts} />
          </div>
        </section>

        {/* Featured Creator - Enhanced with better styling */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Featured Creator</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Learn from our community's most knowledgeable members</p>
            </div>
            <FeaturedCreator />
          </div>
        </section>

        {/* Testimonials - Enhanced with better styling */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">What Our Users Say</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Hear from our community members about their experiences</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <TestimonialCard
                name="Alex Johnson"
                avatar="/placeholder.svg?height=100&width=100" // Need to upload: User avatar image
                rating={5}
                text="W2C.RO has completely changed how I shop for reps. The quality of products I've found through this platform is unmatched. The sellers are reliable and the community is super helpful!"
              />
              <TestimonialCard
                name="Sarah Chen"
                avatar="/placeholder.svg?height=100&width=100" // Need to upload: User avatar image
                rating={4}
                text="I love how easy it is to find exactly what I'm looking for. The detailed product information and seller ratings give me confidence in my purchases. Will definitely keep using this platform."
              />
              <TestimonialCard
                name="Michael Rodriguez"
                avatar="/placeholder.svg?height=100&width=100" // Need to upload: User avatar image
                rating={5}
                text="The community here is amazing. I've learned so much about reps and found some incredible deals. Highly recommend to anyone getting into the rep game. Best rep site out there!"
              />
            </div>
          </div>
        </section>

        {/* CTA Section - New section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Rep Game?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our community today and discover the best replica products from trusted sellers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]"
                  >
                    Browse Products
                  </Button>
                </Link>
                <Link href="https://discord.gg/4PTQa7zsTs" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-red-800 hover:bg-red-900/20 px-8 py-6 rounded-xl"
                  >
                    Join Discord
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CookieConsent />
    </div>
  )
}
