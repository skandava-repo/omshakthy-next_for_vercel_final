'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import './SiteReelContent.css'

/* "What We Do" — v9, the previous version's sense (real photography
   carries the page, image and text never share pixels, restraint over
   trick-density) plus the one thing it was missing: something that
   actually feels alive under your hand, not five photographs sitting
   still one after another.

   The centerpiece here is one pinned frame you scrub through by
   scrolling — the five disciplines' real photographs cross-dissolve
   into one another inside that single frame, like scrubbing a
   time-lapse of one site being built, with the caption bar beneath it
   changing in sync. It's the same "one continuous thing, not five
   separate items" idea v7's hand-drawn skyline was reaching for, done
   with actual photography instead of an illustration this time — which
   is also what makes it feel like footage of real work rather than an
   explainer graphic. Five small ticks along the frame double as both a
   progress affordance and the only "decoration" on screen — everything
   else is the photograph and the caption, nothing else competing for
   attention. Built on framer-motion's scroll-linked opacity crossfades
   (already a project dependency), gated by useReducedMotion() the same
   way every other page here is. */

interface Chapter {
  code: string
  title: string
  desc: string
  stat: string
  image: string
}

const chapters: Chapter[] = [
  {
    code: '01',
    title: 'Land Aggregation',
    desc: 'Research-led acquisition across appraised, title-clear parcels.',
    stat: '58.4M sq.ft assembled',
    image: '/tp/tp-land-aggregation.jpg',
  },
  {
    code: '02',
    title: 'Residential Development',
    desc: 'Community-scale housing delivered end to end, on schedule.',
    stat: '46.1M sq.ft delivered',
    image: '/tp/tp-residential.jpg',
  },
  {
    code: '03',
    title: 'Hospitality Management',
    desc: 'Trained operating teams running hospitality assets in-house.',
    stat: '32.7M sq.ft managed',
    image: '/tp/tp-hospitality-facade.jpg',
  },
  {
    code: '04',
    title: 'Commercial Projects',
    desc: 'Transparent execution — price, permits, schedule, documentation.',
    stat: '38.9M sq.ft built',
    image: '/tp/tp-commercial.jpg',
  },
  {
    code: '05',
    title: 'Supply Chain Management',
    desc: 'Vertically integrated procurement and materials logistics.',
    stat: '35.3M sq.ft supplied',
    image: '/tp/tp-supply-chain.jpg',
  },
]

// Only ever mounted when reduced motion is off (see SiteReelContent
// below, which renders <StaticChapters/> instead otherwise) — so the
// crossfade ranges here don't need their own reduced-motion branch.
const Reel = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  // Five overlapping trapezoids across one 0→1 timeline: each stage
  // holds fully visible for a stretch, then cross-dissolves into the
  // next. Explicit per-stage ranges rather than a generated loop, so
  // each useTransform call stays unconditional (rules of hooks).
  const p0 = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0])
  const p1 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0])
  const p2 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0])
  const p3 = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0])
  const p4 = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1])
  const stages = [p0, p1, p2, p3, p4]

  return (
    <div className="sr__track" ref={trackRef}>
      <div className="sr__frame">
        <div className="sr__stage">
          {chapters.map((c, i) => (
            <motion.img
              key={c.title}
              src={c.image}
              alt={c.title}
              style={{ opacity: stages[i] }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Each tick is a static faint dot with an active-fill overlay
            bound directly to that stage's own already-computed motion
            value — no new transform created per item, so this stays
            safe to call from inside .map() (rules of hooks). */}
        <div className="sr__ticks" aria-hidden="true">
          {chapters.map((c, i) => (
            <span className="sr__tick" key={c.title}>
              <motion.span className="sr__tick-fill" style={{ opacity: stages[i] }} />
            </span>
          ))}
        </div>

        <div className="sr__caption">
          {chapters.map((c, i) => (
            <motion.div key={c.title} className="sr__caption-set" style={{ opacity: stages[i] }}>
              <span className="sr__caption-index">{c.code}</span>
              <h2 className="sr__caption-title">{c.title}</h2>
              <div className="sr__caption-meta">
                <p className="sr__caption-desc">{c.desc}</p>
                <span className="sr__caption-stat">{c.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Reduced-motion fallback: the pinned crossfade forces every visitor to
// scroll-scrub to see disciplines 2 through 5, which is fine as an
// enhancement but not as the only way to reach that content. Under
// prefers-reduced-motion this renders all five as a plain static stack
// instead — nobody loses content just because they've turned off motion.
const StaticChapters = () => (
  <div className="sr__static">
    {chapters.map((c) => (
      <article className="sr__static-chapter" key={c.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sr__static-photo" src={c.image} alt={c.title} loading="lazy" />
        <div className="sr__static-caption">
          <span className="sr__caption-index">{c.code}</span>
          <h2 className="sr__caption-title">{c.title}</h2>
          <div className="sr__caption-meta">
            <p className="sr__caption-desc">{c.desc}</p>
            <span className="sr__caption-stat">{c.stat}</span>
          </div>
        </div>
      </article>
    ))}
  </div>
)

const SiteReelContent = () => {
  const reduce = !!useReducedMotion()

  return (
    <main className="sr" data-header-theme="light">
      <section className="sr__hero">
        <motion.div
          className="sr__hero-photo"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tp/tp-overall.jpg" alt="An OmShakthy site" />
          <span className="sr__hero-scrim" aria-hidden="true" />
        </motion.div>

        <motion.div
          className="sr__hero-body"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="sr__hero-eyebrow">OmShakthy Homes · Est. 1991</p>
          <h1 className="sr__hero-title">Land to keys, in five disciplines.</h1>
        </motion.div>
      </section>

      <section className="sr__mission">
        <p className="sr__mission-text">
          We don&apos;t think of what we do as five separate services. It&apos;s one pipeline — we
          aggregate the land, build on it, run what we build, and manage everything it takes to
          get there on schedule. Scroll — the frame below is one site, moving through all five.
        </p>
      </section>

      {reduce ? <StaticChapters /> : <Reel />}

      <section className="sr__close">
        <p className="sr__close-text">
          One site, five disciplines, thirty years — this is what it looks like end to end.
        </p>
      </section>
    </main>
  )
}

export default SiteReelContent
