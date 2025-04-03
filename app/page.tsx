'use client'

import { useState } from 'react'
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
            title: 'The Adams - Timur',
            src: '/timur.mp3',
            cover: '/2014/2014-cover.jpg',
          },
          {
            title: 'Ungu feat. Andien - Saat Bahagia',
            src: '/saat_bahagia.mp3',
            cover: '/2015/2015-cover.jpg',
          },
          {
            title: `D'masiv- Natural`,
            src: '/natural.mp3',
            cover: '/2016/2016-cover.jpg',
          },
        ]}
      />

      {isOpened && (
        <>
          <section
            id="thanks"
            className="w-screen relative snap-center snap-always flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#94a37e] to-gray-300"
            style={{ height: '100dvh' }}
          >
            <h2 className="mb-8 text-center font-serif text-lg italic font-medium text-[#335A4A]">
              Keluarga Besar Bapak Jatmiko dan Bapak Selamet Romadoni
            </h2>
            {/* Kontainer utama */}
            <div className="max-w-md w-full rounded-2xl shadow-lg bg-white overflow-hidden z-10">
              <div className="w-full h-48 relative">
                <Image
                  src="/keluarga.jpeg"
                  fill
                  alt="keluarga"
                  className="absolute object-fill object-center z-0"
                />
              </div>

              {/* Deskripsi dan Tombol */}
              <div className="p-4 flex flex-col items-center">
                <div className="flex flex-col items-center text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Mengucapkan terima kasih banyak atas kehadiran dan doa restu
                    Bapak/Ibu.
                  </p>
                </div>
              </div>
            </div>

            {/* Background map image */}
            {/* <Image
              src="/map.jpeg"
              fill
              alt="bg-map"
              className="absolute object-cover object-center z-0"
            /> */}

            {/* Panah Scroll */}
            <motion.button
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-6 w-full flex flex-col items-center z-30 cursor-pointer focus:outline-none"
              onClick={() => {
                const target = document.getElementById('maps')
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
                Lihat Lokasi
              </span>
            </motion.button>
          </section>

          <section
            id="maps"
            className="w-screen relative snap-center snap-always flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#CED6BF] to-[#94a37e]"
            style={{ height: '100dvh' }}
          >
            {/* Kontainer utama */}
            <div className="max-w-md w-full rounded-2xl shadow-lg bg-white overflow-hidden z-10">
              {/* Iframe Peta */}
              <div className="w-full h-48">
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
              </div>

              {/* Deskripsi dan Tombol */}
              <div className="p-4 flex flex-col items-center">
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
              </div>
            </div>

            {/* Background map image */}
            <Image
              src="/map.jpeg"
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
          </section>
          {/* <div className="container relative z-10 mx-auto px-4 py-8">
            <footer className="border-t border-emerald-200 py-8 text-center text-emerald-700">
              <p className="mb-2 font-serif italic">
                "Seperti pelangi, yang setia menunggu hujan reda."
              </p>
              <p className="text-sm">• Designed by Tiara Ayu Wulanjani •</p>
            </footer>
          </div> */}
        </>
      )}
    </main>
  )
}
