import React from 'react'
import { X } from 'lucide-react'

interface ImageModalProps {
  imageUrl: string
  caption: string
  onClose: () => void
}

export default function ImageModal({ imageUrl, caption, onClose }: ImageModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Image Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <img src={imageUrl} alt={caption} className="w-full h-auto" />
          {caption && <p className="mt-2 text-sm text-gray-600 text-center">{caption}</p>}
        </div>
      </div>
    </div>
  )
}

