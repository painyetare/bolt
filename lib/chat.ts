import { getSupabase } from "./supabase"
import { getCurrentSeller } from "./auth"

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

// Send a message
export const sendMessage = async (receiverId: string, content: string): Promise<Message | null> => {
  try {
    const currentSeller = getCurrentSeller()
    if (!currentSeller) {
      throw new Error("You must be logged in to send messages")
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentSeller.username,
          receiver_id: receiverId,
          content,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error sending message:", error)
    return null
  }
}

// Get conversation between two users
export const getConversation = async (otherUserId: string): Promise<Message[]> => {
  try {
    const currentSeller = getCurrentSeller()
    if (!currentSeller) {
      throw new Error("You must be logged in to view messages")
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentSeller.username},receiver_id.eq.${currentSeller.username}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order("created_at", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return []
  }
}

// Mark messages as read
export const markMessagesAsRead = async (senderId: string): Promise<boolean> => {
  try {
    const currentSeller = getCurrentSeller()
    if (!currentSeller) {
      throw new Error("You must be logged in to mark messages as read")
    }

    const supabase = getSupabase()
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", senderId)
      .eq("receiver_id", currentSeller.username)
      .eq("read", false)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return false
  }
}

// Subscribe to new messages
export const subscribeToMessages = (callback: (message: Message) => void) => {
  const currentSeller = getCurrentSeller()
  if (!currentSeller) {
    console.error("You must be logged in to subscribe to messages")
    return () => {}
  }

  const supabase = getSupabase()
  const subscription = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${currentSeller.username}`,
      },
      (payload) => {
        callback(payload.new as Message)
      },
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}
