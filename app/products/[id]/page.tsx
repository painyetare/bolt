import Image from "next/image"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { QualityBadge } from "@/components/quality-badge"
import { getProductById } from "@/data/products"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-bold">{product.price}</p>
            {product.discount && (
              <p className="text-sm text-green-600 font-medium">{Math.round(product.discount * 100)}% OFF</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <QualityBadge quality={product.quality} />
            {product.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{product.rating.toFixed(1)}</span>
                {product.reviewCount && <span className="text-gray-500 text-sm ml-1">({product.reviewCount})</span>}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <div key={color} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <div key={size} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a
              href="https://acbuy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <span>View on ACBuy</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
