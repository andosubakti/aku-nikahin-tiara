'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import CoverImage from '@/assets/theme.jpg'
import RumahImage from '@/assets/rumah.webp'
import DetailImage from '@/assets/details.jpg'
import { Button } from '@/components/ui/button'
import { capitalizeWords } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export default function HeroSection({
  setIsOpened,
}: {
  setIsOpened: (val: boolean) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [opened, setOpened] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    setName(capitalizeWords(to || ''))
  }, [])

  const handleOpen = () => {
    setOpened(true)
    setIsOpened(true)
  }

  if (!mounted)
    return (
      <div
        className="flex w-screen items-center justify-center bg-gradient-to-b bg-[#407771]"
        style={{ height: '100dvh' }}
      >
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-t-4 border-t-[#273226] border-[#94a37e]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
      </div>
    )

  return (
    <>
      <div className="absolute left-0 h-[50vh] translate-y-1/2 w-full max-w-[40vw] hidden lg:block">
        <Image
          src={RumahImage}
          className="object-contain"
          fill
          alt="cover image"
        />
      </div>
      <div className="absolute right-0 h-[50vh] translate-y-1/2 w-full max-w-[40vw] hidden lg:block">
        <Image
          src={RumahImage}
          className="object-contain"
          fill
          alt="cover image"
        />
      </div>
      <section
        className="relative w-screen max-w-[480px] m-auto overflow-hidden snap-center snap-always"
        style={{ height: '100dvh' }}
      >
        <AnimatePresence>
          {!opened && (
            <motion.div
              key="cover-img"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute top-[50px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9] font-bold p-2 text-center max-w-[80%] w-full">
                {name ? `Yth. ${name}` : ''}
              </div>
              {/* <Image
              src={CoverImage}
              className="object-cover"
              fill
              alt="cover-img"
            /> */}
              <div className="flex flex-col gap-24 md:gap-8 py-[100px] items-center min-h-screen p-5 text-center">
                <div className="header">
                  <h1 className="text-3xl md:text-5xl tracking-widest mb-4 font-bold">
                    U N D A N G A N
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-2">
                    Resepsi Pernikahan Tiara - Ando
                  </p>
                  <p className="text-lg md:text-xl lg:text-2xl">
                    Sabtu, 02 Agustus 2025
                  </p>
                </div>
                <div className="relative w-full h-full min-h-[25vh] md:min-h-[35vh]">
                  <Image
                    src={CoverImage}
                    className="object-cover"
                    fill
                    alt="cover image"
                  />
                </div>
              </div>
              <div className="absolute m-auto text-center w-full bottom-32 quote text-base md:text-lg lg:text-xl italic max-w-2xl leading-relaxed">
                <p>True love doesn't end at death,</p>
                <p>if Allah wills it, it will continue in Jannah</p>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute flex flex-row justify-center bottom-8 w-full"
              >
                <Button
                  onClick={handleOpen}
                  className="bg-[#273226] text-white"
                >
                  Open Invitation
                </Button>
              </motion.div>
            </motion.div>
          )}

          {opened && (
            <motion.div
              key="image-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div
                style={{
                  backgroundSize: '100%',
                  backgroundPositionY: 'bottom',
                }}
                className="flex bg-[url(/tema.webp)] md:bg-none bg-[#1c514f] md:bg-transparent bg-no-repeat text-lg flex-col md:justify-center gap-6 h-screen p-5 font-[family-name:Playfair_Display]"
              >
                <div className="flex flex-col md:text-center md:items-center gap-2">
                  <div className="text-xl mb-4">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                  </div>
                  <p className="">
                    Assalamu'alaikum Warahmatullahi Wabarakatuh
                  </p>
                  <p className="leading-relaxed">
                    Dengan kerendahan hati kami berniat mengundang
                    Bapak/Ibu/Saudara/i menghadiri resepsi pernikahan
                    putra/putri kami
                  </p>
                </div>
                <div className="flex flex-col md:text-center md:items-center gap-2">
                  <h1 className="text-xl font-bold leading-tight">
                    Tiara Ayu Wulanjani S.IP
                  </h1>
                  <p className="text-sm italic">
                    Putri ketiga Bpk. Jatmiko Bowo Leksono & Ibu Hesti Wulanjani
                  </p>
                  <p className="font-medium text-lg py-2">Dengan</p>
                  <h1 className="text-xl font-bold leading-tight">
                    Ando Subakti S.T
                  </h1>
                  <p className="text-sm italic">
                    Putra kedua Bpk. Slamet Romadhoni & Ibu Sri Rahayu
                    Susanawati
                  </p>
                </div>
              </div>
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
                  <ChevronDown className="w-6 h-6 text-[#121c16]" />
                </div>

                {/* Label teks */}
                <span
                  className="text-base font-semibold text-[#121c16] tracking-wide"
                  style={{
                    textShadow: `
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff
                  `,
                  }}
                >
                  Detail Acara
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}
