"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import SellerMobileNav from "@/components/seller-mobile-nav"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

// Mock messages for demo purposes
const mockMessages = [
  {
    id: 1,
    sender: "customer1",
    message: "Hi, do you have the Nike Air Force 1 in size US 10?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: 2,
    sender: "customer2",
    message: "When will you restock the Adidas Ultraboost?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    read: false,
  },
  {
    id: 3,
    sender: "customer3",
    message: "I'm interested in your New Balance 990. Do you ship internationally?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [seller, setSeller] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [reply, setReply] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Check authentication and load seller data
  useEffect(() => {
    const checkAuth = async () => {
      // Check if seller is logged in via cookie
      const sellerLoggedIn = document.cookie.includes("seller_logged_in=true")
      const sellerId = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("seller_id="))
        ?.split("=")[1]

      if (!sellerLoggedIn || !sellerId) {
        router.push("/sellers/login")
        return
      }

      try {
        // Get seller data from Supabase
        const { data, error } = await supabase.from("sellers").select("*").eq("id", sellerId).single()

        if (error || !data) {
          throw new Error("Failed to fetch seller data")
        }

        setSeller(data)

        // In a real app, you would fetch messages from the database here
        // For now, we'll use the mock messages
      } catch (error) {
        console.error("Error fetching seller data:", error)
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        router.push("/sellers/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleSelectMessage = (message: any) => {
    setSelectedMessage(message)

    // Mark as read
    if (!message.read) {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }
  }

  const handleSendReply = () => {
    if (!reply.trim() || !selectedMessage) return

    setIsSending(true)

    // Simulate sending a reply
    setTimeout(() => {
      // In a real app, you would send the reply to the database
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully",
      })

      setReply("")
      setIsSending(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Today
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday"
    } else if (diffDays < 7) {
      // This week
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      // Older
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!seller) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SellerMobileNav />

      <div className="container mx-auto px-4 py-12 pt-24 md:pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-gray-400">Communicate with your customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message List */}
          <Card className="bg-black/40 border-red-500/20">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription className="text-gray-400">Your customer inquiries</CardDescription>
            </CardHeader>

            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? "bg-red-900/30 border border-red-500/30"
                          : "hover:bg-black/60 border border-gray-800"
                      } ${!message.read ? "border-l-2 border-l-red-500" : ""}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{message.sender}</div>
                        <div className="text-xs text-gray-400">{formatDate(message.timestamp)}</div>
                      </div>
                      <div className="text-sm text-gray-300 mt-1 line-clamp-1">{message.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="md:col-span-2 bg-black/40 border-red-500/20">
            <CardHeader>
              <CardTitle>
                {selectedMessage ? `Conversation with ${selectedMessage.sender}` : "Select a conversation"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedMessage ? "Reply to this message" : "Select a message from the list to view details"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="bg-black/60 p-4 rounded-md border border-gray-800">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{selectedMessage.sender}</div>
                      <div className="text-xs text-gray-400">{formatDate(selectedMessage.timestamp)}</div>
                    </div>
                    <div className="text-gray-300 mt-2">{selectedMessage.message}</div>
                  </div>

                  <div className="pt-4">
                    <Textarea
                      placeholder="Type your reply here..."
                      className="bg-black/50 border-red-600/50 min-h-[100px]"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />

                    <div className="flex justify-end mt-4">
                      <Button
                        className="bg-red-900 hover:bg-red-800"
                        onClick={handleSendReply}
                        disabled={!reply.trim() || isSending}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select a conversation to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
