'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

// Updated data structure with multiple images per story
const stories = [
  {
    id: 0,
    title: 'Awal Mula 🚀',
    thumbnail: '/Intro/intro-cover.jpg',
    images: [
      {
        src: '/Intro/intro-1.png',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/Intro/intro-2.png',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/Intro/intro-3.png',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/Intro/intro-4.png',
        alt: 'Our first date at the café',
        caption: '',
      },
    ],
  },
  {
    id: 1,
    title: 'Vacation 🏝️',
    thumbnail: '/vacation/vacation-5.jpg',
    images: [
      {
        src: '/vacation/vacation-1.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/vacation/vacation-2.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/vacation/vacation-3.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/vacation/vacation-4.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/vacation/vacation-5.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/vacation/vacation-6.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
    ],
  },
  {
    id: 2,
    title: 'Photobox 📸',
    thumbnail: '/photobox/photobox-4.jpg',
    images: [
      {
        src: '/photobox/photobox-1.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/photobox/photobox-2.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/photobox/photobox-3.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/photobox/photobox-4.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
    ],
  },
  {
    id: 3,
    title: 'Perayaan 🎉',
    thumbnail: '/perayaan/perayaan-4.jpg',
    images: [
      {
        src: '/perayaan/perayaan-1.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/perayaan/perayaan-2.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/perayaan/perayaan-3.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/perayaan/perayaan-4.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/perayaan/perayaan-5.jpg',
        alt: 'Our first date at the café',
        caption: '',
      },
    ],
  },
  {
    id: 4,
    title: 'Lamaran 💍',
    thumbnail: '/lamaran/lamaran-4.jpeg',
    images: [
      {
        src: '/lamaran/lamaran-1.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/lamaran/lamaran-2.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/lamaran/lamaran-3.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/lamaran/lamaran-4.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/lamaran/lamaran-5.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
      {
        src: '/lamaran/lamaran-6.jpeg',
        alt: 'Our first date at the café',
        caption: '',
      },
    ],
  },
]

export default function Gallery() {
  const [activeStory, setActiveStory] = useState<number | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [progress, setProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  // Handle story and image progression
  useEffect(() => {
    if (activeStory !== null) {
      // Reset progress when changing stories or images
      setProgress(0)

      // Auto-progress the image
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Current story's images
            const currentStoryImages = stories[activeStory].images

            // If there are more images in this story
            if (activeImage < currentStoryImages.length - 1) {
              setActiveImage(activeImage + 1)
              return 0
            }
            // If this is the last image in this story but there are more stories
            else if (activeStory < stories.length - 1) {
              setActiveStory(activeStory + 1)
              setActiveImage(0)
              return 0
            }
            // If this is the last image of the last story
            else {
              clearInterval(progressInterval.current as NodeJS.Timeout)
              return 100
            }
          }
          return prev + 1
        })
      }, 30) // 3 seconds total duration (30ms * 100)

      // Prevent scrolling when story is open
      document.body.style.overflow = 'hidden'
    } else {
      // Clear interval when story is closed
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }

      // Re-enable scrolling
      document.body.style.overflow = ''
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [activeStory, activeImage])

  // Touch handlers for swipe gestures
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
        // Swipe right (previous story)
        handlePrevStory()
      } else {
        // Swipe left (next story)
        handleNextStory()
      }
    }

    touchStartX.current = null
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevImage()
    } else if (e.key === 'ArrowRight') {
      handleNextImage()
    } else if (e.key === 'ArrowUp') {
      handlePrevStory()
    } else if (e.key === 'ArrowDown') {
      handleNextStory()
    } else if (e.key === 'Escape') {
      setActiveStory(null)
    }
  }

  // Navigation functions
  const handlePrevImage = () => {
    if (activeStory === null) return

    if (activeImage > 0) {
      setActiveImage((prevState) => prevState - 1)
    }
  }

  const handleNextImage = () => {
    if (activeStory === null) return

    if (activeImage === stories[activeStory].images.length - 1) {
      handleNextStory()
    }

    const currentStoryImages = stories[activeStory].images

    if (activeImage < currentStoryImages.length - 1) {
      setActiveImage((prevState) => prevState + 1)
    }
  }

  const handlePrevStory = () => {
    if (activeStory !== null && activeStory > 0) {
      setActiveStory((prevState) => Number(prevState) - 1)
      setActiveImage(0)
    }
  }

  const handleNextStory = () => {
    setActiveImage(0)
    if (activeStory !== null && activeStory < stories.length - 1) {
      setActiveStory((prevState) => Number(prevState) + 1)
    } else if (activeStory !== null) {
      setActiveStory(null)
    }
  }

  return (
    <div className="w-full">
      {/* Stories thumbnails */}
      <div
        ref={scrollRef}
        className="flex w-full space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stories.map((story, index) => (
          <div key={story.id} className="flex flex-col items-center">
            <button
              onClick={() => {
                setActiveStory(index)
                setActiveImage(0)
              }}
              className="relative flex-shrink-0 active:scale-95 transition-transform duration-150 outline-none"
            >
              {/* Rainbow ring with pulse only on border */}
              <div className="relative p-[3px] rounded-full">
                {/* Pulse ring as background only */}
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,orange,violet,red)] animate-pulse z-10" />
                {/* Rainbow ring (static) */}
                <div className="relative p-[3px] rounded-full z-10">
                  {/* White border */}
                  <div className="rounded-full bg-white p-[2px]">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-md">
                      <Image
                        src={story.thumbnail || '/placeholder.svg'}
                        alt={story.title}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Title */}
            <span className="mt-2 text-center text-sm font-medium text-emerald-700">
              {story.title}
            </span>

            {/* Optional tap guide */}
            <span className="text-xs text-gray-400">Tap to view</span>
          </div>
        ))}
      </div>

      {/* Story viewer */}
      {activeStory !== null && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          {/* Header with progress bars */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/40 p-4">
            {/* Progress bars */}
            <div className="flex w-full space-x-1 mb-2">
              {stories[activeStory].images.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 rounded-full bg-white/30"
                >
                  {index === activeImage && (
                    <div
                      className="h-full rounded-full bg-white transition-all duration-50 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {index < activeImage && (
                    <div className="h-full w-full rounded-full bg-white" />
                  )}
                </div>
              ))}
            </div>

            {/* Story info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/50">
                  <Image
                    src={stories[activeStory].thumbnail || '/placeholder.svg'}
                    alt={stories[activeStory].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {stories[activeStory].title}
                </span>
                <span className="text-xs text-white/70">
                  {activeImage + 1}/{stories[activeStory].images.length}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setActiveStory(null)}
                className="rounded-full bg-black/20 p-1 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Story content */}
          <div className="relative h-full w-full max-w-md flex items-center justify-center">
            {activeStory !== null && (
              <Image
                src={
                  stories[activeStory].images[activeImage]?.src ||
                  '/placeholder.svg'
                }
                alt={stories[activeStory].images[activeImage]?.alt}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Caption */}
          {stories[activeStory].images[activeImage]?.caption && (
            <div className="absolute bottom-24 left-0 w-full px-4 text-center">
              <div className="rounded-lg bg-black/30 p-3 backdrop-blur-sm">
                <p className="text-sm text-white/80">
                  {stories[activeStory].images[activeImage]?.caption}
                </p>
              </div>
            </div>
          )}

          <div className="absolute bottom-[25%] left-0 right-0 w-screen">
            {/* Photo navigation */}
            <div className="flex items-center justify-between w-full px-4">
              <button
                onClick={handlePrevImage}
                disabled={activeImage === 0}
                className="flex items-center justify-center rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous Photo</span>
              </button>

              <button
                onClick={handleNextImage}
                className="flex items-center justify-center rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next Photo</span>
              </button>
            </div>
          </div>

          {/* Navigation controls - completely separate from content */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center space-y-4 px-4">
            {/* Story navigation */}
            <div className="flex items-center justify-center space-x-8 w-full">
              <button
                onClick={handlePrevStory}
                disabled={activeStory === 0}
                className="flex items-center justify-center rounded-full bg-ghibli-blue/40 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-ghibli-blue/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>{stories[activeStory - 1]?.title || 'Prev Story'}</span>
              </button>

              <button
                onClick={handleNextStory}
                className="flex items-center justify-center rounded-full bg-ghibli-blue/40 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-ghibli-blue/60"
              >
                <span>{stories[activeStory + 1]?.title || 'Next Story'}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
