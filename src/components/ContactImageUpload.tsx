'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { CloudArrowUpIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ContactImageUploadProps {
  currentImage?: string | null
  onImageUpload: (imageUrl: string) => void
  onImageRemove?: () => void
  className?: string
}

export default function ContactImageUpload({
  currentImage,
  onImageUpload,
  onImageRemove,
  className = ''
}: ContactImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'contacts') // Specify contacts category

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      onImageUpload(result.filePath)
      toast.success('Contact image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }, [onImageUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove()
      toast.success('Contact image removed')
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Contact Photo
      </label>

      {currentImage ? (
        // Show current image with remove option
        <div className="relative group">
          <div className="w-32 h-32 border-2 border-gray-300 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
            <Image
              src={currentImage}
              alt="Contact photo"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            title="Remove photo"
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openFileDialog}
            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
          >
            Change photo
          </button>
        </div>
      ) : (
        // Show upload area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`
            w-32 h-32 border-2 border-dashed rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center
            ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          `}
        >
          <div className="flex flex-col items-center justify-center p-4">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-1 text-xs text-gray-600 text-center">Uploading...</p>
              </>
            ) : (
              <>
                {isDragging ? (
                  <CloudArrowUpIcon className="w-6 h-6 text-blue-500" />
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                )}
                <p className="mt-1 text-xs text-gray-600 text-center">
                  {isDragging ? (
                    'Drop here'
                  ) : (
                    'Add photo'
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
        aria-label="Upload contact photo"
      />
    </div>
  )
}
