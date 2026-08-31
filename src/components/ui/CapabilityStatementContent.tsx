'use client'
import { useEffect, useRef, useState } from 'react'
import './CapabilityStatementContent.css'

/* "What We Do" — a second, more formal read of the same content, living
   at /what-we-do2 alongside the field-log version rather than replacing
   it. That version (/what-we-do) is a deliberately handmade aesthetic —
   Polaroids, a red-pen circle, a rubber stamp — which reads right for
   some brands but was called childish for a three-decade real estate
   group. This is the same five disciplines read as an actual
   capability statement: the page a serious developer's annual report
   or investor deck has. No tiles, no cards, no hover-widening panels —
   a single ledger of five lines, each backed by a real animated data
   bar and a counting figure. The credibility move here is that the
   numbers are legible, aligned and precise, not that the page has
   novelty chrome — the innovation is in the data being genuinely live
   (a real bar, a real count) rather than another arrangement of boxes. */

interface Row {
  code: string
  title: string
  desc: string
  value: number // millions of sq. ft. — drives the bar width for real,
  // not a decorative "weight" invented purely for layout.
  image: string
}

const rows: Row[] = [
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

const MAX = Math.max(...rows.map((r) => r.value))

// Counts a row's own figure up from 0 once it's actually on screen, not
// on page load — a static "58.4M" reads as a label, a number that
// visibly arrives reads as a measurement being reported.
function useCountUp(target: number, active: boolean, durationMs = 1300) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    // Under reduced motion, collapse the whole animation to effectively
    // one frame — the setState still happens inside the rAF callback
    // (not synchronously in the effect body), it just lands on the
    // target immediately instead of easing there over time.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  }, [active, target, durationMs])
  return value
}

const StatementRow = ({ row, index }: { row: Row; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)

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

  const count = useCountUp(row.value, active)
  const pct = (row.value / MAX) * 100

  return (
    <div
      ref={ref}
      className={`cs__row${active ? ' is-in' : ''}${hover ? ' is-hover' : ''}`}
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Large outlined numeral bleeding out behind the photo swatch —
          same ghost-numeral device .tp already established on this
          site, reused rather than invented, layered with a real photo
          rather than left to float alone in empty space. */}
      <span className="cs__row-visual">
        <span className="cs__row-ghost" aria-hidden="true">{row.code}</span>
        <span className="cs__row-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={row.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
        </span>
      </span>
      <span className="cs__row-main">
        <span className="cs__row-code">{row.code}</span>
        <span className="cs__row-title">{row.title}</span>
        <span className="cs__row-desc">{row.desc}</span>
      </span>
      <span className="cs__row-data">
        <span className="cs__row-bar-track" aria-hidden="true">
          <span className="cs__row-bar-fill" style={{ width: active ? `${pct}%` : '0%' }} />
        </span>
        <span className="cs__row-num">
          {count.toFixed(1)}
          <span className="cs__row-unit">M sq.ft</span>
        </span>
      </span>
    </div>
  )
}

const CapabilityStatementContent = () => {
  return (
    // data-header-theme="light" — this page is bright/cream now, so the
    // header needs its ivory-bar variant (dark ink nav text) rather than
    // the default white-on-dark treatment, same as PriceTrends/TrustedPartners.
    <main className="cs" data-header-theme="light">
      <div className="cs__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tp/tp-overall.jpg" alt="" />
        <span className="cs__bg-scrim" />
      </div>

      <div className="cs__inner">
        <header className="cs__intro">
          <p className="cs__eyebrow">Capability Statement</p>
          <h1 className="cs__title">
            One group.
            <br />
            Five disciplines,
            <br />
            <em>built in-house.</em>
          </h1>
          <p className="cs__lede">
            Three decades of operating history, read the way it appears in our own reporting — not
            as services on a shelf, but as one integrated pipeline from land to keys.
          </p>

          <div className="cs__hero-stat">
            <span className="cs__hero-num">30+</span>
            <span className="cs__hero-label">
              Years in operation
              <br />
              Est. 1991, Chennai
            </span>
          </div>
        </header>

        <div className="cs__ledger">
          {rows.map((row, i) => (
            <StatementRow key={row.title} row={row} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default CapabilityStatementContent
