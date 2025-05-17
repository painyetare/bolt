import type { Product } from "./products"

// This file contains products imported from the Google Sheet
// https://docs.google.com/spreadsheets/d/11sDC-i0wHzKKArCidG_pFxIzlJxPbfgszjDZ9jTv6Ao/edit?gid=1958513737#gid=1958513737

// Helper function to generate product links with the correct user code
export function generateProductLink(productId: string, source: string): string {
  // Replace &u=UGTV85 with &u=JP4AQY in all links
  return `https://www.cnfans.com/product?id=${productId}&source=${source}&u=JP4AQY`
}

// Sample structure for imported products
// Replace these with actual data from the Google Sheet
export const importedProducts: Product[] = [
  {
    id: 1001, // Start IDs from 1001 to avoid conflicts with existing products
    name: "Nike Tech Fleece Full Zip Hoodie",
    price: "24.99$",
    numericPrice: 24.99,
    image: "https://img.alicdn.com/imgextra/i3/2201504973228/O1CN01Ck8Jzx1MOPdQJLK1i_!!2201504973228.jpg",
    description: "High-quality Nike Tech Fleece replica hoodie with full zip design.",
    categories: ["Clothing", "Nike", "Hoodies"],
    productId: "681806271234",
    source: "WD",
    userCode: "JP4AQY", // Updated user code
    quality: "AAA+",
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    colors: ["Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    dateAdded: "2023-09-15",
    brandId: 1, // Nike
  },
  {
    id: 1002,
    name: "Jordan 4 Retro Thunder (2023)",
    price: "59.99$",
    numericPrice: 59.99,
    image: "https://img.alicdn.com/imgextra/i1/2201504973228/O1CN01NMu8Oe1MOPdPxJnQj_!!2201504973228.jpg",
    description: "Premium Jordan 4 Retro Thunder replica, 2023 release version.",
    categories: ["Shoes", "Jordan", "Basketball"],
    productId: "682715982345",
    source: "WD",
    userCode: "JP4AQY",
    quality: "AAA+",
    inStock: true,
    rating: 4.9,
    reviewCount: 124,
    colors: ["Black/Yellow"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    featured: true,
    dateAdded: "2023-10-05",
    brandId: 3, // Jordan
  },
  {
    id: 1003,
    name: "The North Face Nuptse Jacket",
    price: "68.50$",
    numericPrice: 68.5,
    image: "https://img.alicdn.com/imgextra/i4/2201504973228/O1CN01qOD5Yk1MOPdQJMPLl_!!2201504973228.jpg",
    description: "Warm and stylish The North Face Nuptse puffer jacket replica.",
    categories: ["Clothing", "The North Face", "Jackets", "Outerwear"],
    productId: "683629103456",
    source: "WD",
    userCode: "JP4AQY",
    quality: "AAA+",
    inStock: true,
    rating: 4.8,
    reviewCount: 76,
    colors: ["Black", "Navy", "Red"],
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    dateAdded: "2023-11-10",
  },
  {
    id: 1004,
    name: "Yeezy Slide Pure",
    price: "19.99$",
    numericPrice: 19.99,
    image: "https://img.alicdn.com/imgextra/i2/2201504973228/O1CN01Ck8Jzx1MOPdQJLK1i_!!2201504973228.jpg",
    description: "Comfortable Yeezy Slide Pure colorway, perfect for casual wear.",
    categories: ["Shoes", "Yeezy", "Slides", "Adidas"],
    productId: "684537214567",
    source: "WD",
    userCode: "JP4AQY",
    quality: "AA",
    inStock: true,
    rating: 4.5,
    reviewCount: 112,
    colors: ["Pure/Bone"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: false,
    dateAdded: "2023-12-01",
    brandId: 9, // Yeezy
  },
  {
    id: 1005,
    name: "Louis Vuitton Multiple Wallet",
    price: "45.00$",
    numericPrice: 45.0,
    image: "https://img.alicdn.com/imgextra/i3/2201504973228/O1CN01NMu8Oe1MOPdPxJnQj_!!2201504973228.jpg",
    description: "High-quality Louis Vuitton Multiple Wallet replica with accurate pattern.",
    categories: ["Accessories", "Louis Vuitton", "Wallets", "Luxury"],
    productId: "685446325678",
    source: "WD",
    userCode: "JP4AQY",
    quality: "AAA+",
    inStock: true,
    rating: 4.7,
    reviewCount: 58,
    colors: ["Monogram", "Damier"],
    featured: true,
    dateAdded: "2024-01-15",
    brandId: 4, // Louis Vuitton
  },
  // Add more products from the Google Sheet here
  // Make sure to:
  // 1. Increment the ID for each product
  // 2. Use the correct user code (JP4AQY)
  // 3. Match brand, category, quality, and price from the sheet
  // 4. Use the image URLs from the sheet
]

// Export a function to get all imported products
export function getImportedProducts(): Product[] {
  return importedProducts
}
