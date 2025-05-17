import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Review {
  id: number
  productId: number
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  notHelpful: number
  verified: boolean
}

// Initial reviews data
const initialReviewsData: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: "user123",
    userName: "John D.",
    rating: 5,
    title: "Amazing quality!",
    comment:
      "These Air Force 1s are incredible. The quality is almost identical to retail pairs I've owned. Very comfortable and the materials feel premium. Highly recommend!",
    date: "2023-08-15",
    helpful: 24,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 2,
    productId: 1,
    userId: "user456",
    userName: "Sarah M.",
    rating: 4,
    title: "Great for the price",
    comment:
      "Really good replicas, especially for the price. The only minor issue is that the box came slightly damaged, but the shoes themselves are perfect.",
    date: "2023-09-02",
    helpful: 18,
    notHelpful: 1,
    verified: true,
  },
  {
    id: 3,
    productId: 2,
    userId: "user789",
    userName: "Mike T.",
    rating: 5,
    title: "Best Jordan 4 reps I've seen",
    comment:
      "These Jordan 4s are incredible. The materials, stitching, and overall shape are spot on. I've compared them to my retail pair and they're nearly identical. Will definitely buy more colorways!",
    date: "2023-07-28",
    helpful: 32,
    notHelpful: 0,
    verified: true,
  },
  {
    id: 4,
    productId: 3,
    userId: "user101",
    userName: "Alex K.",
    rating: 3,
    title: "Good budget option",
    comment:
      "For a budget pair, these are decent. The materials aren't as premium as the more expensive batches, but they look good on foot and are comfortable enough for daily wear.",
    date: "2023-08-10",
    helpful: 15,
    notHelpful: 3,
    verified: true,
  },
  {
    id: 5,
    productId: 4,
    userId: "user202",
    userName: "Emma L.",
    rating: 4,
    title: "Great Yeezys for the price",
    comment:
      "These Yeezys are really comfortable and look great. The boost feels just like retail. Only giving 4 stars because the box was different from retail, but the shoes themselves are excellent.",
    date: "2023-09-05",
    helpful: 12,
    notHelpful: 1,
    verified: true,
  },
]

// Create a Zustand store for reviews with persistence
export interface ReviewStore {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "date" | "helpful" | "notHelpful">) => void
  updateReview: (id: number, updatedReview: Partial<Review>) => void
  deleteReview: (id: number) => void
  markHelpful: (id: number) => void
  markNotHelpful: (id: number) => void
  getProductReviews: (productId: number) => Review[]
  getAverageRating: (productId: number) => number
  resetReviews: () => void
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: initialReviewsData,
      addReview: (review) =>
        set((state) => ({
          reviews: [
            ...state.reviews,
            {
              ...review,
              id: Math.max(0, ...state.reviews.map((r) => r.id)) + 1,
              date: new Date().toISOString().split("T")[0],
              helpful: 0,
              notHelpful: 0,
            },
          ],
        })),
      updateReview: (id, updatedReview) =>
        set((state) => ({
          reviews: state.reviews.map((review) => (review.id === id ? { ...review, ...updatedReview } : review)),
        })),
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((review) => review.id !== id),
        })),
      markHelpful: (id) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === id ? { ...review, helpful: review.helpful + 1 } : review,
          ),
        })),
      markNotHelpful: (id) =>
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === id ? { ...review, notHelpful: review.notHelpful + 1 } : review,
          ),
        })),
      getProductReviews: (productId) => {
        return get().reviews.filter((review) => review.productId === productId)
      },
      getAverageRating: (productId) => {
        const productReviews = get().getProductReviews(productId)
        if (productReviews.length === 0) return 0

        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
        return totalRating / productReviews.length
      },
      resetReviews: () => set({ reviews: initialReviewsData }),
    }),
    {
      name: "review-storage",
    },
  ),
)

// Get reviews by product ID
export function getReviewsByProductId(productId: number): Review[] {
  return initialReviewsData.filter((review) => review.productId === productId)
}

// Get average rating for a product
export function getAverageRating(productId: number): number {
  const productReviews = getReviewsByProductId(productId)
  if (productReviews.length === 0) return 0

  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
  return totalRating / productReviews.length
}
