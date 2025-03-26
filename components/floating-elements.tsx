"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Clouds */}
      <motion.div
        className="absolute left-[5%] top-[10%] h-16 w-32 rounded-full bg-white/40 blur-md"
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[70%] top-[15%] h-20 w-40 rounded-full bg-white/30 blur-md"
        animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 25, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[30%] top-[5%] h-12 w-24 rounded-full bg-white/20 blur-md"
        animate={{ x: [0, 15, 0], y: [0, 5, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 15, ease: "easeInOut" }}
      />

      {/* Leaves */}
      <motion.div
        className="absolute bottom-[20%] left-[10%] h-8 w-8 rounded-full bg-ghibli-green/20 blur-sm"
        animate={{
          x: [0, 100, 200, 300, 400, 500],
          y: [0, 50, 0, 50, 0, 50],
          rotate: [0, 360],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[5%] h-6 w-6 rounded-full bg-ghibli-green/30 blur-sm"
        animate={{
          x: [0, 100, 200, 300, 400, 500],
          y: [0, -30, 0, -30, 0, -30],
          rotate: [0, 360],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 25, ease: "linear", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[15%] h-4 w-4 rounded-full bg-ghibli-yellow/30 blur-sm"
        animate={{
          x: [0, 100, 200, 300, 400, 500],
          y: [0, 20, 0, 20, 0, 20],
          rotate: [0, 360],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 35, ease: "linear", delay: 5 }}
      />

      {/* Dust particles */}
      <motion.div
        className="absolute bottom-[40%] right-[10%] h-2 w-2 rounded-full bg-white/60"
        animate={{
          y: [0, -200],
          opacity: [0, 1, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[20%] h-1 w-1 rounded-full bg-white/60"
        animate={{
          y: [0, -150],
          opacity: [0, 1, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[35%] right-[15%] h-1.5 w-1.5 rounded-full bg-white/60"
        animate={{
          y: [0, -180],
          opacity: [0, 1, 0],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 12, ease: "easeOut", delay: 4 }}
      />

      {/* Background gradient circles */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-ghibli-blue/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-ghibli-pink/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-60 w-60 rounded-full bg-ghibli-yellow/10 blur-3xl" />
    </div>
  )
}

