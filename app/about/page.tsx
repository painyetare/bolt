import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About W2C</h1>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
          <Image
            src="/placeholder.svg?height=400&width=1000"
            alt="W2C Team"
            width={1000}
            height={400}
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center p-8">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Your Ultimate Replica Guide
              </h2>
              <p className="text-gray-200 text-lg">
                Helping you navigate the world of high-quality replicas since 2022.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Our Story</h2>
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <p className="text-gray-300 mb-4">
              W2C.RO was founded in 2022 by a group of replica enthusiasts who were frustrated with the lack of reliable
              information about replica products and sellers. We noticed that many people were being scammed or
              receiving low-quality products due to the lack of transparency in the replica market.
            </p>
            <p className="text-gray-300 mb-4">
              Our mission is to provide a comprehensive and trustworthy resource for people interested in replica
              products. We believe that everyone deserves access to high-quality products at affordable prices, and
              we're here to help you navigate this complex market.
            </p>
            <p className="text-gray-300">
              Over the years, we've built relationships with trusted sellers, tested countless products, and created a
              community of like-minded individuals who share our passion for quality replicas.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-red-500">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Product Catalog</h3>
              <p className="text-gray-400">
                We curate a comprehensive catalog of high-quality replica products across various categories.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Seller Verification</h3>
              <p className="text-gray-400">
                We verify and review sellers to ensure they provide reliable service and quality products.
              </p>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Educational Guides</h3>
              <p className="text-gray-400">
                We provide comprehensive guides and tutorials to help you navigate the replica market safely.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Our Team</h2>
          <div className="bg-gray-900/50 p-8 rounded-xl">
            <p className="text-gray-300 mb-6">
              W2C.RO is run by a dedicated team of replica enthusiasts with years of experience in the industry. We're
              passionate about helping our community find the best products and avoid scams.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-red-500">
                  <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
                </div>
                <h3 className="font-bold">Alex</h3>
                <p className="text-gray-400 text-sm">Founder & Product Specialist</p>
              </div>

              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-red-500">
                  <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
                </div>
                <h3 className="font-bold">Maria</h3>
                <p className="text-gray-400 text-sm">Content Manager</p>
              </div>

              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-red-500">
                  <Image src="/placeholder.svg?height=128&width=128" alt="Team Member" fill className="object-cover" />
                </div>
                <h3 className="font-bold">David</h3>
                <p className="text-gray-400 text-sm">Community Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section>
          <div className="bg-gradient-to-r from-red-900/30 to-black p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Connect with thousands of replica enthusiasts, get exclusive updates, and participate in discussions about
              the latest products and sellers.
            </p>
            <Link href="https://discord.gg/w2c">
              <Button className="bg-red-900 hover:bg-red-800">Join Our Discord</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
