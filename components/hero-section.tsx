'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import CoverImage from '@/assets/cover.jpg'
import DetailImage from '@/assets/details.jpg'
import { Button } from '@/components/ui/button'

export default function HeroSection({
  setIsOpened,
}: {
  setIsOpened: (val: boolean) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpen = () => {
    setOpened(true)
    setIsOpened(true)
  }

  if (!mounted)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#CED6BF] to-[#94a37e]">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-t-4 border-t-[#273226] border-[#94a37e]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
      </div>
    )

  return (
    <section className="relative h-screen w-screen overflow-hidden snap-center snap-always">
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="cover-img"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
