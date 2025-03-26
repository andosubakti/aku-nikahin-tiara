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
    id: 1,
    title: '2014',
    thumbnail: '/2014/2014-cover.jpg',
    images: [
      {
        src: '/2014/2014-1.jpg',
        alt: 'Our first date at the café',
        caption: 'Where it all began',
      },
      {
        src: '/2014/2014-2.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2014/2014-3.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2014/2014-5.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2014/2014-6.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2014/2014-7.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2014/2014-8.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
    ],
  },
  {
    id: 2,
    title: '2015',
    thumbnail: '/2015/2015-cover.jpg',
    images: [
      {
        src: '/2015/2015-1.jpg',
        alt: 'Our first date at the café',
        caption: 'Where it all began',
      },
      {
        src: '/2015/2015-2.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2015/2015-3.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2015/2015-5.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2015/2015-6.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
    ],
  },
  {
    id: 3,
    title: '2016',
    thumbnail: '/2016/2016-cover.jpg',
    images: [
      {
        src: '/2016/2016-1.jpg',
        alt: 'Our first date at the café',
        caption: 'Where it all began',
      },
      {
        src: '/2016/2016-2.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2016/2016-3.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2016/2016-5.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2016/2016-6.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2016/2016-cover.jpg',
        alt: 'Walking in the park after coffee',
        caption: 'Our first walk together',
      },
      {
        src: '/2016/2016-8.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
      {
        src: '/2016/2016-9.jpg',
        alt: 'Sunset on our first date',
        caption: 'The perfect ending to a perfect day',
      },
    ],
  },
  {
    id: 4,
    title: 'Beach Day',
    thumbnail: '/placeholder.svg?height=200&width=200',
    images: [
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Day at the beach',
        caption: 'Our favorite beach spot',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Building sandcastles',
        caption: 'Our sandcastle masterpiece',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Beach sunset',
        caption: 'Golden hour at the shore',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Stargazing on the beach',
        caption: 'Counting stars together',
      },
    ],
  },
  {
    id: 5,
    title: 'The Proposal',
    thumbnail: '/placeholder.svg?height=200&width=200',
    images: [
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'The proposal setup',
        caption: 'The scene was set',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'The proposal moment',
        caption: 'The moment I said yes',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Celebrating after',
        caption: 'Celebrating our engagement',
      },
    ],
  },
  {
    id: 6,
    title: 'Engagement',
    thumbnail: '/placeholder.svg?height=200&width=200',
    images: [
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Engagement photo',
        caption: 'Our official engagement photo',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Showing off the ring',
        caption: 'The perfect ring',
      },
    ],
  },
  {
    id: 7,
    title: 'Our Journey',
    thumbnail: '/placeholder.svg?height=200&width=200',
    images: [
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Our journey together',
        caption: 'Looking back on our journey',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Planning our wedding',
        caption: 'Planning our special day',
      },
      {
        src: '/placeholder.svg?height=800&width=600',
        alt: 'Dreaming of the future',
        caption: "Excited for what's to come",
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
      }, 50) // 5 seconds total duration (50ms * 100)

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
    if (activeStory !== null && activeStory < stories.length - 1) {
      setActiveStory((prevState) => Number(prevState) + 1)
      setActiveImage(0)
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
              onClick={() => setActiveStory(index)}
              className="group relative flex-shrink-0"
            >
              {/* Outer ring with rainbow */}
              <div className="bg-[conic-gradient(red,orange,violet,red)] p-[4px] rounded-full">
                {/* Inner white ring */}
                <div className="rounded-full bg-white">
                  {/* Actual image thumbnail */}
                  <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full group-hover:scale-105 transition-transform duration-200">
                    <Image
                      src={story.thumbnail || '/placeholder.svg'}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </button>

            <span className="mt-2 text-center text-sm font-medium text-emerald-700">
              {story.title}
            </span>
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
                  stories[activeStory].images[activeImage].src ||
                  '/placeholder.svg'
                }
                alt={stories[activeStory].images[activeImage].alt}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-24 left-0 w-full px-4 text-center">
            <div className="rounded-lg bg-black/30 p-3 backdrop-blur-sm">
              <p className="text-sm text-white/80">
                {stories[activeStory].images[activeImage].caption}
              </p>
            </div>
          </div>

          <div className="absolute bottom-[50%] left-0 right-0 w-screen">
            {/* Photo navigation */}
            <div className="flex items-center justify-between w-full px-4">
              <button
                onClick={handlePrevImage}
                disabled={activeImage === 0}
                className="flex items-center justify-center rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous Photo</span>
              </button>

              <button
                onClick={handleNextImage}
                disabled={
                  activeImage === stories[activeStory].images.length - 1
                }
                className="flex items-center justify-center rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Prev Story</span>
              </button>

              <button
                onClick={handleNextStory}
                className="flex items-center justify-center rounded-full bg-ghibli-blue/40 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-ghibli-blue/60"
              >
                <span>Next Story</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
