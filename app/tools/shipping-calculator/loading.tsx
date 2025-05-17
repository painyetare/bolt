export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white cosmic-bg">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-pulse">
              <div className="h-10 w-64 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
            </div>
            <div className="h-8 w-24 bg-gray-700 rounded"></div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="h-10 w-full bg-gray-700 rounded"></div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="h-64 bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-700 rounded-lg"></div>
          </div>

          <div className="h-24 bg-gray-700 rounded-lg mb-6"></div>
        </div>
      </main>
    </div>
  )
}
