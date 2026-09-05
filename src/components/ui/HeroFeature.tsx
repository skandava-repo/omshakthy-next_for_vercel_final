'use client'

/* ============================================================================
   HeroFeature — Leadership.

   Built on the ACES `x-hero-feature` card anatomy (acesawards_mirror), with the
   IX2 hover choreography from webflow.schunk.912b803387c574a8.js preserved
   (actionLists "a-3" / "a-4").

   Layout is a bento grid sized to each asset's native aspect ratio:

     ┌────────────────┬──────────────────────────────┐
     │                │  MANIGANTAN  (1.25 landscape)│
     │  RAMACHANDRAN  ├──────────────┬───────────────┤
     │  (0.71 portrait)│  Hota (1:1) │  Shakthi      │
     └────────────────┴──────────────┴───────────────┘

   Every card shows all of its content at rest — name, role, a JetBrains Mono
   data line and the full bio. Two non-overlapping zones: a text column on the
   left, the figure on the right, so copy never sits on a photograph. The card
   gradient runs dark-left to light-right so the text column always has a dark
   ground and the figure always has a light one.
   ========================================================================== */

import { useRef } from 'react'
import Link from 'next/link'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './HeroFeature.css'

const LAUREL = '/leaders/emblem.png'
const PROFILE_HREF = '/about'

interface Leader {
  name: string
  role: string
  /** JetBrains Mono specificity line — Brand p.08/p.09 "Numbers matter". */
  data: string
  image: string | null
  /** Bullet bio, revealed on hover. */
  points?: string[]
  /** Prose bio, revealed on hover. */
  prose?: string
  /** Grid cell + per-asset figure framing. */
  cell: 'founder' | 'md' | 'ed1' | 'ed2'
  figure?: { width?: string; height?: string; bottom?: string }
  /* Opt in to shape-outside text wrapping around the cut-out silhouette.
     `w`/`h` size the floated spacer to match the rendered image box. */
  shape?: { src: string; w: string; h: string }
}

const leaders: Leader[] = [
  {
    cell: 'founder',
    name: 'R. Ramachanthran',
    role: 'Founder',
    data: 'EST. 1991 · 30+ YEARS',
    image: '/leaders/founder-cutout.png',
    // 1060x1484 portrait — tall card, figure carries most of the width.
    figure: { width: '66%', height: '108%', bottom: '-5%' },
    shape: { src: '/leaders/founder-cutout.png', w: '62%', h: '100%' },
    points: [
      'Founded OmShakthy Agencies (Madras) Pvt Ltd in the year 1991',
      'The group went on to become the preferred land aggregator for corporates & State Government',
      'Over 3 decades of experience in the Real Estate, Construction and Hospitality industries',
    ],
  },
  {
    cell: 'md',
    name: 'N R Manigantan',
    role: 'Managing Director',
    data: '20+ YEARS · ₹2,500CR → ₹5,000CR',
    image: '/leaders/md-cutout.png',
    // 558x447 landscape — wide card, figure sits right of the content column.
    figure: { width: '48%', height: '120%', bottom: '-8%' },
    points: [
      'More than 2 decades of experience in Real Estate & Construction',
      'Extensive knowledge in land acquisition & agglomeration',
      'Aiming to take OmShakthy from a ₹2,500 Crore to a ₹5,000 Crore group',
    ],
  },
  {
    cell: 'ed1',
    name: 'Rajib Kumar Hota',
    role: 'Executive Director',
    data: 'BAR COUNCIL · LIBA',
    image: '/leaders/hota-avatar.png',
    // 232x232 square, already circle-masked — an inset avatar, not a cut-out.
    figure: { width: '34%', height: '64%', bottom: '16%' },
    prose:
      'An eloquent speaker and voracious reader. An Independent Director on several Boards, with a passion for social service and education.'.replace(/\s+/g, ' '),
  },
  {
    cell: 'ed2',
    name: 'Shakthy',
    role: 'Executive Director',
    data: 'TDB',
    image: null,
  },
]

/* Brand p.09 — iconography is 1.3pt stroke on a 24x24 grid, rounded ends,
   mono, never filled. Stroke styling lives in HeroFeature.css. */
function RoleMark() {
  return (
    <svg className="x-heading__flag" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L4.4 9.9 10.4 9z" />
    </svg>
  )
}

/* Mirrors `.x-id-feature__link` — the portrait plus the laurel watermark. */
function Portrait({ leader }: { leader: Leader }) {
  const style = leader.figure
    ? ({
        '--xf-fig-w': leader.figure.width,
        '--xf-fig-h': leader.figure.height,
        '--xf-fig-b': leader.figure.bottom,
      } as React.CSSProperties)
    : undefined

  return (
    <Link href={PROFILE_HREF} className="x-id-feature__link" aria-label={leader.name}>
      {leader.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={leader.image}
          alt={leader.name}
          loading="lazy"
          className="x-id-feature__thumb"
          style={style}
        />
      ) : (
        <span className="x-id-feature__placeholder" aria-hidden="true">
          <span className="x-id-feature__placeholder-mark">+</span>
          <span className="x-id-feature__placeholder-text">To be announced</span>
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LAUREL} alt="" aria-hidden="true" className="x-id-feature__laurel" />
    </Link>
  )
}

/* Bio — always visible, in flow beneath the meta. No hover reveal, no button. */
function Bio({ leader }: { leader: Leader }) {
  if (leader.points) {
    return (
      <ul className="xhf-bio">
        {leader.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    )
  }
  if (leader.prose) return <p className="xhf-bio xhf-bio--prose">{leader.prose}</p>
  return null
}

/* Mini content — always visible, so the card still reads on touch. */
function Info({ leader, big }: { leader: Leader; big: boolean }) {
  const Name = big ? 'h3' : 'h4'
  return (
    <div className="x-id-feature__info">
      {leader.shape && (
        <span
          className="xhf-shape"
          aria-hidden="true"
          style={
            {
              '--xf-shape': `url(${leader.shape.src})`,
              '--xf-shape-w': leader.shape.w,
              '--xf-shape-h': leader.shape.h,
            } as React.CSSProperties
          }
        />
      )}
      <div className="x-heading-container">
        <Name className={big ? 'x-vlarge__label for-duo' : 'x-large__label for-sm'}>
          {leader.name}
        </Name>
      </div>
      <div className="x-award-pin__flex">
        <RoleMark />
        <span className="x-pos__text">{leader.role}</span>
      </div>
      <span className="x-id-feature__data">{leader.data}</span>
      <span className="xhf-rule" aria-hidden="true" />
      <Bio leader={leader} />
    </div>
  )
}

export default function HeroFeature() {
  const ref = useRef<HTMLElement>(null)
  // Plays once, when the pager lands on this slide. Drives the CSS below.
  const entered = useSectionEnter(ref)

  return (
    <section
      ref={ref}
      className={`xhf${entered ? ' is-entered' : ''}`}
      aria-label="Our leadership"
    >
      <div className="xhf__wrapper">
        <header className="xhf__header">
          <span className="xhf__eyebrow">Our Leadership</span>
          <h2 className="xhf__title">The People Behind the Promise</h2>
        </header>

        <div className="x-hero-feature">
          <div className="x-hero-cover__block">
            {leaders.map((leader) => {
              const big = leader.cell === 'founder' || leader.cell === 'md'
              return (
                <div
                  key={leader.name}
                  className={`x-id-feature__item xhf-cell--${leader.cell}${
                    big ? ' for-prime' : ''
                  }${leader.shape ? ' has-shape' : ''}`}
                >
                  <Info leader={leader} big={big} />
                  <Portrait leader={leader} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
