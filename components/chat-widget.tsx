"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X } from "lucide-react"
import { useSellerStore } from "@/store/sellerStore"
import { sendMessage, getConversation, markMessagesAsRead, subscribeToMessages } from "@/lib/chat-service"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

interface ChatWidgetProps {
  sellerUsername?: string
  sellerName?: string
}

export function ChatWidget({ sellerUsername, sellerName }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentSeller, isAuthenticated } = useSellerStore()

  // If sellerUsername is provided, we're in a seller page
  // Otherwise, we're in the global chat widget
  const chatWithSeller = sellerUsername ? true : false

  useEffect(() => {
    if (isOpen && isAuthenticated && currentSeller && sellerUsername) {
      loadMessages()

      // Mark messages as read
      markMessagesAsRead(currentSeller.username, sellerUsername)

      // Subscribe to new messages
      const unsubscribe = subscribeToMessages(currentSeller.username, (newMessage) => {
        if (newMessage.sender_id === sellerUsername) {
          setMessages((prev) => [...prev, newMessage])
          markMessagesAsRead(currentSeller.username, sellerUsername)
          scrollToBottom()
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [isOpen, isAuthenticated, currentSeller, sellerUsername])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!currentSeller || !sellerUsername) return

    setLoading(true)
    try {
      const conversation = await getConversation(currentSeller.username, sellerUsername)
      setMessages(conversation)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSeller || !sellerUsername) return

    try {
      const newMessage = await sendMessage(currentSeller.username, sellerUsername, message.trim())
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage])
        setMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isAuthenticated || !currentSeller) {
    return null
  }

  if (!chatWithSeller && !isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`${chatWithSeller ? "w-full h-full" : "fixed bottom-4 right-4 w-80 shadow-lg"}`}>
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{sellerName || "Chat"}</CardTitle>
        {!chatWithSeller && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === currentSeller.username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender_id === currentSeller.username ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="break-words">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender_id === currentSeller.username ? "text-red-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-red-500 hover:bg-red-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
