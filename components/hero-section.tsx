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
  const [isFormal, setIsFormal] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    setName(capitalizeWords(to || ''))
    const formal = params.get('formal')
    setIsFormal(formal === 'true')
  }, [])

  const handleOpen = () => {
    setOpened(true)
    setIsOpened(true)
  }

  if (!mounted)
    return (
      <div
        className="flex w-screen items-center justify-center bg-[#104442]"
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
      <section
        className="relative w-screen max-w-[480px] m-auto overflow-hidden snap-center snap-always bg-[#104442]"
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
              <Image
                src="/resepsi/1.webp"
                fill
                alt="cover"
                className="object-contain"
              />
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
              {isFormal ? (
                <Image
                  src="/resepsi/1.webp"
                  fill
                  alt="cover"
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/resepsi/2.webp"
                  fill
                  alt="cover"
                  className="object-contain"
                />
              )}
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
