'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from 'framer-motion'

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

interface ParallaxProps {
  children: string
  baseVelocity: number
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })

  // Magic wrap numbers depend on the length of the text block to make it seamless.
  // Using -20% to -45% usually works for a string repeated 4 times.
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef<number>(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    // Reverse direction if scrolling up
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-4">
      <motion.div className="font-serif font-bold uppercase text-[10vw] leading-[1] tracking-tighter flex whitespace-nowrap flex-nowrap text-transparent" style={{ x, WebkitTextStroke: '2px var(--color-waldorf-mustard)', opacity: 0.8 }}>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
      </motion.div>
    </div>
  )
}

export default function VelocityMarquee() {
  return (
    <section className="bg-[#FAF8F5] relative z-10 py-12 rotate-[-2deg] scale-110 -my-12 w-[110%] -ml-[5%] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-transparent to-[#FAF8F5] z-10" />
      <ParallaxText baseVelocity={-2}>COLEGIO WALDORF TREKAN • EDUCAR PARA LA LIBERTAD •</ParallaxText>
      <ParallaxText baseVelocity={2}>RESPETO POR LOS RITMOS NATURALES • DESARROLLO INTEGRAL •</ParallaxText>
    </section>
  )
}
