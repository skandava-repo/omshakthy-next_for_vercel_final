'use client'
import './WhatWeDoCloneContent.css'

/* "What We Do" — v10, a direct, deliberate clone of a supplied reference
   comp (a "Capability Statement" layout: cream two-column page, an
   ornate stat card on the left, five icon+photo+copy rows on the
   right). This file is NOT an original design pass like every other
   version here — it exists to match that reference as closely as code
   can reproduce it: same copy, same layout proportions, same palette,
   same iconography, same decorative details (corner-bracketed stat
   card, ghosted skyline watermark, lotus glyphs, skewed photo cards,
   gold arrows). The one thing that can't be reproduced exactly is the
   reference's own photography and background illustration — those are
   specific AI-generated images this project doesn't have the source
   files for — so real site photography (the same five discipline shots
   used elsewhere on this site) stands in for them, laid out and clipped
   the same way the reference's photos are. */

const RowIcons = {
  map: () => (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 9l7-3 6 3 7-3v17l-7 3-6-3-7 3Z" />
      <path d="M13 6v17M19 9v17" />
      <circle cx="16" cy="15" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  buildings: () => (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 26V12l5-3 5 3v14" />
      <path d="M16 26V8l5-3 5 3v18" />
      <path d="M9 16h.01M9 20h.01M19 12h.01M19 16h.01M19 20h.01" />
    </svg>
  ),
  hospitality: () => (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 22c0-5.5 4.5-10 10-10s10 4.5 10 10" />
      <path d="M4 22h24" />
      <path d="M16 12V8" />
    </svg>
  ),
  briefcase: () => (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="5" y="12" width="22" height="14" rx="1.5" />
      <path d="M12 12V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M5 18h22" />
    </svg>
  ),
  truck: () => (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 10h13v11H4z" />
      <path d="M17 15h6l4 4v2h-10z" />
      <circle cx="10" cy="23" r="2" />
      <circle cx="22" cy="23" r="2" />
    </svg>
  ),
}

interface Row {
  code: string
  title: string
  desc: string
  image: string
  icon: keyof typeof RowIcons
}

const rows: Row[] = [
  {
    code: '01',
    title: 'Land Aggregation',
    desc: 'Research-led acquisition across appraised, title-clear parcels.',
    image: '/tp/tp-land-aggregation.jpg',
    icon: 'map',
  },
  {
    code: '02',
    title: 'Residential Development',
    desc: 'Community-scale housing delivered end to end, on schedule.',
    image: '/tp/tp-residential.jpg',
    icon: 'buildings',
  },
  {
    code: '03',
    title: 'Hospitality Management',
    desc: 'Trained operating teams running hospitality assets in-house.',
    image: '/tp/tp-hospitality-facade.jpg',
    icon: 'hospitality',
  },
  {
    code: '04',
    title: 'Commercial Projects',
    desc: 'Transparent execution — price, permits, schedule, documentation.',
    image: '/tp/tp-commercial.jpg',
    icon: 'briefcase',
  },
  {
    code: '05',
    title: 'Supply Chain Management',
    desc: 'Vertically integrated procurement and materials logistics.',
    image: '/tp/tp-supply-chain.jpg',
    icon: 'truck',
  },
]

const WhatWeDoCloneContent = () => {
  return (
    // Was <main> — this component is used both as a standalone page's
    // whole body (/what-we-do) and, now, as one section embedded inside
    // the home page's own <main> (HomeClient.tsx already has one); a
    // nested <main> would be invalid there. <section> here, matching the
    // convention every other normal-flow home section already uses
    // (FinancialPartnersSection, SpotlightSection: <section
    // aria-label="..." data-header-theme="light">) — the standalone page
    // now supplies its own <main> wrapper instead (see what-we-do/page.tsx).
    <section className="wc" aria-label="What we do" data-header-theme="light">
      <div className="wc__body">
        <section className="wc__left">
          <p className="wc__eyebrow">
            What    We    Do
            <span className="wc__eyebrow-line" />
          </p>

          <h1 className="wc__title">
            <span className="wc__title-line">One group.</span>
            <span className="wc__title-line">Five disciplines,</span>
            <span className="wc__title-line wc__title-line--accent">built in-house.</span>
          </h1>

          <p className="wc__para">
            Three decades of operating history, read the way it appears in our own reporting — not
            as services on a shelf, but as one integrated pipeline from land to keys.
          </p>

          <div className="wc__card">
            <p className="wc__card-est">Est. 1991, Chennai</p>
            <p className="wc__card-num">
              30<span className="wc__card-plus">+</span>
            </p>
            <p className="wc__card-label">Years in Operation</p>
          </div>
        </section>

        {/* Same dot–line–dot divider motif as LeadersSection's
            .ld3__tagline (minus its text), rotated vertical here to
            actually separate the two columns instead of leaving a plain
            empty gutter. */}
        <div className="wc__divider">
          <span className="wc__divider-dot" aria-hidden="true" />
          <span className="wc__divider-line" aria-hidden="true" />
          <span className="wc__divider-dot" aria-hidden="true" />
        </div>

        <section className="wc__right">
          {rows.map((row) => {
            const Icon = RowIcons[row.icon]
            return (
              <article className="wc__row" key={row.title}>
                <span className="wc__row-icon">
                  <Icon />
                </span>

                <span className="wc__row-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.image} alt={row.title} loading="lazy" />
                </span>

                <span className="wc__row-text">
                  <span className="wc__row-title">{row.title}</span>
                  <span className="wc__row-tick" />
                  <span className="wc__row-desc">{row.desc}</span>
                </span>
              </article>
            )
          })}
        </section>
      </div>
    </section>
  )
}

export default WhatWeDoCloneContent
