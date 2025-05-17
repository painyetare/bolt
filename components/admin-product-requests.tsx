"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProductRequestStore, type ProductRequest, type RequestStatus } from "@/data/product-requests"
import { Check, Clock, X, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { get } from "lodash"

export function AdminProductRequests() {
  const { requests, updateRequestStatus } = useProductRequestStore()
  const [activeTab, setActiveTab] = useState<RequestStatus>("pending")
  const { toast } = useToast()

  const filteredRequests = requests.filter((request) => request.status === activeTab)

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-blue-500">
            <Check className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      case "fulfilled":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Fulfilled
          </Badge>
        )
    }
  }

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    updateRequestStatus(requestId, newStatus)

    // Add toast notification
    const statusMessages = {
      approved: "Request has been approved. You can now source this product.",
      rejected: "Request has been rejected.",
      fulfilled: "Request has been marked as fulfilled.",
      pending: "Request has been moved back to pending.",
    }

    toast({
      title: `Status Updated: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      description: statusMessages[newStatus],
    })
  }

  const renderActionButtons = (request: ProductRequest) => {
    switch (activeTab) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleStatusChange(request.id, "approved")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500"
              onClick={() => handleStatusChange(request.id, "rejected")}
            >
              Reject
            </Button>
          </div>
        )
      case "approved":
        return (
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleStatusChange(request.id, "fulfilled")}
          >
            Mark Fulfilled
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-black/20 border-red-500/20">
      <CardHeader>
        <CardTitle>Product Requests</CardTitle>
        <CardDescription>Manage product requests from customers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" value={activeTab} onValueChange={(value) => setActiveTab(value as RequestStatus)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pending">
              Pending
              {filteredRequests.length > 0 && activeTab !== "pending" && (
                <Badge variant="destructive" className="ml-2 bg-red-500">
                  {get().getPendingRequestCount()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="bg-black/40 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.productName}</CardTitle>
                          <CardDescription>
                            {request.name} • {request.email}
                          </CardDescription>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-400">{request.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {request.budget && (
                            <Badge variant="outline" className="border-green-500/50 text-green-400">
                              Budget: {request.budget}
                            </Badge>
                          )}
                          {request.category && (
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                              {request.category}
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex justify-end">{renderActionButtons(request)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-black/40 rounded-lg border border-gray-800">
                <h3 className="text-lg font-medium mb-2">No {activeTab} requests</h3>
                <p className="text-gray-400">
                  {activeTab === "pending"
                    ? "There are no pending product requests to review."
                    : `There are no ${activeTab} product requests.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
