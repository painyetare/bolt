"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { convertLinks } from "@/lib/link-converter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Link2, Copy, Check, ExternalLink, Trash2, Clock, RotateCcw, Search, Zap, History, Share2 } from "lucide-react"

type ConversionHistoryItem = {
  id: string
  inputLink: string
  outputLink: string
  timestamp: number
}

export default function LinkConverterPage() {
  const [inputLink, setInputLink] = useState("")
  const [cnfansLink, setCnfansLink] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<ConversionHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<"convert" | "history">("convert")
  const [conversionCount, setConversionCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("linkConverterHistory")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed)
        setConversionCount(parsed.length)
      } catch (e) {
        console.error("Failed to parse history:", e)
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
    localStorage.setItem("linkConverterHistory", JSON.stringify(history))
  }, [history])

  const handleConvert = async () => {
    if (!inputLink.trim()) {
      setError("Please enter a URL first")
      return
    }

    setError("")
    setIsConverting(true)
    setCnfansLink("")

    try {
      const result = await convertLinks(inputLink)
      setCnfansLink(result.cnfans)
      setConversionCount((prev) => prev + 1)

      // Add to history
      const newHistoryItem: ConversionHistoryItem = {
        id: Date.now().toString(),
        inputLink,
        outputLink: result.cnfans,
        timestamp: Date.now(),
      }

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]) // Keep only the 20 most recent items
    } catch (err) {
      console.error("Error converting link:", err)
      setError("Unsupported or invalid link")
    } finally {
      setIsConverting(false)
    }
  }

  const handleCopy = () => {
    if (cnfansLink) {
      navigator.clipboard.writeText(cnfansLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenLink = () => {
    if (cnfansLink) {
      window.open(cnfansLink, "_blank")
    }
  }

  const handleUseFromHistory = (item: ConversionHistoryItem) => {
    setInputLink(item.inputLink)
    setCnfansLink(item.outputLink)
    setActiveTab("convert")
  }

  const handleClearHistory = () => {
    setHistory([])
    setConversionCount(0)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const truncateLink = (link: string, maxLength = 40) => {
    return link.length > maxLength ? `${link.substring(0, maxLength)}...` : link
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Convert on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleConvert()
    }
  }

  const resetForm = () => {
    setInputLink("")
    setCnfansLink("")
    setError("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Filter history based on search query
  const filteredHistory = history.filter(
    (item) =>
      item.inputLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outputLink.toLowerCase().includes(searchQuery.toLowerCase()),
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
    return <LinkConverterSkeleton />
  }

  return (
    <div className="min-h-screen bg-black text-white cosmic-bg">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                CNFans Link Converter
              </h1>
              <p className="text-gray-400">Convert links from popular shopping platforms to CNFans format</p>
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
              <Link2 className="h-3.5 w-3.5 mr-1" />
              Taobao
            </Badge>
            <Badge variant="secondary" className="bg-amber-900/30 text-white border-amber-900/50">
              <Link2 className="h-3.5 w-3.5 mr-1" />
              Weidian
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/30 text-white border-blue-900/50">
              <Link2 className="h-3.5 w-3.5 mr-1" />
              1688
            </Badge>
            <Badge variant="secondary" className="bg-green-900/30 text-white border-green-900/50">
              <Link2 className="h-3.5 w-3.5 mr-1" />
              JD
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search conversion history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black border-red-900/30 focus:border-red-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "convert" ? "default" : "outline"}
                className={
                  activeTab === "convert" ? "bg-red-900 hover:bg-red-800" : "border-red-600/50 hover:bg-red-900/20"
                }
                onClick={() => setActiveTab("convert")}
              >
                Single Link
              </Button>
              <Button
                variant={activeTab === "history" ? "default" : "outline"}
                className={
                  activeTab === "history" ? "bg-red-900 hover:bg-red-800" : "border-red-600/50 hover:bg-red-900/20"
                }
                onClick={() => setActiveTab("history")}
              >
                History
                {history.length > 0 && (
                  <span className="ml-2 bg-red-950 text-red-400 text-xs px-1.5 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  {conversionCount}
                  <Zap className="h-5 w-5 ml-2 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg">
                  {history.length > 0 ? formatDate(history[0].timestamp) : "No Conversion History"}
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
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600/50 hover:bg-red-900/20"
                    onClick={handleClearHistory}
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
            {activeTab === "convert" && (
              <motion.div
                key="convert"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm mb-6">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center mr-3 text-sm">
                        1
                      </div>
                      <CardTitle>Enter Link</CardTitle>
                    </div>
                    <CardDescription>Paste a link from Taobao, Weidian, 1688, or JD</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        ref={inputRef}
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste your link here..."
                        className="min-h-[100px] bg-black/50 border-red-900/30 focus:border-red-500 resize-none"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">Ctrl + Enter to convert</div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/30 border border-red-800/50 text-red-200 px-4 py-3 rounded-lg mt-4"
                      >
                        {error}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm mb-6">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center mr-3 text-sm">
                        2
                      </div>
                      <CardTitle>Convert</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleConvert}
                      disabled={isConverting || !inputLink.trim()}
                      className="w-full bg-red-900 hover:bg-red-800 text-white"
                    >
                      {isConverting ? (
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
                          Converting...
                        </>
                      ) : (
                        "Convert"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {cnfansLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center mr-3 text-sm">
                            3
                          </div>
                          <CardTitle>Converted Link</CardTitle>
                        </div>
                        <CardDescription>Your converted link is ready to use</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-black/50 border border-red-900/30 rounded-lg p-4 mb-4 break-all">
                          {cnfansLink}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-red-600/50 hover:bg-red-900/20"
                            onClick={handleCopy}
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            className="border-red-600/50 hover:bg-red-900/20"
                            onClick={handleOpenLink}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </Button>

                          <Button variant="outline" className="border-red-600/50 hover:bg-red-900/20">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
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
                  <h2 className="text-2xl font-bold">Conversion History</h2>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/50 hover:bg-red-900/20"
                      onClick={handleClearHistory}
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
                    {filteredHistory.map((item) => (
                      <motion.div key={item.id} variants={item}>
                        <Card
                          className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm cursor-pointer hover:border-red-500/50 transition-colors"
                          onClick={() => handleUseFromHistory(item)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{truncateLink(item.inputLink, 25)}</CardTitle>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigator.clipboard.writeText(item.outputLink)
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="flex items-center text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(item.timestamp)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm mb-2">
                              <div className="font-medium text-gray-400 mb-1">Original:</div>
                              <div className="truncate text-gray-300">{item.inputLink}</div>
                            </div>
                            <div className="text-sm">
                              <div className="font-medium text-red-400 mb-1">Converted:</div>
                              <div className="truncate text-white">{item.outputLink}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm text-center py-12">
                    <CardContent>
                      <History className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-medium mb-2">No Conversion History</h3>
                      <p className="text-gray-400 mb-4">Your conversion history will appear here</p>
                      <Button
                        variant="default"
                        className="bg-red-900 hover:bg-red-800"
                        onClick={() => setActiveTab("convert")}
                      >
                        Start Converting
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard Shortcuts */}
          <Card className="bg-black border-red-900/20 shadow-[0_0_15px_rgba(180,0,0,0.2)] backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Convert</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-md">Ctrl</kbd>
                  <span className="text-gray-400">+</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-md">Enter</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

const LinkConverterSkeleton = () => (
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

        <div className="h-64 bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-24 bg-gray-700 rounded-lg mb-6"></div>
      </div>
    </main>
  </div>
)
