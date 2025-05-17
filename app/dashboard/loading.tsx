import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-red-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 bg-red-900/20" />
          <Skeleton className="h-10 w-32 bg-red-900/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full bg-red-900/20 rounded-lg" />
          <Skeleton className="h-32 w-full bg-red-900/20 rounded-lg" />
          <Skeleton className="h-32 w-full bg-red-900/20 rounded-lg" />
        </div>

        <Skeleton className="h-96 w-full bg-red-900/20 rounded-lg" />
      </div>
    </div>
  )
}
