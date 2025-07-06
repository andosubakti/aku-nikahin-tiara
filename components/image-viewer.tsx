'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

interface ImageViewerProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function ImageViewer({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)

  // Reset current index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowLeft':
          handlePrev()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, onClose])

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchEndX - touchStartX.current

    // Swipe threshold
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }

    touchStartX.current = null
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 rounded-full bg-black/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image */}
      <div className="relative h-full w-full max-w-4xl flex items-center justify-center p-4">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white transition-colors hover:bg-black/40"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white transition-colors hover:bg-black/40"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Thumbnail navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
