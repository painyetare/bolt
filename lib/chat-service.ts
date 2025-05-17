import { createClient } from "@supabase/supabase-js"

// Supabase client for chat functionality
// This would typically be imported from a shared supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  discord_id: string
  username: string
  avatar_url: string
  role: "buyer" | "seller"
  created_at: string
}

export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
  last_message?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

// Get all sellers
export async function getSellers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").eq("role", "seller").order("username")

  if (error) {
    console.error("Error fetching sellers:", error)
    throw error
  }

  return data || []
}

// Get or create a conversation between a buyer and seller
export async function getOrCreateConversation(buyerId: string, sellerId: string): Promise<Conversation> {
  // First, check if a conversation already exists
  const { data: existingConversation, error: fetchError } = await supabase
    .from("conversations")
    .select("*")
    .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`)
    .single()

  if (existingConversation) {
    return existingConversation
  }

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching conversation:", fetchError)
    throw fetchError
  }

  // Create a new conversation
  const { data: newConversation, error: createError } = await supabase
    .from("conversations")
    .insert([
      {
        buyer_id: buyerId,
        seller_id: sellerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (createError) {
    console.error("Error creating conversation:", createError)
    throw createError
  }

  return newConversation
}

// Get all conversations for a user
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    throw error
  }

  return data || []
}

// Save a chat message
export async function saveChatMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
  // Update the conversation's updated_at timestamp and last_message
  await supabase
    .from("conversations")
    .update({
      updated_at: new Date().toISOString(),
      last_message: content,
    })
    .eq("id", conversationId)

  // Insert the message
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
        read: false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error saving message:", error)
    throw error
  }

  return data
}

// Get messages for a conversation
export async function getMessagesForConversation(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    throw error
  }

  return data || []
}

// Import { supabase } from "./supabase"
// Import { translateText, detectLanguage } from "./translation-service"

// Export interface Message {
//   id: string
//   sender_id: string
//   receiver_id: string
//   content: string
//   original_content?: string
//   language?: string
//   read: boolean
//   created_at: string
// }

// // Send a message with translation support
// Export async function sendMessage(
//   senderId: string,
//   receiverId: string,
//   content: string,
//   targetLang?: string,
// ): Promise<{ success: boolean; message?: Message; error?: string }> {
//   try {
//     // Detect source language
//     const sourceLang = detectLanguage(content)

//     // Prepare message data
//     const messageData: any = {
//       sender_id: senderId,
//       receiver_id: receiverId,
//       content: content,
//       language: sourceLang,
//       read: false,
//     }

//     // If target language is specified and different from source, translate
//     if (targetLang && targetLang !== sourceLang) {
//       try {
//         const translatedContent = await translateText(content, targetLang, sourceLang)
//         messageData.content = translatedContent
//         messageData.original_content = content
//       } catch (error) {
//         console.error("Translation error:", error)
//         // Continue with original content if translation fails
//       }
//     }

//     // Insert message into database
//     const { data, error } = await supabase.from("messages").insert([messageData]).select()

//     if (error) throw error

//     return { success: true, message: data[0] }
//   } catch (error) {
//     console.error("Error sending message:", error)
//     return { success: false, error: (error as Error).message }
//   }
// }

// // Get conversation between two users
// Export async function getConversation(userId: string, otherId: string, userLang?: string): Promise<Message[]> {
//   try {
//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
//       .order("created_at", { ascending: true })

//     if (error) throw error

//     // If user language is specified, translate messages not in that language
//     if (userLang && data) {
//       const translatedMessages = await Promise.all(
//         data.map(async (message) => {
//           // If message has a different language and is not already translated
//           if (message.language && message.language !== userLang && !message.original_content) {
//             try {
//               const translatedContent = await translateText(message.content, userLang, message.language)
//               return {
//                 ...message,
//                 content: translatedContent,
//                 original_content: message.content,
//               }
//             } catch (error) {
//               console.error("Translation error:", error)
//               return message
//             }
//           }
//           return message
//         }),
//       )
//       return translatedMessages
//     }

//     return data || []
//   } catch (error) {
//     console.error("Error fetching conversation:", error)
//     return []
//   }
// }

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("read", false)

  if (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// // Mark messages as read
// Export async function markMessagesAsRead(userId: string, senderId: string): Promise<boolean> {
//   try {
//     const { error } = await supabase
//       .from("messages")
//       .update({ read: true })
//       .eq("sender_id", senderId)
//       .eq("receiver_id", userId)
//       .eq("read", false)

//     if (error) throw error
//     return true
//   } catch (error) {
//     console.error("Error marking messages as read:", error)
//     return false
//   }
// }

// // Get unread message count
// Export async function getUnreadMessageCount(userId: string): Promise<number> {
//   try {
//     const { count, error } = await supabase
//       .from("messages")
//       .select("*", { count: "exact", head: true })
//       .eq("receiver_id", userId)
//       .eq("read", false)

//     if (error) throw error
//     return count || 0
//   } catch (error) {
//     console.error("Error getting unread message count:", error)
//     return 0
//   }
// }

// Subscribe to new messages for a conversation
export function subscribeToNewMessages(conversationId: string, callback: (message: Message) => void) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message)
      },
    )
    .subscribe()
}

// // Subscribe to new messages
// Export function subscribeToMessages(userId: string, callback: (message: Message) => void) {
//   const channel = supabase
//     .channel("messages")
//     .on(
//       "postgres_changes",
//       {
//         event: "INSERT",
//         schema: "public",
//         table: "messages",
//         filter: `receiver_id=eq.${userId}`,
//       },
//       (payload) => {
//         callback(payload.new as Message)
//       },
//     )
//     .subscribe()

//   return () => {
//     supabase.removeChannel(channel)
//   }
// }
