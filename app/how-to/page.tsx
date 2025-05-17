"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  HelpCircle,
  Search,
  ChevronRight,
  ArrowUp,
  CheckCircle,
  ExternalLink,
  Clock,
  Package,
  Camera,
  Award,
  MessageSquare,
  Users,
  FileText,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export default function HowToPage() {
  const { t, language } = useTranslation()
  const [activeSection, setActiveSection] = useState("ordering")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [animateBackground, setAnimateBackground] = useState(false)

  // Refs for each section
  const orderingRef = useRef<HTMLDivElement>(null)
  const paymentRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const qualityRef = useRef<HTMLDivElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  // Tab configuration
  const tabs = [
    {
      id: "ordering",
      label: "Ordering",
      icon: <ShoppingBag className="h-5 w-5 mr-2" />,
      ref: orderingRef,
    },
    {
      id: "payment",
      label: "Payment",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
      ref: paymentRef,
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: <Truck className="h-5 w-5 mr-2" />,
      ref: shippingRef,
    },
    {
      id: "quality",
      label: "Quality Check",
      icon: <Shield className="h-5 w-5 mr-2" />,
      ref: qualityRef,
    },
    {
      id: "support",
      label: "Support",
      icon: <HelpCircle className="h-5 w-5 mr-2" />,
      ref: supportRef,
    },
  ]

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, id: string) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Offset to account for header/navigation
        behavior: "smooth",
      })
      setActiveSection(id)
      setAnimateBackground(true)
      setTimeout(() => setAnimateBackground(false), 1000)
    }
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Check which section is in view
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300)

      // Determine which section is in view
      const scrollPosition = window.scrollY + 150 // Offset for better detection

      // Check each section
      const sections = [
        { ref: orderingRef, id: "ordering" },
        { ref: paymentRef, id: "payment" },
        { ref: shippingRef, id: "shipping" },
        { ref: qualityRef, id: "quality" },
        { ref: supportRef, id: "support" },
      ]

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Content for each section
  const sectionContent = {
    ordering: [
      {
        title: "Browse Products",
        description: "Find the perfect items from our curated selection",
        longDescription:
          "Browse through our extensive catalog of products from trusted sellers. Use filters to narrow down your search by category, brand, price, and quality rating.",
        icon: <Search className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Select Items",
        description: "Choose products that match your preferences",
        longDescription:
          "Review product details, quality ratings, and seller information. Compare options to find the perfect match for your needs and budget.",
        icon: <ShoppingBag className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Review Cart",
        description: "Check your selections before checkout",
        longDescription:
          "Review your cart to confirm product selections, quantities, and total cost including shipping. Make any final adjustments before proceeding to checkout.",
        icon: <CheckCircle className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
    ],
    payment: [
      {
        title: "Secure Checkout",
        description: "Complete your purchase with confidence",
        longDescription:
          "Our secure checkout process protects your personal and payment information. All transactions are encrypted and processed through trusted payment providers.",
        icon: <Shield className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Multiple Payment Options",
        description: "Choose from various payment methods",
        longDescription:
          "We accept multiple payment methods including credit/debit cards, PayPal, and cryptocurrency. Select the option that works best for you at checkout.",
        icon: <CreditCard className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Order Confirmation",
        description: "Receive confirmation of your purchase",
        longDescription:
          "After completing your purchase, you'll receive an order confirmation email with details of your order. You can also view your order status in your account dashboard.",
        icon: <CheckCircle className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
    ],
    shipping: [
      {
        title: "Processing Time",
        description: "Your order is prepared for shipping",
        longDescription:
          "After placing your order, sellers typically take 1-3 days to process and prepare your items for shipping. This includes quality checks and secure packaging.",
        icon: <Clock className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Tracking",
        description: "Monitor your package's journey",
        longDescription:
          "Once your order ships, you'll receive a tracking number to monitor your package's progress. Updates are provided at key shipping milestones.",
        icon: <Package className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Delivery Time",
        description: "Estimated arrival of your package",
        longDescription:
          "Standard shipping typically takes 10-20 days depending on your location. Express shipping options are available at checkout for faster delivery in 5-10 days.",
        icon: <Truck className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
    ],
    quality: [
      {
        title: "Inspection Process",
        description: "Quality verification before shipping",
        longDescription:
          "Sellers perform quality checks before shipping to ensure products meet our standards. This includes checking for defects, verifying materials, and confirming accuracy.",
        icon: <Shield className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Photo Verification",
        description: "Visual confirmation of your items",
        longDescription:
          "Many sellers provide QC (Quality Control) photos of your actual item before shipping. This allows you to verify the product meets your expectations.",
        icon: <Camera className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Satisfaction Guarantee",
        description: "Our commitment to your happiness",
        longDescription:
          "We stand behind the quality of products from our verified sellers. If you receive an item with significant quality issues, contact support within 7 days of delivery.",
        icon: <Award className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
    ],
    support: [
      {
        title: "Customer Assistance",
        description: "Help when you need it",
        longDescription:
          "Our support team is available to assist with any questions or concerns. Contact us through the website, email, or Discord for prompt assistance.",
        icon: <MessageSquare className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "Discord Community",
        description: "Join our active community",
        longDescription:
          "Connect with other buyers and sellers in our Discord community. Get advice, share experiences, and stay updated on the latest products and deals.",
        icon: <Users className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
      {
        title: "FAQ Resources",
        description: "Find answers to common questions",
        longDescription:
          "Browse our comprehensive FAQ section for answers to common questions about ordering, shipping, returns, and more. Updated regularly based on user feedback.",
        icon: <FileText className="h-12 w-12 text-red-400" />,
        image: "/placeholder.svg?height=220&width=400",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white" ref={topRef}>
      {/* Enhanced cosmic background with animated stars and nebulae */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>

        {/* Animated stars */}
        <div className="absolute inset-0">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>

        {/* Nebula effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-red-900/5 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[100px] animate-pulse-slow delay-1000"></div>

        {/* Animated glow when changing sections */}
        <div
          className={cn(
            "absolute inset-0 bg-red-900/5 transition-opacity duration-1000",
            animateBackground ? "opacity-30" : "opacity-0",
          )}
        ></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-repeat opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Enhanced header with animated text and particles */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="relative">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-gradient">
              How To Shop
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

            {/* Floating particles around the title */}
            <div className="absolute -top-2 -left-2 w-2 h-2 rounded-full bg-red-500 animate-float-slow"></div>
            <div className="absolute top-1 -right-2 w-1.5 h-1.5 rounded-full bg-red-400 animate-float-slow delay-500"></div>
            <div className="absolute -bottom-4 left-1/4 w-1 h-1 rounded-full bg-red-300 animate-float-slow delay-1000"></div>
          </div>

          <Link
            href="/"
            className="group relative overflow-hidden bg-black/60 border border-red-900/50 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-900/20 transition-all shadow-[0_0_15px_rgba(180,0,0,0.3)] backdrop-blur-sm"
          >
            {/* Button glow effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0 group-hover:via-red-900/40 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>

            <span className="relative inline-flex items-center">
              Back to Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </Link>
        </motion.div>

        {/* Enhanced navigation with glass morphism and active indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sticky top-16 z-30 py-4 mb-10 backdrop-blur-md bg-black/70 rounded-xl border border-red-900/20 shadow-lg"
        >
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => scrollToSection(tab.ref, tab.id)}
                className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ${
                  activeSection === tab.id
                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-[0_0_15px_rgba(180,0,0,0.5)]"
                    : "bg-black/40 border border-red-900/30 hover:bg-red-900/20 text-gray-300 hover:text-white"
                }`}
                role="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <span className={`transition-transform duration-300 ${activeSection === tab.id ? "scale-110" : ""}`}>
                  {tab.icon}
                </span>
                <span className="ml-2">{tab.label}</span>
                {activeSection === tab.id && (
                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced content sections with improved styling and animations */}
        <div className="space-y-24">
          {Object.entries(sectionContent).map(([sectionId, items], sectionIndex) => (
            <div
              key={sectionId}
              ref={tabs.find((tab) => tab.id === sectionId)?.ref}
              id={sectionId}
              className="relative transform transition-all duration-500"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {/* Enhanced glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 rounded-2xl blur-md"></div>

                {/* Section content with glass morphism */}
                <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-8 shadow-[0_0_25px_rgba(180,0,0,0.2)] border border-red-900/20">
                  <div className="flex items-center mb-8">
                    {tabs
                      .find((tab) => tab.id === sectionId)
                      ?.icon.type({
                        className: "h-8 w-8 text-red-500 mr-4",
                      })}
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                      {sectionId === "ordering"
                        ? "How To Order"
                        : sectionId === "payment"
                          ? "Payment Methods"
                          : sectionId === "shipping"
                            ? "Shipping Information"
                            : sectionId === "quality"
                              ? "Quality Assurance"
                              : "Customer Support"}
                    </h2>
                  </div>

                  <div className="space-y-12">
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          {/* Enhanced icon container with floating animation */}
                          <div className="flex-shrink-0 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-red-600/20 to-red-900/20 rounded-2xl blur-md group-hover:from-red-600/30 group-hover:to-red-900/30 transition-all duration-300"></div>
                            <div className="relative bg-gradient-to-br from-red-900/40 to-black p-4 rounded-2xl border border-red-900/30 shadow-[0_0_15px_rgba(180,0,0,0.2)] mb-4 md:mb-0 md:mt-2 group-hover:shadow-[0_0_20px_rgba(180,0,0,0.3)] transition-all duration-300">
                              {item.icon}

                              {/* Floating particles */}
                              <div className="absolute top-0 right-0 w-1 h-1 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-float-slow"></div>
                              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-float-slow delay-300"></div>
                            </div>
                          </div>

                          {/* Content with enhanced typography and layout */}
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-red-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-gray-200 mb-4 text-lg leading-relaxed">{item.description}</p>
                            <p className="text-gray-400 mb-6 leading-relaxed">{item.longDescription}</p>

                            {/* Enhanced image container with hover effects */}
                            <div className="mt-4 rounded-xl overflow-hidden border border-red-900/30 bg-gradient-to-br from-black to-red-950/20 group-hover:from-black group-hover:to-red-950/30 transition-all duration-300 shadow-inner relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1500"></div>
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                width={400}
                                height={220}
                                className="w-full h-[220px] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Separator with enhanced styling */}
                        {index < items.length - 1 && (
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent my-8"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}

          {/* Need More Help Section with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative transform transition-all duration-500"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 rounded-2xl blur-md"></div>
            <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-8 shadow-[0_0_25px_rgba(180,0,0,0.2)] border border-red-900/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Need More Help?</h3>
                <Link href="/faq" className="flex items-center text-red-400 hover:text-red-300 transition-colors group">
                  <span className="relative">
                    Visit FAQ
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
              <p className="text-gray-300 mb-8 text-lg">{t.supportDesc}</p>
              <div className="mt-4">
                <Link
                  href="https://discord.gg/4PTQa7zsTs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group inline-flex items-center bg-gradient-to-r from-red-900 to-red-800 text-white px-8 py-3 rounded-full font-medium hover:from-red-800 hover:to-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:scale-105 transform duration-300 overflow-hidden"
                >
                  {/* Button glow effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>

                  <span className="relative flex items-center">
                    Join Discord
                    <ExternalLink className="h-5 w-5 ml-2" />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced banner image with parallax effect */}
      <div className="w-full mt-24 relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-red-950/30"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=300&width=1920')] bg-cover bg-center opacity-20 transform scale-110 hover:scale-105 transition-transform duration-5000 ease-in-out"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-red-400 animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-red-500 animate-float-slow delay-300"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-red-400 animate-float-slow delay-700"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-white mb-4"
            >
              We're Here To Help Every Step Of The Way
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-800 mx-auto rounded-full"
            ></motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced back to top button with animations */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-black/80 border border-red-900/50 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 z-50 group ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6 text-red-500 group-hover:text-red-400 transition-colors" />

        {/* Button glow effect */}
        <span className="absolute inset-0 rounded-full bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-300"></span>
      </button>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        
        @keyframes float-slow {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .stars-small, .stars-medium, .stars-large {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.1;
          animation: twinkle 5s ease-in-out infinite;
        }
        
        .stars-medium {
          background-image: radial-gradient(3px 3px at 50px 160px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0));
          background-size: 300px 300px;
          animation: twinkle 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .stars-large {
          background-image: radial-gradient(4px 4px at 120px 120px, #fff, rgba(0,0,0,0)),
                            radial-gradient(3px 3px at 200px 250px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 300px 100px, #fff, rgba(0,0,0,0));
          background-size: 400px 400px;
          animation: twinkle 9s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}
