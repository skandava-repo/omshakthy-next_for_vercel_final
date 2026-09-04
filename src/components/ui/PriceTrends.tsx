'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './PriceTrends.css'

interface Series {
  name: string
  color: string
  yoy: string
  values: number[]
  note: string
}

const quarters = ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25"]
// Chart-specific accent trio — the previous mist/brass/cream set was three
// pale, similarly-lit tones that barely separated from each other or from
// the blue background. These three sit in genuinely different hue families
// (coral / gold / mint) so each line reads instantly at a glance, while
// staying warm and premium rather than a generic traffic-light palette.
// (Full section color revamp is a separate follow-up.)
const series: Series[] = [
  {
    name: 'TAMBRAM',
    color: '#E8916B',
    yoy: '+12.5%',
    values: [2100, 2250, 2380, 2500, 2600, 2690, 2750, 2800],
    note: 'Established southern-suburb demand keeps this corridor a steady, reliable long-term hold.',
  },
  {
    name: 'AVADI',
    color: '#E0B255',
    yoy: '+18.2%',
    values: [4200, 4480, 4700, 4900, 5100, 5260, 5390, 5500],
    note: 'Industrial-belt infrastructure upgrades are pushing this corridor into its strongest growth window yet.',
  },
  {
    name: 'GUDUVANCHERI',
    color: '#4FD8B0',
    yoy: '+22.4%',
    values: [5500, 5900, 6250, 6600, 6900, 7130, 7320, 7500],
    note: 'Metro expansion and new SIPCOT corridors are driving Chennai’s steepest appreciation curve.',
  },
]

// Blogs — the Avadi property-tax post is from Figma; the others are derived.
export const blogs = [
  {
    date: 'Aug 21, 2024',
    cat: 'Latest Buzz',
    read: '4 min read',
    title: 'How to Pay Avadi Municipality Property Tax Online',
    excerpt:
      'Paying your Avadi property tax online is fast, secure and skips the queues. A simple step-by-step guide for homeowners.',
    image: '/blog/b1.jpg',
  },
  {
    date: 'Jan 21, 2023',
    cat: 'Market',
    read: '6 min read',
    title: "Why Guduvancheri is Chennai's Next Growth Corridor",
    excerpt:
      'Metro expansion, SIPCOT corridors and new townships are turning Guduvancheri into one of the fastest-appreciating belts in the city.',
    image: '/blog/b2.jpg',
  },
  {
    date: 'Jun 21, 2022',
    cat: 'Events',
    read: '3 min read',
    title: 'Life at Omshakthy: Community & Milestones',
    excerpt:
      'From community drives to milestone celebrations — a look at the people, culture and moments that shape life across Omshakthy.',
    image: '/blog/b3.jpg',
  },
  {
    date: 'Mar 12, 2025',
    cat: 'Market',
    read: '5 min read',
    title: 'Inside OmShakthy Regalia: A Gated Community Taking Shape in Avadi',
    excerpt:
      'DTCP-approved layouts, blacktop roads and clear titles — a look at how Regalia is shaping up as one of Avadi’s ongoing gated-community developments.',
    image: '/regalia.png',
  },
  {
    date: 'May 6, 2025',
    cat: 'Latest Buzz',
    read: '5 min read',
    title: 'Documents to Check Before You Buy a Plot in Chennai',
    excerpt:
      'Patta, EC, DTCP approval and RERA registration — the paperwork checklist every buyer should verify before signing on a residential plot.',
    image: '/wc/wc-land.jpg',
  },
]

const W = 800
const H = 230
const padL = 6
const padR = 6
const padT = 14
const padB = 26
const plotW = W - padL - padR
const plotH = H - padT - padB
const maxY = 8000
const gridVals = [2000, 4000, 6000, 8000]
const N = quarters.length

const xAt = (i: number) => padL + (i / (N - 1)) * plotW
const yAt = (v: number) => padT + (1 - v / maxY) * plotH
const linePath = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ')
const areaPath = (vals: number[]) =>
  `${linePath(vals)} L${xAt(N - 1).toFixed(1)},${yAt(0)} L${xAt(0).toFixed(1)},${yAt(0)} Z`
const interp = (vals: number[], t: number) => {
  const i = Math.floor(t)
  if (i >= N - 1) return vals[N - 1]
  return vals[i] + (vals[i + 1] - vals[i]) * (t - i)
}
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const EASE = [0.16, 1, 0.3, 1] as const

