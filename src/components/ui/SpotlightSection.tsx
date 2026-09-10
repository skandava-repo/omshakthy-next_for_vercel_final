'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './SpotlightSection.css'

/* ============================================================
   SpotlightSection — "Omshakthy in Spotlight" / "Life at Omshakthy"

   Same bento-grid system as GalleryContent (three tile sizes spanning
   different col/row counts on a 6-col track, grid-auto-flow: dense, no
   overlap). Sized to fit one PageController 100vh slide instead of a
   normal scrolling page.

   Each tile cycles through 5 images with its own switch interval (see
   `switchMs` per tile below) and a slow crossfade — cards change at
   different paces rather than all switching in lockstep.
   ============================================================ */

const tiles = [
  {
    key: 'events',
    label: 'Events',
    caption: 'Moments from the ground — launches, drives and celebrations.',
    switchMs: 3000,
    images: [
      '/spotlight/events.jpg',
      '/spotlight/events-2.jpg',
      '/spotlight/events-3.jpg',
      '/spotlight/events-4.jpg',
      '/spotlight/events-5.jpg',
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    caption: 'A visual archive of our projects, people and milestones.',
    switchMs: 2000,
    // Reuses the same hero/property photos as the /gallery page bento grid.
    images: [
      '/hero-new-1.jpg',
      '/hero-slide-4.png',
      '/hero-slide-88.png',
      '/hero-slide-9.png',
      '/canopus-magha.png',
    ],
  },
  {
    key: 'awards',
    label: 'Awards',
    caption: 'Recognitions that mark our journey of trust.',
    switchMs: 4000,
    images: [
      '/spotlight/awards.jpg',
      '/spotlight/awards-2.jpg',
      '/spotlight/awards-3.jpg',
      '/spotlight/awards-4.jpg',
      '/spotlight/awards-5.jpg',
    ],
  },
  {
    key: 'buzz',
    label: 'Latest Buzz',
    caption: 'What people are saying about us, right now.',
    switchMs: 2000,
    images: [
      '/spotlight/buzz.jpg',
      '/spotlight/buzz-2.jpg',
      '/spotlight/buzz-3.jpg',
      '/spotlight/buzz-4.jpg',
      '/spotlight/buzz-5.jpg',
    ],
  },
  {
    key: 'newsletter',
    label: 'News Letter',
    caption: 'Stay in the loop with our latest updates and offers.',
    switchMs: 5000,
    images: [
      '/spotlight/newsletter.jpg',
      '/spotlight/newsletter-2.jpg',
      '/spotlight/newsletter-3.jpg',
      '/spotlight/newsletter-4.jpg',
      '/spotlight/newsletter-5.jpg',
    ],
  },
] as const

const EASE = [0.16, 1, 0.3, 1] as const

// Fisher-Yates shuffle — used once per tile so the cycle order isn't the
// fixed 1→2→3→4→5 sequence.
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// One tile's own image cycler — each tile runs on its own switchMs interval
// (set per-tile in the data above), so the 5 cards change at different
// paces instead of a single shared timer.
const TileImage = ({
  images,
  switchMs,
}: {
  images: readonly string[]
  switchMs: number
}) => {
  // Start with the un-shuffled order so server and client render the same
  // first image — Math.random() during render would produce a different
  // shuffle on each side and cause a hydration mismatch. Shuffle only
  // after mount, once hydration has already settled.
  const [order, setOrder] = useState<readonly string[]>(images)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setOrder(shuffle(images))
  }, [images])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % order.length)
    }, switchMs)

    return () => clearInterval(interval)
  }, [order.length, switchMs])

  return (
    <AnimatePresence mode="sync">
      <motion.img
        key={order[index]}
        src={order[index]}
        alt=""
        loading="lazy"
        className="sl__tile-img"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
    </AnimatePresence>
  )
}

const SpotlightSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const built = useSectionEnter(sectionRef, 150)

  // No data-header-theme — dropped the "light" paper scrim (same fix
  // as LeadersSection/WhatWeDoCloneContent/FinancialPartnersSection) so
  // the header shows the same dark gradient bar as Hero instead of a
  // mismatched light one.
  return (
    <section ref={sectionRef} className="sl" aria-label="Omshakthy in Spotlight">
      <div className="sl__inner">
        <header className="sl__header">
          <span className="sl__eyebrow">Omshakthy in Spotlight</span>
          <motion.h2
            className="sl__title"
            initial={{ opacity: 0, y: 24 }}
            animate={built ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Life at <em>Omshakthy</em>
          </motion.h2>
        </header>

        <div className="sl__grid">
          {tiles.map((t, i) => (
            <motion.a
              className={`sl__tile sl__tile--${t.key}`}
              key={t.key}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              animate={built ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.08 }}
            >
              <TileImage images={t.images} switchMs={t.switchMs} />
              <span className="sl__tile-shade" />
              <span className="sl__tile-label">{t.label}</span>
              <p className="sl__tile-caption">{t.caption}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpotlightSection

