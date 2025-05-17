import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  name: string
  image: string
  count: number
  slug?: string
}

export function CategoryCard({ name, image, count, slug }: CategoryCardProps) {
  // Use the provided slug or create one from the name
  const categorySlug = slug || name.toLowerCase().replace(/\s+/g, "-")

  return (
    <Link href={`/products?category=${categorySlug}`}>
      <div className="group relative h-64 rounded-xl overflow-hidden border border-red-600/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-300">{count} products</p>
        </div>
      </div>
    </Link>
  )
}

// Also export as default for backward compatibility
export default CategoryCard
