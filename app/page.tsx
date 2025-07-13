'use client'

import { useState, useEffect, useRef } from 'react'
import HeroSection from '@/components/hero-section'
import WeddingDetails from '@/components/wedding-details'
import RsvpForm from '@/components/rsvp-form'
import Gallery from '@/components/gallery'
import FloatingElements from '@/components/floating-elements'
import BackgroundMusic from '@/components/background-musics'
import ImageViewer from '@/components/image-viewer'
import Image from 'next/image'
import { MapPin, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import QRImage from '@/assets/qr-code.png'
import RumahImage from '@/assets/rumah.webp'

export default function Home() {
  const [isOpened, setIsOpened] = useState(false)
  const [isFormal, setIsFormal] = useState(false)
  const [isTimelineVisible, setIsTimelineVisible] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLElement>(null)

  // Timeline images array
  const timelineImages = [
    '/galeri-1.webp',
    '/galeri-2.webp',
    '/galeri-3.webp',
    '/galeri-4.webp',
    '/galeri-5.webp',
    '/galeri-6.webp',
  ]

  // Handle image click
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageViewerOpen(true)
  }

  // Handle image viewer close
  const handleImageViewerClose = () => {
    setIsImageViewerOpen(false)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const formal = params.get('formal')
    setIsFormal(formal === 'true')
  }, [])

  useEffect(() => {
    if (!timelineRef.current || !videoRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            // Video is 80% visible, start playing
            setIsTimelineVisible(true)
            if (videoRef.current) {
              videoRef.current.play().catch((error) => {
                console.log('Autoplay prevented:', error)
              })
            }
          } else {
            // Video is not visible enough, pause
            setIsTimelineVisible(false)
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      {
        threshold: 0.8, // Trigger when 80% of the section is visible
        rootMargin: '0px',
      },
    )

    observer.observe(timelineRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isOpened])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          // Page is hidden (minimized, tab switched, etc.), pause video
          videoRef.current.pause()
        } else {
          // Page is visible again, check if timeline section is visible
          if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect()
            const isVisible =
              rect.top < window.innerHeight * 0.2 &&
              rect.bottom > window.innerHeight * 0.8

            if (isVisible) {
              videoRef.current.play().catch((error) => {
                console.log('Autoplay prevented:', error)
              })
            }
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <main
      className="relative snap-y snap-mandatory overflow-scroll scroll-smooth bg-[#104442]"
      style={{ height: '100dvh' }}
    >
      <div className="fixed z-[50] left-0 h-[50vh] translate-y-1/2 w-full max-w-[40vw] hidden lg:block">
        <Image
          src={RumahImage}
          className="object-contain"
          fill
          alt="cover image"
        />
      </div>
      <div className="fixed z-[50] right-0 h-[50vh] translate-y-1/2 w-full max-w-[40vw] hidden lg:block">
        <Image
          src={RumahImage}
          className="object-contain"
          fill
          alt="cover image"
        />
      </div>
      <HeroSection setIsOpened={setIsOpened} />
      {/* Background music logic */}
      {isFormal ? (
        isOpened && (
          <BackgroundMusic
            isActive={isOpened && !isTimelineVisible}
            playlist={[
              {
                title: 'ibu pertiwi',
                src: '/ibu-pertiwi.mpeg',
                cover: '/', // You can use a cover image if available
              },
            ]}
            hideFloatingDisk={true}
          />
        )
      ) : (
        <BackgroundMusic
          isActive={isOpened && !isTimelineVisible}
          playlist={[
            {
              title: 'Grup Besar Kecil - Samuel & Samia',
              src: '/samuel_dan_samia.mp3',
              cover: '/samuel_samia_cover.png',
            },
            {
              title: 'The Adams - Timur',
              src: '/timur.mp3',
              cover: '/timur_cover.jpg',
            },
            {
              title: 'Sheila on 7 - Memori Baik',
              src: '/memori_baik.mp3',
              cover: '/memori_baik_cover.jpeg',
            },
            {
              title: 'Kabar Burung - Kamu Rahasia',
              src: '/kamu_rahasia.mp3',
              cover: '/kamu_rahasia_cover.jpg',
            },
            {
              title: 'Ungu feat. Andien - Saat Bahagia',
              src: '/saat_bahagia.mp3',
              cover: '/saat_bahagia_cover.jpeg',
            },
            {
              title: `D'masiv- Natural`,
              src: '/natural.mp3',
              cover: '/natural_cover.jpeg',
            },
          ]}
        />
      )}

      {isOpened && (
        <>
          {isFormal && (
            <section
              id="cover-formal"
              className="w-screen max-w-[480px] m-auto bg-[#104442] relative snap-center snap-always flex flex-col"
              style={{
                height: '100dvh',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {/* Kontainer utama */}
              <Image src="/resepsi/2.webp" fill alt="cover" />

              {/* Panah Scroll */}
              <motion.button
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-6 w-full flex flex-col items-center z-30 cursor-pointer focus:outline-none"
                onClick={() => {
                  const target = document.getElementById('sub-cover')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {/* Icon bulat */}
                <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2 mb-2">
                  <ChevronDown className="w-6 h-6 text-[#335A4A]" />
                </div>

                {/* Label teks */}
                <span
                  className="text-base font-semibold text-[#335A4A] tracking-wide"
                  style={{
                    textShadow: `
                  -1px -1px 0 #fff,
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff
                `,
                  }}
                >
                  Waktu dan Lokasi Acara
                </span>
              </motion.button>
            </section>
          )}

          <section
            id="sub-cover"
            className="w-screen max-w-[480px] m-auto bg-[#104442] relative snap-center snap-always flex flex-col"
            style={{
              height: '100dvh',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            {/* Kontainer utama */}
            <Image src="/resepsi/3.webp" fill alt="cover" />

            {/* Panah Scroll */}
            <motion.button
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-6 w-full flex flex-col items-center z-30 cursor-pointer focus:outline-none"
              onClick={() => {
                const target = document.getElementById('4')
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {/* Icon bulat */}
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2 mb-2">
                <ChevronDown className="w-6 h-6 text-[#335A4A]" />
              </div>

              {/* Label teks */}
              <span
                className="text-base font-semibold text-[#335A4A] tracking-wide"
                style={{
                  textShadow: `
                  -1px -1px 0 #fff,
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff
                `,
                }}
              >
                Waktu dan Lokasi Acara
              </span>
            </motion.button>
          </section>

          <section
            id="4"
            className="w-screen max-w-[480px] m-auto bg-[#104442] relative snap-center snap-always flex flex-col"
            style={{
              height: '100dvh',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            {/* Kontainer utama */}
            <Image src="/resepsi/4.webp" fill alt="cover" />

            <div className="flex flex-col gap-2 items-center justify-center">
              {/* <Image
                  width={100}
                  height={100}
                  alt="qr code"
                  src={QRImage}
                  className="rounded-xl"
                /> */}
              <a
                href="https://maps.app.goo.gl/BdxhQB7f5rsYY6H88"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-[30%] inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition text-xs max-w-md w-fit shadow-lg bg-black overflow-hidden"
              >
                <MapPin className="w-5 h-5" />
                Lihat di Google Maps
              </a>
            </div>

            {/* Panah Scroll */}
            <motion.button
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-6 w-full flex flex-col items-center z-30 cursor-pointer focus:outline-none"
              onClick={() => {
                const target = document.getElementById('timeline')
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {/* Icon bulat */}
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2 mb-2">
                <ChevronDown className="w-6 h-6 text-[#335A4A]" />
              </div>

              {/* Label teks */}
              {!isFormal && (
                <span
                  className="text-base font-semibold text-[#335A4A] tracking-wide"
                  style={{
                    textShadow: `
                  -1px -1px 0 #fff,
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff
                `,
                  }}
                >
                  Akad Nikah
                </span>
              )}
            </motion.button>
          </section>

          <section
            ref={timelineRef}
            id="timeline"
            className={`w-screen max-w-[480px] ${
              !isFormal ? 'md:max-w-full' : ''
            } m-auto relative snap-center snap-always flex flex-col items-center justify-center bg-[#104442]`}
            style={{ height: '100dvh' }}
          >
            {isFormal ? (
              <Image
                src="/resepsi/5.webp"
                fill
                alt="cover"
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col">
                <video
                  ref={videoRef}
                  src="https://think-like-a-shortcut.work/Copy%20of%20Tiara%26Ando.mp4"
                  className="w-full max-h-[45vh] md:max-h-[100vh] object-contain flex-shrink-0 z-[60]"
                  controls
                  loop
                  playsInline
                />
                <div className="video-panel flex-1 min-h-0 flex flex-col md:hidden">
                  <div className="m-2 p-2 flex flex-col gap-1">
                    <h2 className="text-lg text-white">
                      Pelaksanaan Akad Nikah
                    </h2>
                    <p className="text-sm text-gray-400">
                      Selasa Wage, 22 April 2025
                    </p>
                  </div>
                  <div className="photo-galery grid grid-cols-2 gap-2 flex-1 overflow-y-auto pb-4 px-4">
                    {/* grid photo */}
                    {timelineImages.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-full overflow-hidden rounded-lg m-auto shadow-md cursor-pointer"
                        onClick={() => handleImageClick(idx)}
                      >
                        <img
                          src={src}
                          alt={`Galeri foto ${idx + 1}`}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Panah Scroll */}
            {!isFormal && (
              <motion.button
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-6 w-fit flex flex-col items-center z-30 cursor-pointer focus:outline-none"
                onClick={() => {
                  const target = document.getElementById('gallery')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {/* Icon bulat */}
                <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2 mb-2">
                  <ChevronDown className="w-6 h-6 text-[#335A4A]" />
                </div>

                {/* Label teks */}
                <span
                  className="text-base font-semibold text-[#335A4A] tracking-wide"
                  style={{
                    textShadow: `
                  -1px -1px 0 #fff,
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff
                `,
                  }}
                >
                  Our Journey
                </span>
              </motion.button>
            )}
          </section>

          {!isFormal && (
            <section
              id="gallery"
              className="w-screen max-w-[480px] m-auto max-w-[480px] m-auto relative snap-center snap-always"
              style={{ height: '100dvh' }}
            >
              <div className="absolute top-[24px] z-[9] w-full">
                <h2 className="mb-8 text-center font-serif text-lg italic font-medium text-[#335A4A]">
                  "Our love, timeless — our journey, endless."
                </h2>
                <Gallery />
              </div>
              <Image
                src="/bg-story.jpg"
                fill
                alt="bg-story"
                className="absolute object-cover object-center"
              />
              {/* Panah Scroll */}
              <motion.button
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-6 w-full flex flex-col items-center z-9 cursor-pointer focus:outline-none"
                onClick={() => {
                  const target = document.getElementById('end')
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {/* Icon bulat */}
                <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2 mb-2">
                  <ChevronDown className="w-6 h-6 text-[#335A4A]" />
                </div>

                {/* Label teks */}
                <span
                  className="text-base font-semibold text-[#335A4A] tracking-wide"
                  style={{
                    textShadow: `
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff
                  `,
                  }}
                >
                  Our Milestones
                </span>
              </motion.button>
            </section>
          )}
          {!isFormal && (
            <section
              id="end"
              className="w-screen max-w-[480px] m-auto max-w-[480px] m-auto relative snap-center snap-always flex flex-col justify-center items-center px-4 pt-16"
              style={{ height: '100dvh' }}
            >
              <h2 className="text-center font-serif text-lg italic font-medium text-[#335A4A] absolute top-5 z-[9]">
                Our Milestones
              </h2>
              <div className="w-fit max-w-xs z-[9] min-w-[109px] px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border border-[#CED6BF]/30 bg-[#273226]/60 text-[#E8D8CF]">
                <div className="text-sm font-semibold">
                  Pacaran 11 tahun wkwk 😅
                </div>
              </div>
              {/* Vertical Line */}
              <div className="z-[9] relative w-full max-w-[15rem]">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-[#335A4A]" />
                {[
                  {
                    label: 'Lamaran',
                    status: 'done',
                    date: '2 Feb 2025',
                  },
                  {
                    label: 'Akad Nikah',
                    status: 'current',
                    date: '22 April 2025',
                  },
                  {
                    label: 'Resepsi',
                    status: 'upcoming',
                    date: '2 Agustus 2025',
                  },
                ].map((item, index) => {
                  const isLeft = index % 2 === 0
                  const bulletColor =
                    item.status === 'done'
                      ? 'bg-[#94A37E]'
                      : item.status === 'current'
                      ? 'bg-[#335A4A] animate-pulse'
                      : 'bg-[#CED6BF]'

                  return (
                    <div
                      key={index}
                      className={`relative flex items-center w-full mb-5 mt-5 ${
                        isLeft ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {/* Card */}
                      <div
                        className={`
                          w-fit max-w-xs min-w-[109px] px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border
                          ${
                            item.status === 'current'
                              ? 'border-[#335A4A] scale-[1.03]'
                              : 'border-[#CED6BF]/30'
                          }
                          bg-[#273226]/60 text-[#E8D8CF]
                        `}
                      >
                        <div className="text-[10px] text-[#E8D8CF]/70">
                          {item.date}
                        </div>
                        <div className="text-sm font-semibold">
                          {item.label}
                        </div>
                      </div>

                      {/* Bullet */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#CED6BF] z-10 shadow-sm bg-white/40">
                        <div
                          className={`w-full h-full rounded-full ${bulletColor}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="w-fit max-w-xs z-[9] min-w-[109px] px-4 py-2 rounded-lg shadow-lg backdrop-blur-md border border-[#CED6BF]/30 bg-[#273226]/60 text-[#E8D8CF]">
                <div className="text-sm font-semibold">
                  Bab baru dimulai, Bismillah! 🙏🏻
                </div>
              </div>
              {/* Background */}
              <Image
                src="/closing.png"
                fill
                alt="bg-closing"
                className="absolute object-cover object-center"
              />
            </section>
          )}

          <section
            id="4"
            className="w-screen max-w-[480px] m-auto bg-[#104442] relative snap-center snap-always flex flex-col"
            style={{
              height: '100dvh',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            {/* Kontainer utama */}
            <Image src="/resepsi/6.webp" fill alt="cover" />
          </section>
        </>
      )}

      {isImageViewerOpen && (
        <ImageViewer
          images={timelineImages}
          isOpen={isImageViewerOpen}
          onClose={handleImageViewerClose}
          initialIndex={selectedImageIndex}
        />
      )}
    </main>
  )
}