const PriceTrends = () => {
  const ref = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const state = inView ? 'show' : 'hidden'

  const [scrub, setScrub] = useState(N - 1)
  const [active, setActive] = useState(false)
  const [isolated, setIsolated] = useState<number | null>(null)
  const qIndex = Math.round(scrub)

  const onChartMove = (e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const relX = (e.clientX - r.left) / r.width
    setScrub(clamp(((relX * W - padL) / plotW) * (N - 1), 0, N - 1))
    setActive(true)
  }
  const onChartLeave = () => {
    setActive(false)
    setScrub(N - 1)
  }

  const cursorX = xAt(scrub)
  const topSeries = series.reduce((best, s) => (parseFloat(s.yoy) > parseFloat(best.yoy) ? s : best), series[0])
  // The spotlight card tracks whichever rung is hovered, falling back to the
  // fastest-growing corridor when nothing's isolated — hovering a rung was
  // already isolating that series in the chart, but the card sat frozen.
  const displayed = isolated !== null ? series[isolated] : topSeries
  const isTopSeries = displayed === topSeries

  return (
    <section ref={ref} className="mp" aria-label="Market intelligence">

      <header className="mp__header">
        <span className="mp__eyebrow">Market Intelligence · 2024</span>
        <h2 className="mp__title">
          Price Trends <em>at a Glance.</em>
        </h2>
      </header>

      {/* TOP — price ladder + spotlight, equal-size cards side by side */}
      <div className="mp__top">
        <div className="mp__ladder">
          {series.map((s, i) => {
            const live = Math.round(interp(s.values, scrub) / 10) * 10
            return (
              <button
                key={s.name}
                className={`mp__rung ${isolated !== null && isolated !== i ? 'is-dim' : ''} ${
                  isolated === i ? 'is-active' : ''
                }`}
                onMouseEnter={() => setIsolated(i)}
                onMouseLeave={() => setIsolated(null)}
                style={{ ['--c' as string]: s.color }}
              >
                <span className="mp__rung-key" aria-hidden />
                <span className="mp__rung-name">{s.name}</span>
                <span className="mp__rung-price">₹{live.toLocaleString('en-IN')}</span>
                <span className="mp__rung-yoy">▲ {s.yoy}</span>
              </button>
            )
          })}
        </div>

        <aside className="mp__spotlight">
          <span className="mp__spotlight-label">
            {isTopSeries ? 'Fastest-Growing Corridor' : 'Corridor Spotlight'}
          </span>
          <h3 className="mp__spotlight-name">{displayed.name}</h3>
          <div className="mp__spotlight-stat">
            {displayed.yoy}
            <small>YoY</small>
          </div>
          <p className="mp__spotlight-copy">{displayed.note}</p>
          <a href="/projects" className="mp__spotlight-cta">
            Explore projects here <span aria-hidden>→</span>
          </a>
        </aside>
      </div>

      {/* BOTTOM — full-bleed chart, edge to edge of the viewport */}
      <div className="mp__chartband">
        <div className="mp__chart-cap">
          <span>Price / sq.ft · Quarterly</span>
          <span className={`mp__qbadge ${active ? 'is-live' : ''}`}>{quarters[qIndex]}</span>
        </div>
        <div className="mp__chart-plot">
          <svg
            ref={svgRef}
            className="mp__chart"
            viewBox={`0 0 ${W} ${H}`}
            onMouseMove={onChartMove}
            onMouseLeave={onChartLeave}
            preserveAspectRatio="none"
            role="img"
            aria-label="Price trend ribbons by quarter"
          >
            <defs>
              {series.map((s) => (
                <linearGradient key={s.name} id={`mp-fill-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
              {/* Draw-in reveal, take three: pathLength (stroke-dasharray)
                  kept producing a gap partway through the line — first
                  traced to a permanent filter, but it persisted even with
                  the filter removed, pointing to dasharray itself clashing
                  with vector-effect="non-scaling-stroke" under this chart's
                  non-uniform preserveAspectRatio="none" scaling. Sidestepping
                  the whole dasharray mechanism: a clipPath rect grows left to
                  right in plain viewBox units (just a `width` attribute, no
                  transform/dasharray involved) and reveals the fully-formed
                  area+line underneath. */}
              {series.map((s, si) => (
                <clipPath key={s.name} id={`mp-reveal-${s.name}`}>
                  <motion.rect
                    x={0}
                    y={0}
                    height={H}
                    initial={{ width: 0 }}
                    animate={{ width: state === 'show' ? W : 0 }}
                    transition={{ duration: 1.1, delay: si * 0.18, ease: EASE }}
                  />
                </clipPath>
              ))}
            </defs>
            {gridVals.map((g) => (
              <line key={g} className="mp__grid" x1={padL} x2={W - padR} y1={yAt(g)} y2={yAt(g)} />
            ))}
            {series.map((s, si) => {
              const dim = isolated !== null && isolated !== si
              const focus = isolated === si
              return (
                <g
                  key={s.name}
                  className={`mp__ribbon ${dim ? 'is-dim' : ''} ${focus ? 'is-focus' : ''}`}
                  clipPath={`url(#mp-reveal-${s.name})`}
                >
                  <path d={areaPath(s.values)} fill={`url(#mp-fill-${s.name})`} className="mp__area" />
                  <path
                    d={linePath(s.values)}
                    fill="none"
                    stroke={s.color}
                    className="mp__line"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )
            })}
            {inView && (
              <g>
                <line className="mp__scan" x1={cursorX} x2={cursorX} y1={padT - 6} y2={yAt(0)} />
                {series.map((s, si) => {
                  const dim = isolated !== null && isolated !== si
                  return (
                    <circle
                      key={s.name}
                      cx={cursorX}
                      cy={yAt(interp(s.values, scrub))}
                      r={4}
                      fill={s.color}
                      className="mp__scan-dot"
                      style={{ opacity: dim ? 0.15 : 1 }}
                    />
                  )
                })}
              </g>
            )}
          </svg>
          <div className="mp__yaxis" aria-hidden>
            {gridVals
              .slice()
              .reverse()
              .map((g) => (
                <span key={g} style={{ top: `${(yAt(g) / H) * 100}%` }}>
                  ₹{(g / 1000).toFixed(0)}k
                </span>
              ))}
          </div>
        </div>
        <div className="mp__axis">
          {quarters.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PriceTrends
