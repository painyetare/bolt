"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, HelpCircle, ChevronRight, ArrowRight, X, MessageCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)

  // FAQ categories with their questions and answers
  const faqCategories = [
    {
      id: "general",
      title: "General",
      icon: <HelpCircle className="h-4 w-4" />,
      questions: [
        {
          id: "what-is",
          question: "What is Painy?",
          answer:
            "Painy is a platform that connects you with trusted sellers offering high-quality replica products. We curate and verify sellers to ensure you get the best shopping experience.",
        },
        {
          id: "how-works",
          question: "How does Painy work?",
          answer:
            "Painy works by connecting buyers with verified sellers. Browse products, read reviews, and purchase directly through our platform for a seamless shopping experience with buyer protection.",
        },
        {
          id: "account",
          question: "Do I need an account to use Painy?",
          answer:
            "While browsing products doesn't require an account, creating one allows you to save favorites, track orders, and receive personalized recommendations. Registration is free and only takes a minute.",
        },
      ],
    },
    {
      id: "products",
      title: "Products",
      icon: <Search className="h-4 w-4" />,
      questions: [
        {
          id: "product-quality",
          question: "How is product quality determined?",
          answer:
            "Products are rated based on accuracy to retail, materials used, and overall craftsmanship. Our quality ratings range from budget to premium, helping you make informed decisions.",
        },
        {
          id: "product-authenticity",
          question: "Are these products authentic?",
          answer:
            "No, products listed on Painy are replicas. We're transparent about this and focus on connecting you with sellers who offer the best quality replicas at reasonable prices.",
        },
        {
          id: "product-warranty",
          question: "Do products come with warranty?",
          answer:
            "Warranty policies vary by seller. Most trusted sellers offer some form of quality guarantee. Check the seller's profile for specific warranty information before purchasing.",
        },
      ],
    },
    {
      id: "orders",
      title: "Orders",
      icon: <ChevronRight className="h-4 w-4" />,
      questions: [
        {
          id: "order-place",
          question: "How do I place an order?",
          answer:
            "Select your desired product, choose any available options, and click 'Add to Cart'. Proceed to checkout, enter shipping details, select payment method, and confirm your order.",
        },
        {
          id: "order-track",
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can also view tracking information in your account dashboard under 'My Orders'.",
        },
        {
          id: "order-cancel",
          question: "Can I cancel my order?",
          answer:
            "Orders can be cancelled before they ship. Contact the seller or our support team immediately if you need to cancel. Once shipped, you'll need to follow the return process.",
        },
      ],
    },
    {
      id: "shipping",
      title: "Shipping",
      icon: <ArrowRight className="h-4 w-4" />,
      questions: [
        {
          id: "shipping-time",
          question: "How long does shipping take?",
          answer:
            "Shipping times vary by location and shipping method. Standard shipping typically takes 10-20 days, while express options can deliver in 5-10 days. Detailed estimates are provided at checkout.",
        },
        {
          id: "shipping-cost",
          question: "How much does shipping cost?",
          answer:
            "Shipping costs depend on weight, destination, and shipping method. We offer various options from budget to express. The exact cost will be calculated at checkout.",
        },
        {
          id: "shipping-international",
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to most countries worldwide. Some restrictions may apply based on local regulations. Enter your country during checkout to see available shipping options.",
        },
      ],
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: <ArrowRight className="h-4 w-4" />,
      questions: [
        {
          id: "return-policy",
          question: "What is your return policy?",
          answer:
            "Our standard return policy allows returns within 7 days of delivery for quality issues. Normal wear and tear, damage caused by the buyer, or simply changing your mind are not valid reasons for returns.",
        },
        {
          id: "return-process",
          question: "How do I return an item?",
          answer:
            "Contact the seller or our support team to initiate a return. You'll need to provide order details and photos of the issue. If approved, you'll receive return shipping instructions.",
        },
        {
          id: "return-refund",
          question: "When will I receive my refund?",
          answer:
            "Once the returned item is received and inspected, refunds are typically processed within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method.",
        },
      ],
    },
  ]

  // Popular search terms
  const popularSearchTerms = ["shipping", "payment", "refund", "tracking", "quality"]

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 2)])
    }
    setShowSearchSuggestions(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setActiveCategory("all")
  }

  // Get all questions across categories
  const allQuestions = faqCategories.flatMap((category) =>
    category.questions.map((q) => ({ ...q, categoryId: category.id, categoryTitle: category.title })),
  )

  // Filter questions based on search query and active category
  const filteredQuestions = allQuestions.filter((question) => {
    const matchesSearch =
      searchQuery === "" ||
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "all" || question.categoryId === activeCategory

    return matchesSearch && matchesCategory
  })

  // Group filtered questions by category
  const groupedQuestions = filteredQuestions.reduce(
    (acc, question) => {
      if (!acc[question.categoryId]) {
        acc[question.categoryId] = {
          id: question.categoryId,
          title: question.categoryTitle,
          questions: [],
        }
      }
      acc[question.categoryId].questions.push(question)
      return acc
    },
    {} as Record<string, { id: string; title: string; questions: typeof filteredQuestions }>,
  )

  // Focus search input on mount
  useEffect(() => {
    const searchInput = document.getElementById("faq-search")
    if (searchInput) {
      searchInput.focus()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cosmic background */}
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

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-repeat opacity-5"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container mx-auto py-12 px-4 sm:px-6 lg:px-8"
        >
          {/* Enhanced header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-gradient">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to the most common questions about our services and products.
            </p>
          </motion.div>

          {/* Enhanced search section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="relative">
                <Input
                  id="faq-search"
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  className="pl-10 pr-10 py-6 text-lg bg-black/60 border-red-900/30 rounded-xl focus:border-red-500 focus:ring-red-500/20 shadow-[0_0_15px_rgba(180,0,0,0.1)]"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Search suggestions */}
              <AnimatePresence>
                {showSearchSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-2 w-full bg-black/90 backdrop-blur-md border border-red-900/30 rounded-xl shadow-lg overflow-hidden"
                  >
                    {recentSearches.length > 0 && (
                      <div className="p-3 border-b border-red-900/20">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Searches</h3>
                        <div className="space-y-1">
                          {recentSearches.map((term, i) => (
                            <button
                              key={`recent-${i}`}
                              onClick={() => handleSearch(term)}
                              className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-red-900/20 rounded-md flex items-center"
                            >
                              <Search className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Popular Searches</h3>
                      <div className="space-y-1">
                        {popularSearchTerms.map((term, i) => (
                          <button
                            key={`popular-${i}`}
                            onClick={() => handleSearch(term)}
                            className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-red-900/20 rounded-md flex items-center"
                          >
                            <Search className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search tags */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center"
              >
                <span className="text-sm text-gray-400 mr-2">Searching for:</span>
                <div className="bg-red-900/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {searchQuery}
                  <button onClick={clearSearch} className="ml-2 text-red-400 hover:text-red-300">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/10 to-red-900/0 blur-md"></div>
                <TabsList className="w-full h-auto flex flex-wrap justify-center gap-2 p-1 bg-black/60 backdrop-blur-md border border-red-900/20 rounded-xl">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-red-900 data-[state=active]:text-white px-4 py-2 rounded-lg"
                  >
                    All Topics
                  </TabsTrigger>
                  {faqCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-red-900 data-[state=active]:text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      {category.icon}
                      <span className="ml-1.5">{category.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </motion.div>

          {/* FAQ content */}
          <div className="max-w-4xl mx-auto">
            {filteredQuestions.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
                {Object.values(groupedQuestions).map((category) => (
                  <div key={category.id} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                      {category.title}
                    </h2>
                    <div className="space-y-4">
                      <Accordion type="single" collapsible className="space-y-4">
                        {category.questions.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <AccordionItem
                              value={item.id}
                              className="border border-red-900/20 rounded-xl overflow-hidden bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(180,0,0,0.1)] hover:shadow-[0_0_20px_rgba(180,0,0,0.2)] transition-all duration-300"
                            >
                              <AccordionTrigger className="px-6 py-4 font-medium text-white hover:text-red-400 transition-colors">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4 text-gray-300 leading-relaxed">
                                <div className="border-l-2 border-red-900/30 pl-4">{item.answer}</div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4">
                  <Search className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">No results found</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any FAQ entries matching your search. Try different keywords or browse all topics.
                </p>
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  className="border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  Clear Search
                </Button>
              </motion.div>
            )}
          </div>

          {/* Still need help section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 rounded-2xl blur-md"></div>
              <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-8 border border-red-900/20 shadow-[0_0_25px_rgba(180,0,0,0.2)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-white">Still have questions?</h3>
                    <p className="text-gray-400">
                      If you couldn't find the answer you were looking for, our support team is here to help.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(180,0,0,0.3)] hover:shadow-[0_0_20px_rgba(180,0,0,0.4)]"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contact Support
                    </Link>
                    <Link
                      href="https://discord.gg/4PTQa7zsTs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-black border border-red-900/50 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-900/20 transition-all"
                    >
                      Join Discord
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

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
