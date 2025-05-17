import { Star } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  avatar: string
  rating: number
  text: string
  role?: string
}

export function TestimonialCard({ name, avatar, rating, text, role }: TestimonialCardProps) {
  return (
    <div className="bg-black border border-red-900/30 rounded-xl p-6 shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:translate-y-[-5px]">
      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-red-900/50">
          <Image src={avatar || "/placeholder.svg"} alt={name} width={48} height={48} className="object-cover" />
        </div>
        <div className="ml-4">
          <h3 className="font-bold">{name}</h3>
          {role && <p className="text-sm text-gray-400">{role}</p>}
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-700 text-gray-700"}`}
          />
        ))}
      </div>
      <p className="text-gray-300">{text}</p>
    </div>
  )
}

export default TestimonialCard
