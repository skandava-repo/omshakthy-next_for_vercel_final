'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'
import './WhatWeDoMotionContent.css'

/* "What We Do" — v6, the "award-site" register. The previous three
   pages (a field log, a capability-statement ledger, and before those
   a photo accordion / a site-plan / a bento grid / a radial diagram)
   were all static layouts with a light hover reaction at most. This one
   is built the way an actual Awwwards-tier site is built: the page
   itself moves — a cursor-following spotlight, a custom cursor, a
   kinetic split-text headline, a scroll-linked progress rail, a
   running marquee, and five chapters that pin and stack as you scroll
   through them — using framer-motion (already a project dependency,
   see TestimonialsSection) rather than a new library.

   Every motion value driving 60fps interaction (the cursor position,
   the spotlight) goes through useMotionValue/useSpring, never React
   state — so none of it re-renders the component on every mousemove,
   which is what makes it actually smooth instead of janky. prefers-
   reduced-motion is honored throughout via framer's own
   useReducedMotion() — the same hook this codebase already uses in
   TestimonialsSection — rather than hand-rolled matchMedia effects. */

interface Chapter {
  code: string
  title: string
  desc: string
  value: number
  image: string
}

const chapters: Chapter[] = [
  {
    code: '01',
    title: 'Land Aggregation',
    desc: 'Research-led acquisition across appraised, title-clear parcels.',
    value: 58.4,
    image: '/tp/tp-land-aggregation.jpg',
  },
  {
    code: '02',
    title: 'Residential Development',
    desc: 'Community-scale housing delivered end to end, on schedule.',
    value: 46.1,
    image: '/tp/tp-residential.jpg',
  },
  {
    code: '03',
    title: 'Hospitality Management',
    desc: 'Trained operating teams running hospitality assets in-house.',
    value: 32.7,
    image: '/tp/tp-hospitality-facade.jpg',
  },
  {
    code: '04',
    title: 'Commercial Projects',
    desc: 'Transparent execution — price, permits, schedule, documentation.',
    value: 38.9,
    image: '/tp/tp-commercial.jpg',
  },
  {
    code: '05',
    title: 'Supply Chain Management',
    desc: 'Vertically integrated procurement and materials logistics.',
    value: 35.3,
    image: '/tp/tp-supply-chain.jpg',
  },
]

const HERO_WORDS = ['Five', 'disciplines.', 'One', 'vision.']

// ---- custom cursor: a lagging ring driven entirely by motion values,
// never React state, so 60fps mousemove never triggers a re-render.
// CSS alone hides it on touch/coarse-pointer devices — see the .css. ----
const CustomCursor = () => {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 })
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return <motion.div className="km__cursor" style={{ x: springX, y: springY }} aria-hidden="true" />
}

// ---- mouse-follow spotlight glow behind the hero headline ----
const Spotlight = () => {
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, rgba(169, 120, 46, 0.16), transparent 72%)`

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return <motion.div className="km__spotlight" style={{ background }} aria-hidden="true" />
}

// Counts a chapter's own figure up from 0 once it's on screen — reused
// pattern from the ledger version (/what-we-do2), duplicated locally
// rather than shared since it's a small, self-contained hook.
function useCountUp(target: number, active: boolean, reduce: boolean, durationMs = 1300) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    const duration = reduce ? 1 : durationMs
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, durationMs, reduce])
  return value
}

const ChapterStat = ({ value, reduce }: { value: number; reduce: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(value, active, reduce)
  return (
    <span ref={ref} className="km__chapter-stat">
      {count.toFixed(1)}
      <span className="km__chapter-unit">M sq.ft</span>
    </span>
  )
}

// ---- one full-height, sticky-pinned chapter — the next chapter scrolls
// up and stacks over it rather than a plain scroll-past, the "cards
// stacking" effect several award-site scrollytelling pages use. Its own
// parallax/reveal is driven by its own scroll progress, not the page's. ----
const ChapterSection = ({ chapter, index }: { chapter: Chapter; index: number }) => {
  const ref = useRef<HTMLElement>(null)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%'])
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.36, 0.12])
  const stackScale = useTransform(scrollYProgress, [0.55, 1], reduce ? [1, 1] : [1, 0.94])
  const stackDim = useTransform(scrollYProgress, [0.55, 1], [1, 0.5])

  return (
    <section
      ref={ref}
      className="km__chapter"
      aria-label={chapter.title}
      style={{ zIndex: index + 1 }}
    >
      <motion.div className="km__chapter-stack" style={{ scale: stackScale, opacity: stackDim }}>
        <div className="km__chapter-bg">
          <motion.img src={chapter.image} alt="" style={{ y: imgY }} loading="lazy" />
          <span className="km__chapter-scrim" aria-hidden="true" />
        </div>

        <motion.span className="km__chapter-ghost" style={{ opacity: ghostOpacity }} aria-hidden="true">
          {chapter.code}
        </motion.span>

        <motion.div
          className="km__chapter-body"
          initial={reduce ? false : { opacity: 0, y: 60, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="km__chapter-code">{chapter.code} / 05</span>
          <h2 className="km__chapter-title">{chapter.title}</h2>
          <p className="km__chapter-desc">{chapter.desc}</p>
          <ChapterStat value={chapter.value} reduce={reduce} />
        </motion.div>
      </motion.div>
    </section>
  )
}

const HeroHeadline = () => {
  const reduce = useReducedMotion()
  return (
    <h1 className="km__hero-title">
      {HERO_WORDS.map((word, i) => (
        <motion.span
          key={word}
          className="km__hero-word"
          initial={reduce ? false : { opacity: 0, y: 46, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.15 + i * 0.11, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
          {' '}
        </motion.span>
      ))}
    </h1>
  )
}

// ---- continuous marquee strip between the hero and the chapters —
// pure CSS keyframe loop (two duplicated sets translating by exactly
// -50%), paused entirely under reduced motion. ----
const Marquee = () => (
  <div className="km__marquee" aria-hidden="true">
    <div className="km__marquee-track">
      {[0, 1].map((rep) => (
        <span className="km__marquee-set" key={rep}>
          {chapters.map((c) => (
            <span className="km__marquee-item" key={c.title}>
              {c.title}
              <span className="km__marquee-dot" />
            </span>
          ))}
        </span>
      ))}
    </div>
  </div>
)

const WhatWeDoMotionContent = () => {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()

  return (
    // data-header-theme="light" — this page is bright/cream now, so the
    // header needs its ivory-bar variant (dark ink nav text); that bar
    // carries its own opaque-ish backing regardless of what photo is
    // behind it at any given scroll position, so this stays safe even
    // over the chapters' imagery further down.
    <main className="km" data-header-theme="light">
      {!reduce && <CustomCursor />}
      <motion.div className="km__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <section className="km__hero">
        {!reduce && <Spotlight />}
        <p className="km__hero-eyebrow">What We Do</p>
        <HeroHeadline />
        <p className="km__hero-sub">
          Scroll to walk through the five disciplines behind every address we build.
        </p>
        <span className="km__hero-scroll" aria-hidden="true">
          Scroll
        </span>
      </section>

      <Marquee />

      {chapters.map((c, i) => (
        <ChapterSection key={c.title} chapter={c} index={i} />
      ))}

      <Marquee />
    </main>
  )
}

export default WhatWeDoMotionContent
