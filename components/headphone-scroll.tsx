"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

const EXTERIOR_FRAMES = [
  "/cars/porsche-911/frame-00.png",
  "/cars/porsche-911/frame-01.png",
  "/cars/porsche-911/frame-02.png",
  "/cars/porsche-911/frame-03.png",
  "/cars/porsche-911/frame-04.png",
  "/cars/porsche-911/frame-05.png",
]
const COCKPIT_FRAME = "/cars/porsche-911/frame-06.png"

function FrameImage({ src, opacity, alt }: { src: string; opacity: any; alt: string }) {
  return <motion.img src={src} alt={alt} className="absolute inset-0 m-auto h-auto w-[112%] max-w-none object-contain md:w-[92%] lg:w-[78%]" style={{ opacity }} />
}

export default function CarScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 })
  const cockpitOpacity = useTransform(progress, [0.45, 0.54, 0.69, 0.76], [0, 1, 1, 0])
  const frameProgress = useTransform(progress, [0, 0.48], [0, EXTERIOR_FRAMES.length - 1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const precisionOpacity = useTransform(scrollYProgress, [0.14, 0.25, 0.38, 0.48], [0, 1, 1, 0])
  const interiorTextOpacity = useTransform(scrollYProgress, [0.47, 0.58, 0.68, 0.76], [0, 1, 1, 0])
  const finalOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1])

  useEffect(() => {
    let remaining = EXTERIOR_FRAMES.length + 1
    const markLoaded = () => {
      remaining -= 1
      if (remaining <= 0) setLoaded(true)
    }
    ;[...EXTERIOR_FRAMES, COCKPIT_FRAME].forEach((src) => {
      const image = new Image()
      image.onload = markLoaded
      image.onerror = markLoaded
      image.src = src
    })
  }, [])

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#08090b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#25282d_0%,#08090b_64%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#08090b] to-transparent" />
        <motion.div className="relative z-10 h-full w-full" style={{ scale: reducedMotion ? 1 : useTransform(progress, [0, 1], [1.04, 1]) }}>
          {EXTERIOR_FRAMES.map((src, index) => (
            <FrameImage key={src} src={src} alt={`Porsche 911 studio view ${index + 1}`} opacity={useTransform(frameProgress, [index - 0.35, index, index + 0.35], [0, 1, 0])} />
          ))}
          <FrameImage src={COCKPIT_FRAME} alt="Porsche 911 cockpit with the driver's door open" opacity={cockpitOpacity} />
          {!loaded && <div className="absolute inset-0 m-auto h-1 w-24 bg-white/30" />}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-20">
          <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity: heroOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/80 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/70">Introducing</p>
              <h1 className="text-6xl font-bold tracking-tighter text-white md:text-8xl lg:text-9xl">911 Carrera</h1>
              <p className="mt-4 max-w-md text-base tracking-wide text-white/70 md:text-lg">The sports car, reimagined.</p>
              <div className="mt-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50"><div className="h-px w-8 bg-white/30" /> Scroll to explore <span>↓</span></div>
            </div>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: precisionOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/70 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">01</p><h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Every angle, intentional.</h2><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">A six-frame turntable reveal traces the 911 silhouette from nose to tail.</p></div>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: interiorTextOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/70 to-transparent" />
            <div className="relative flex justify-end px-6 pb-16 md:px-12 md:pb-20 lg:px-20"><div className="max-w-md text-right"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">02</p><h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Open the cockpit.</h2><p className="ml-auto mt-4 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">Driver-focused controls, sculpted sport seats, and the ritual of an open door.</p></div></div>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: finalOpacity }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/80 to-transparent" />
            <div className="relative px-6 pb-16 md:px-12 md:pb-20 lg:px-20"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">03</p><h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Make every corner count.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 md:text-base">A timeless shape, a responsive flat-six, and a chassis tuned for the road ahead.</p><motion.button className="pointer-events-auto mt-8 rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-wide text-black" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Configure your 911</motion.button></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export { CarScroll }
export { CarScroll as HeadphoneScroll }

