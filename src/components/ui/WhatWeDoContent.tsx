'use client'
import { useEffect, useRef, useState } from 'react'
import './WhatWeDoContent.css'

/* "What We Do" — v4, a structurally different rebuild, not another skin
   on the same idea. The last three attempts (a radial tech diagram, a
   bento card grid, a site-plan of hover-widening tiles) were all the
   same pattern underneath: N interchangeable boxes arranged in space
   that the visitor picks between. Every one of them got called generic
   because "arrange 5 boxes" IS the generic web pattern, no matter what
   skin sits on top of it.

   This is a field log instead: a single continuous document you read
   down the page, not a set of tiles you pick between — the 5
   disciplines as five dated field-note entries, each with a taped-in
   Polaroid of the real work (same photography used elsewhere on this
   site) and a stat circled by hand in red pen, the way a site
   inspector's actual notebook looks. Warm cream paper, not another dark
   navy tech panel (every previous attempt used that same palette —
   this one doesn't). Nothing is interactive/hover-gated; entries simply
   reveal as they scroll into view, because a document is read, not
   operated. */

interface Entry {
  code: string
  title: string
  ref: string
  desc: string
  stat: string
  image: string
}

const entries: Entry[] = [
  {
    code: '01',
    title: 'Land Aggregation',
    ref: 'REF. OSH/LA — SURVEYED',
    desc: 'Immense knowledge of land and its value, sound research and extended expertise in the realms of real estate properties.',
    stat: '58.4M sq.ft',
    image: '/tp/tp-land-aggregation.jpg',
  },
  {
    code: '02',
    title: 'Residential Development',
    ref: 'REF. OSH/RD — LOGGED',
    desc: 'Utmost care in revitalization efforts to improve community life across all residential projects that are undertaken.',
    stat: '46.1M sq.ft',
    image: '/tp/tp-residential.jpg',
  },
  {
    code: '03',
    title: 'Hospitality Management',
    ref: 'REF. OSH/HM — LOGGED',
    desc: 'Qualified and well trained individuals that provide quick and relevant solutions for all forms of support services.',
    stat: '32.7M sq.ft',
    image: '/tp/tp-hospitality-facade.jpg',
  },
  {
    code: '04',
    title: 'Commercial Projects',
    ref: 'REF. OSH/CP — LOGGED',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    stat: '38.9M sq.ft',
    image: '/tp/tp-commercial.jpg',
  },
  {
    code: '05',
    title: 'Supply Chain Management',
    ref: 'REF. OSH/SC — LOGGED',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    stat: '35.3M sq.ft',
    image: '/tp/tp-supply-chain.jpg',
  },
]

// A single hand-drawn ellipse path, stretched non-uniformly per stat box
// via preserveAspectRatio="none" — a real ellipse read as too digital/
// perfect over a typed number, this wobble is what makes it read as a
// pen mark instead of a border-radius.
const HandCircle = () => (
  <svg className="fl__stat-circle" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
    <path d="M12,46 C8,19 42,4 101,6 C167,8 196,24 191,49 C187,74 149,86 97,85 C40,84 16,70 12,46 Z" />
  </svg>
)

const WhatWeDoContent = () => {
  const [visible, setVisible] = useState<Set<number>>(new Set())
  const entryRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // No prefers-reduced-motion branch needed here — the CSS itself
    // already forces .fl__entry to opacity:1/no-transform unconditionally
    // under that media query (see the .css), so the observer can just run
    // as normal; it has nothing visible left to gate in that case.
    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((item) => {
          if (!item.isIntersecting) return
          const idx = Number((item.target as HTMLElement).dataset.idx)
          setVisible((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)))
        })
      },
      { threshold: 0.22 }
    )
    entryRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="fl" data-header-theme="light">
      <span className="fl__holes" aria-hidden="true" />

      <header className="fl__head">
        <p className="fl__eyebrow">Field Log · Five Entries</p>
        <h1 className="fl__title">What We Do</h1>
        <p className="fl__sub">
          Five entries from three decades on site, logged in the order they actually happen on the ground.
        </p>
      </header>

      <div className="fl__entries">
        {entries.map((e, i) => (
          <article
            key={e.title}
            ref={(el) => {
              entryRefs.current[i] = el
            }}
            data-idx={i}
            className={`fl__entry${visible.has(i) ? ' is-in' : ''}`}
          >
            <div className="fl__photo">
              <span className="fl__tape" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.image} alt={e.title} loading={i === 0 ? 'eager' : 'lazy'} />
            </div>

            <div className="fl__text">
              <span className="fl__stamp">
                Field Note
                <br />
                {e.code} / 05
              </span>
              <h3 className="fl__entry-title">{e.title}</h3>
              <p className="fl__entry-ref">{e.ref}</p>
              <p className="fl__entry-desc">{e.desc}</p>
              <span className="fl__stat">
                <HandCircle />
                <span className="fl__stat-num">{e.stat}</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default WhatWeDoContent
