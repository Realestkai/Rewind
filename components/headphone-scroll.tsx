"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

const CAR_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_bzfyv2bzfyv2bzfy-wgWw8tMapZp74kPo6WRQf4eKWl0Jrw.jpg"

export default function CarScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const precisionOpacity = useTransform(scrollYProgress, [0.16, 0.25, 0.38, 0.47], [0, 1, 1, 0])
  const interiorOpacity = useTransform(scrollYProgress, [0.43, 0.56, 0.68, 0.77], [0, 1, 1, 0])
  const finalOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1])
  const carRotate = useTransform(progress, [0, 0.45, 0.75, 1], [-2, 9, -4, 0])
  const carScale = useTransform(progress, [0, 0.35, 0.68, 1], [1, 1.08, 1.16, 1.02])
  const carX = useTransform(progress, [0, 0.45, 0.75, 1], [0, -28, 24, 0])
  const carY = useTransform(progress, [0, 0.55, 1], [20, -12, 0])

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#080711]">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${CAR_IMAGE})`,
            scale: useTransform(progress, [0, 1], [1.06, 1.14]),
          }}
        />
        <div className="absolute inset-0 bg-[#070714]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-transparent to-[#080711]/30" />

        <motion.img
          src={CAR_IMAGE}
          alt="Purple performance sedan at a gas station at night"
          className="relative z-10 h-auto w-[115%] max-w-none object-cover mix-blend-screen md:w-[88%] lg:w-[78%]"
          style={{ rotate: carRotate, scale: carScale, x: carX, y: carY }}
        />

        <div className="pointer-events-none absolute inset-0 z-20">
          <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity: heroOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-[#080711]/80 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/70">Introducing</p>
              <h1 className="text-6xl font-bold tracking-tighter text-white md:text-8xl lg:text-9xl">Momo R</h1>
              <p className="mt-4 max-w-md text-base tracking-wide text-white/70 md:text-lg">Performance, in motion.</p>
              <div className="mt-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                <div className="h-px w-8 bg-white/30" /> Scroll to explore <span>↓</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: precisionOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-[#080711]/70 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">01</p>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Sculpted for speed.</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
                A low, athletic silhouette cut through midnight air. Scroll through every angle of the machine.
              </p>
            </div>
          </motion.div>

          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: interiorOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-[#080711]/70 to-transparent" />
            <div className="relative flex justify-end px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
              <div className="max-w-md text-right">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">02</p>
                <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Open the experience.</h2>
                <p className="ml-auto mt-4 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
                  The next frame is the cabin: driver-focused controls, ambient light, and room to disappear into the road.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: finalOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-[#080711]/80 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">03</p>
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Make every arrival count.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                Adaptive performance, intelligent all-wheel drive, and a cockpit built around the person behind the wheel.
              </p>
              <motion.button className="pointer-events-auto mt-8 rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-wide text-black" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Reserve Momo R
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export { CarScroll }
export { CarScroll as HeadphoneScroll }

// The supplied single hero image is used as the product plate; the spring-driven
// camera motion creates the 360-style reveal while the copy cues the interior beat.
