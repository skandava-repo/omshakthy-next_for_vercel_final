'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import './WhatWeDoEssayContent.css'

/* "What We Do" — v8, built from the design conversation before it, not
   from another structural gimmick. Every earlier attempt (a diagram, an
   accordion, a notebook, a ledger, a heavy-motion showcase, a drawn
   skyline) optimized for "what's a clever container/technique" —
   which is exactly why each one read as impressive-but-off rather than
   right for a three-decade property developer. The brief that actually
   matters here: this is an institution, not a startup: real photography
   of real work carries the weight, not illustration or metaphor;
   confidence reads as restraint, not density of tricks; and image and
   text each get their own uncluttered space rather than fighting for
   the same pixels under a scrim.

   So this is a slow photo essay: one full-bleed hero, a quiet editorial
   mission statement in pure typography, then five chapters — each a
   large real photograph on its own, followed immediately by its own
   caption band (index, title, description, one real figure) laid out
   like a magazine's caption/credits line, not overlaid on the image.
   Motion is limited to one register throughout — a soft rise-and-fade
   on scroll, a subtle parallax on the photos — no cursor, no marquee,
   no ghost-numeral spectacle, no diagram. Repetition across the five
   chapters is deliberate, not a missed opportunity for variation: a
   calm, consistent rhythm is itself what confidence looks like here. */

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

const ChapterSection = ({ chapter }: { chapter: Chapter }) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%'])

  return (
    <article className="we__chapter">
      <div ref={ref} className="we__chapter-photo">
        <motion.img src={chapter.image} alt={chapter.title} style={{ y: imgY }} loading="lazy" />
      </div>

      <motion.div
        className="we__chapter-caption"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="we__chapter-index">{chapter.code}</span>
        <h2 className="we__chapter-title">{chapter.title}</h2>
        <div className="we__chapter-meta">
          <p className="we__chapter-desc">{chapter.desc}</p>
          <span className="we__chapter-stat">{chapter.stat}</span>
        </div>
      </motion.div>
    </article>
  )
}

const WhatWeDoEssayContent = () => {
  const reduce = !!useReducedMotion()

  return (
    <main className="we" data-header-theme="light">
      <section className="we__hero">
        <motion.div
          className="we__hero-photo"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tp/tp-overall.jpg" alt="An OmShakthy site" />
          <span className="we__hero-scrim" aria-hidden="true" />
        </motion.div>

        <motion.div
          className="we__hero-body"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="we__hero-eyebrow">OmShakthy Homes · Est. 1991</p>
          <h1 className="we__hero-title">Land to keys, in five disciplines.</h1>
        </motion.div>
      </section>

      <section className="we__mission">
        <p className="we__mission-text">
          We don&apos;t think of what we do as five separate services. It&apos;s one pipeline — we
          aggregate the land, build on it, run what we build, and manage everything it takes to
          get there on schedule. What follows is that pipeline, in the order it actually happens
          on the ground.
        </p>
      </section>

      <div className="we__chapters">
        {chapters.map((chapter) => (
          <ChapterSection key={chapter.title} chapter={chapter} />
        ))}
      </div>

      <section className="we__close">
        <p className="we__close-text">
          One site, five disciplines, thirty years — this is what it looks like end to end.
        </p>
      </section>
    </main>
  )
}

export default WhatWeDoEssayContent
