'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import CoverImage from '@/assets/cover.jpg'
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
        className="flex w-screen items-center justify-center bg-gradient-to-b from-[#CED6BF] to-[#94a37e]"
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
    <section
      className="relative w-screen overflow-hidden snap-center snap-always"
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
            <div className="absolute top-0 left-0 z-[9] text-gray-700 p-2">
              {name ? `Yth. ${name}` : ''}
            </div>
            <Image src={CoverImage} fill alt="cover-img" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute flex flex-row justify-center bottom-8 w-full"
            >
              <Button onClick={handleOpen} className="bg-[#273226] text-white">
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
            <Image src={DetailImage} fill alt="image-2" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
