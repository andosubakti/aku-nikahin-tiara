'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Pause, Play, SkipForward, SkipBack } from 'lucide-react'

type Props = {
  isActive: boolean
  playlist: { title: string; src: string; cover?: string }[]
  hideFloatingDisk?: boolean // tambahkan prop opsional
}

export default function BackgroundMusic({
  isActive,
  playlist,
  hideFloatingDisk,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [wasPlayingBeforeHide, setWasPlayingBeforeHide] = useState(false)

  const currentTrack = playlist[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isActive) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  const handleEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1 < playlist.length ? prev + 1 : 0))
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio && isActive) {
      audio.load()
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }, [currentTrackIndex, isActive])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1 < playlist.length ? prev + 1 : 0))
  }

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : playlist.length - 1,
    )
  }

  // ✅ Close player when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showPlayer &&
        playerRef.current &&
        !playerRef.current.contains(e.target as Node)
      ) {
        setShowPlayer(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPlayer])

  // Stop audio when user leaves the tab or browser
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current
      if (!audio) return

      if (document.visibilityState === 'hidden') {
        setWasPlayingBeforeHide(isPlaying)
        audio.pause()
        setIsPlaying(false)
      }

      if (
        document.visibilityState === 'visible' &&
        wasPlayingBeforeHide &&
        isActive
      ) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, wasPlayingBeforeHide, isActive])

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        loop={false}
        className="hidden"
      >
        <source src={currentTrack.src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {isActive && (
        <>
          {/* Floating disk */}
          {!hideFloatingDisk && (
            <motion.div
              className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                repeat: isPlaying ? Infinity : 0,
                duration: 6,
                ease: 'linear',
              }}
              onClick={() => setShowPlayer((prev) => !prev)}
            >
              <Image
                src={currentTrack.cover || '/2016/2016-cover.jpg'}
                alt="Music Disk"
                fill
                className="rounded-full object-cover"
              />
            </motion.div>
          )}

          {/* Mini player */}
          <AnimatePresence>
            {showPlayer && (
              <motion.div
                ref={playerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-28 right-6 z-[999] w-80 rounded-xl bg-[#121212] text-white shadow-2xl p-4"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded overflow-hidden shadow-md">
                    <Image
                      src={currentTrack.cover || '/2016/2016-cover.jpg'}
                      alt="Current Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {currentTrack.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={prevTrack}
                    className="rounded border border-gray-600 px-4 py-1 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="rounded bg-emerald-600 px-4 py-1 text-sm font-medium hover:bg-emerald-700 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={nextTrack}
                    className="rounded border border-gray-600 px-4 py-1 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Playlist */}
                <ul className="max-h-40 overflow-y-auto space-y-1 text-sm">
                  {playlist.map((track, index) => (
                    <li
                      key={index}
                      className={`px-3 py-2 rounded cursor-pointer transition ${
                        index === currentTrackIndex
                          ? 'bg-emerald-700 text-white'
                          : 'hover:bg-gray-800'
                      }`}
                      onClick={() => selectTrack(index)}
                    >
                      {track.title}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
