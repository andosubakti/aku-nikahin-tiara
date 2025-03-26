'use client'

import { useState } from 'react'
import HeroSection from '@/components/hero-section'
import WeddingDetails from '@/components/wedding-details'
import RsvpForm from '@/components/rsvp-form'
import Gallery from '@/components/gallery'
import FloatingElements from '@/components/floating-elements'
import BackgroundMusic from '@/components/background-musics'
import Image from 'next/image'

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
            id="gallery"
            className="w-screen relative snap-center snap-always"
            style={{ height: '100dvh' }}
          >
            <div className="absolute top-[24px] z-[9] w-full">
              <h2 className="mb-8 text-center font-serif text-lg italic font-medium text-[#335A4A]">
                "Seperti pelangi, yang setia menunggu hujan reda."
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
