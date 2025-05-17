import Image from "next/image"
import { generateAcbuyLink } from "@/data/products"

interface ProductCardAltProps {
  id: number
  name: string
  price: string
  image: string
  productId: string
}

export function ProductCardAlt({ id, name, price, image, productId }: ProductCardAltProps) {
  // Create the link with the exact format using the helper function
  const acbuyLink = generateAcbuyLink(productId)

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Product Image with Red Glow */}
      <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)] mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/50 z-10"></div>
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-4 z-0" />
      </div>

      {/* Product Info */}
      <div className="px-2">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-xl font-bold mb-3">{price}</p>

        {/* Buy Button - Pure HTML anchor tag */}
        <a
          href={acbuyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-900 hover:bg-red-800 text-white rounded-full shadow-[0_0_10px_rgba(180,0,0,0.3)] text-center py-2 px-4 font-medium transform hover:scale-105 transition-all duration-300"
        >
          View on ACBUY
        </a>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default ProductCardAlt
