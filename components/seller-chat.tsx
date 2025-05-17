"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MessageCircle, Send, Globe } from "lucide-react"
import { useSellerStore } from "@/store/sellerStore"
import { sendMessage, getConversation, markMessagesAsRead, subscribeToMessages, type Message } from "@/lib/chat-service"
import { detectLanguage } from "@/lib/translation-service"
import { useToast } from "@/components/ui/use-toast"

interface SellerChatProps {
  sellerUsername: string
  sellerName: string
}

export function SellerChat({ sellerUsername, sellerName }: SellerChatProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [userLanguage, setUserLanguage] = useState("en") // Default to English
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentSeller, isAuthenticated } = useSellerStore()
  const { toast } = useToast()

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load conversation when component mounts
  useEffect(() => {
    if (isAuthenticated && currentSeller && sellerUsername) {
      loadConversation()
      markMessagesAsRead(currentSeller.username, sellerUsername)
    }
  }, [isAuthenticated, currentSeller, sellerUsername])

  // Subscribe to new messages
  useEffect(() => {
    if (!currentSeller) return

    const unsubscribe = subscribeToMessages(currentSeller.username, (newMessage) => {
      if (newMessage.sender_id === sellerUsername) {
        setMessages((prev) => [...prev, newMessage])
        markMessagesAsRead(currentSeller.username, sellerUsername)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [currentSeller, sellerUsername])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Detect user's language from browser
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0]
    setUserLanguage(browserLang)
  }, [])

  const loadConversation = async () => {
    if (!currentSeller || !sellerUsername) return

    setLoading(true)
    try {
      // Pass user language for auto-translation if enabled
      const conversation = await getConversation(
        currentSeller.username,
        sellerUsername,
        autoTranslate ? userLanguage : undefined,
      )
      setMessages(conversation)
    } catch (error) {
      console.error("Error loading conversation:", error)
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSeller || !sellerUsername) return

    try {
      // Detect message language
      const msgLanguage = detectLanguage(message)

      // Send message with translation if auto-translate is enabled
      const result = await sendMessage(
        currentSeller.username,
        sellerUsername,
        message,
        autoTranslate ? "en" : undefined, // Target language for seller
      )

      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message])
        setMessage("")
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const toggleAutoTranslate = () => {
    setAutoTranslate(!autoTranslate)
    // Reload conversation with new translation setting
    loadConversation()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat with {sellerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Please log in to chat with this seller.</p>
          <Button className="w-full">Log In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Chat with {sellerName}</CardTitle>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <div className="flex items-center space-x-2">
            <Switch id="auto-translate" checked={autoTranslate} onCheckedChange={toggleAutoTranslate} />
            <Label htmlFor="auto-translate" className="text-sm">
              Auto-translate
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with {sellerName}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === currentSeller?.username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender_id === currentSeller?.username ? "bg-red-500 text-white" : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>

                  {/* Show original text if it was translated */}
                  {msg.original_content && (
                    <p className="text-xs mt-1 opacity-70 italic">Original: {msg.original_content}</p>
                  )}

                  <p className="text-xs opacity-70 text-right mt-1">{formatTime(msg.created_at)}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-800">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1 min-h-[40px] max-h-[120px] bg-gray-900 border-gray-700"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
            className="bg-red-500 hover:bg-red-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
