"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImageChange: (imageData: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageChange, currentImage, className }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onImageChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {previewUrl ? (
        <div className="relative w-full">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Image preview"
            className="w-full h-48 object-contain border border-gray-700 rounded-md bg-black/40"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="w-full h-48 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-black/60 transition-colors"
          onClick={handleButtonClick}
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">Click to upload image</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}

      {!previewUrl && (
        <Button type="button" onClick={handleButtonClick} variant="outline" className="w-full border-gray-700">
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      )}
    </div>
  )
}
