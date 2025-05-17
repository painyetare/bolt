"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { SellerChat } from "@/components/seller-chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Star, Users } from "lucide-react"

interface Seller {
  id: string
  username: string
  name: string
  logo?: string
  description?: string
  verified: boolean
  rating: number
  join_date: string
  followers: number
  location?: string
  specialties?: string[]
}

export default function SellerPage() {
  const params = useParams()
  const sellerId = params.id as string

  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase.from("sellers").select("*").eq("username", sellerId).single()

        if (error) throw error

        setSeller(data)
      } catch (err) {
        console.error("Error fetching seller:", err)
        setError("Failed to load seller information")
      } finally {
        setLoading(false)
      }
    }

    fetchSeller()
  }, [sellerId])

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Seller not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                {seller.logo ? (
                  <img
                    src={seller.logo || "/placeholder.svg"}
                    alt={seller.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">{seller.name.charAt(0)}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center">
                    <CardTitle className="text-2xl mr-2">{seller.name}</CardTitle>
                    {seller.verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <CardDescription>@{seller.username}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{seller.description || "No description provided."}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-500 mb-1" />
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-semibold">{seller.rating.toFixed(1)}/5.0</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="font-semibold">{seller.followers}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <MapPin className="h-5 w-5 text-red-500 mb-1" />
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{seller.location || "N/A"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-semibold">{new Date(seller.join_date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>

              {seller.specialties && seller.specialties.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {seller.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <SellerChat sellerUsername={seller.username} sellerName={seller.name} />
        </div>
      </div>
    </div>
  )
}