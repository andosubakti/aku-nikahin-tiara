'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/hero-section'
import WeddingDetails from '@/components/wedding-details'
import RsvpForm from '@/components/rsvp-form'
import Gallery from '@/components/gallery'
import FloatingElements from '@/components/floating-elements'
import BackgroundMusic from '@/components/background-musics'
import Image from 'next/image'
import { MapPin, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [isOpened, setIsOpened] = useState(false)
  const [isFormal, setIsFormal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const formal = params.get('formal')
    setIsFormal(formal === 'true')
  }, [])

  return (
    <main
      className="relative snap-y snap-mandatory overflow-scroll scroll-smooth bg-[#CED6BF]"
      style={{ height: '100dvh' }}
    >
      <FloatingElements />
      <HeroSection setIsOpened={setIsOpened} />
      <BackgroundMusic
        isActive={isOpened}
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

      {isOpened && (
        <>
          <section
            id="maps"
            className="w-screen relative snap-center snap-always flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#CED6BF] to-[#94a37e]"
            style={{ height: '100dvh' }}
          >
            {/* Kontainer utama */}
            <div className="max-w-md w-fit absolute top-[30%] right-[5%] rounded-2xl shadow-lg bg-white overflow-hidden z-10">
              {/* Iframe Peta */}
              {/* <div className="w-full h-48">
                <iframe
                  title="Lokasi Acara"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.782139674573!2d106.8582436!3d-6.292338399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f27be54480a9%3A0x789d17849b7d4bb1!2sJl.%20H.%20Nasih%20No.16%2C%20RT.9%2FRW.3%2C%20Kp.%20Tengah%2C%20Kec.%20Kramat%20jati%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013520!5e0!3m2!1sid!2sid!4v1743602991812!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0 w-full h-full"
                ></iframe>
              </div> */}

              {/* Deskripsi dan Tombol */}
              {/* <div className="p-4 flex flex-col items-center">
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold mb-2">
                    Kediaman Bapak Jatmiko
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Jl. H. Nasih No.16 - RT. 09 RW. 003 <br />
                    Kel. Gedong - Kec. Pasar Rebo - Jakarta Timur
                  </p>
                </div>
                <a
                  href="https://maps.app.goo.gl/KHvNwmLkQqX9Hecx6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  <MapPin className="w-5 h-5" />
                  Lihat di Google Maps
                </a>
              </div> */}
              <a
                href="https://maps.app.goo.gl/KHvNwmLkQqX9Hecx6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#94a37e] text-white font-medium hover:bg-[#94a37e] transition text-xs"
              >
                <MapPin className="w-5 h-5" />
                Lihat di Google Maps
              </a>
            </div>

            {/* Background map image */}
            <Image
              src="/map.jpg"
              fill
              alt="bg-map"
              className="absolute object-cover object-center z-0"
            />

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
                Rundown
              </span>
            </motion.button>
          </section>

          <section
            id="timeline"
            className="w-screen relative snap-center snap-always flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#CED6BF] to-[#94a37e]"
            style={{ height: '100dvh' }}
          >
            {/* Background timeline image */}
            <Image
              src="/timeline.jpg"
              fill
              alt="bg-map"
              className="absolute object-cover object-center z-0"
            />

            {/* Panah Scroll */}
            <motion.button
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-6 w-full flex flex-col items-center z-30 cursor-pointer focus:outline-none"
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
          </section>

          {!isFormal && (
            <section
              id="gallery"
              className="w-screen relative snap-center snap-always"
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
              className="w-screen relative snap-center snap-always flex flex-col justify-center items-center px-4 pt-16"
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
        </>
      )}
    </main>
  )
}
