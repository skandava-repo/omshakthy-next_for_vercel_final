'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import Link from 'next/link'

/* ProjectsContent — built to mirror stewartcorealty.com's
   /search-result-sales page (the reference the user pointed at): a
   real filter bar (search + status + type, all functionally wired,
   not decorative) above a 2-column full-bleed photo grid, each card's
   name/price/type overlaid directly on the image rather than sitting
   below it in a text block. Same C/display/body/mono/Reveal/
   KineticHeading pattern AboutContent.tsx already established for
   this site's content pages — duplicated locally rather than shared,
   same as that file did for its own primitives.

   Project data is the real set already defined in PropertyGrid.tsx
   (home page) — not invented for this page. Six real projects, three
   sold out — no fake "Load More" pagination, since there's nothing
   more to load. */

// Blue-only palette, same as AboutContent.tsx's post-rebrand C object —
// this page never actually used the old brass/cream tokens (grep turned
// up zero usages beyond their own definitions), so this is a cleanup,
// not a visual change: dropping the dead gold-adjacent tokens so there's
// nothing left to accidentally reach for later.
const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  border: 'rgba(13, 107, 178, 0.12)',
}
const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif" }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace" }
const ease = [0.16, 1, 0.3, 1] as const

const Reveal = ({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Count-up figure ---------- */
const CountUp = ({ to, format }: { to: number; format: (n: number) => string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

interface Project {
  image: string
  name: string
  location: string
  status: 'Ongoing' | 'Sold'
  type: string
  price: string
  /* Numeric ₹-lakh value for real price-range bucketing — null for
     sold-out projects, which have no live asking price to bucket. */
  priceLakh: number | null
  link?: string
}

/* Real data — the same array PropertyGrid.tsx (home page) already
   uses, just recompressed images (public/projects/*.jpg vs. the
   original 2.3-2.8MB public/*.png files) since this page shows them
   at a larger, more prominent size than the home slider does. */
const projects: Project[] = [
  { image: '/projects/canopus-magha.jpg', name: 'Kanopus Magha', location: 'Guduvanchery, Chennai', status: 'Ongoing', type: 'Residential Plots', price: '₹25L onwards', priceLakh: 25 },
  { image: '/projects/regalia.jpg', name: 'OmShakthy Regalia', location: 'Avadi, Chennai', status: 'Ongoing', type: 'Gated Community', price: '₹32L onwards', priceLakh: 32, link: '/regalia' },
  { image: '/projects/elite-grand.jpg', name: 'Elite Grand', location: 'Thirumullaivoyal, Chennai', status: 'Ongoing', type: 'Premium Plots', price: '₹28L onwards', priceLakh: 28 },
  { image: '/projects/mathura.jpg', name: 'OmShakthy Mathura', location: 'Tambaram, Chennai', status: 'Sold', type: 'Residential Plots', price: 'Sold Out', priceLakh: null },
  { image: '/projects/property-5.jpg', name: 'Kanopus Mithila', location: 'Vandalur, Chennai', status: 'Sold', type: 'Gated Community', price: 'Sold Out', priceLakh: null },
  { image: '/projects/property-6.jpg', name: 'Industrial Park', location: 'Sriperumbudur, Chennai', status: 'Sold', type: 'Industrial', price: 'Sold Out', priceLakh: null },
]

const statusOptions = ['All Status', 'Ongoing', 'Sold'] as const
const typeOptions = ['All Types', ...Array.from(new Set(projects.map((p) => p.type)))]
const locationOptions = ['All Locations', ...Array.from(new Set(projects.map((p) => p.location)))]

/* Real buckets built from our actual three price points (25L/28L/32L)
   — not the reference's 0-250k/250k-500k/... scale, which is Barbados
   villa pricing and has no relationship to our ₹-lakh land pricing. */
const priceRangeOptions = [
  { label: 'All Prices', test: (_: number | null) => true },
  { label: 'Up to ₹25L', test: (v: number | null) => v !== null && v <= 25 },
  { label: '₹25L – ₹30L', test: (v: number | null) => v !== null && v > 25 && v <= 30 },
  { label: 'Above ₹30L', test: (v: number | null) => v !== null && v > 30 },
] as const

const ProjectsContent = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<(typeof statusOptions)[number]>('All Status')
  const [type, setType] = useState('All Types')
  const [location, setLocation] = useState('All Locations')
  const [priceRange, setPriceRange] = useState<string>(priceRangeOptions[0].label)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rangeTest = priceRangeOptions.find((r) => r.label === priceRange)?.test ?? (() => true)
    return projects.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      const matchesStatus = status === 'All Status' || p.status === status
      const matchesType = type === 'All Types' || p.type === type
      const matchesLocation = location === 'All Locations' || p.location === location
      const matchesPrice = priceRange === priceRangeOptions[0].label || rangeTest(p.priceLakh)
      return matchesQuery && matchesStatus && matchesType && matchesLocation && matchesPrice
    })
  }, [search, status, type, location, priceRange])

  const resetFilters = () => {
    setSearch('')
    setStatus('All Status')
    setType('All Types')
    setLocation('All Locations')
    setPriceRange(priceRangeOptions[0].label)
  }

  return (
    <main style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative flex items-end min-h-[46vh] pt-40 pb-14 px-6 md:px-10"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,67,133,0.42) 0%, rgba(13,107,178,0.25) 100%), url('/projects/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1180px] mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-3"
            style={{ ...mono, fontSize: '0.8rem', letterSpacing: '0.2em', color: C.mist, textTransform: 'uppercase' }}
          >
            <span style={{ width: 36, height: 1.5, background: C.mist, display: 'inline-block' }} />
            Our Projects
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-6xl font-bold"
            style={{ ...display, color: '#fff' }}
          >
            Landmark Developments Across Tamil Nadu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-4 max-w-xl text-base md:text-lg"
            style={{ color: 'rgba(255,255,255,0.86)' }}
          >
            From ongoing residential plots to sold-out gated communities — 35 years of real
            estate, project by project.
          </motion.p>
        </div>
      </section>

      {/* ---------------- Filter bar ----------------
          The reference has a centered tracked-caps "EXPLORE OUR
          PROPERTIES" heading above the fields, and the fields
          themselves sit in a 2-row grid of pill dropdowns (not one
          mixed row of a text input + segmented buttons, which is what
          this had before). Rebuilt to match: Search / Location / Type
          on row one, Status / Reset Filters on row two — Location and
          Type are real dropdowns built from this page's own actual
          data (6 real locations, 4 real project types), not filler
          fields copied from a listing site that also tracks bedrooms
          and bathrooms, which our land/plot inventory doesn't have. */}
      <section className="px-6 md:px-10 py-14" style={{ backgroundColor: '#fff' }} data-header-theme="light">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase"
              style={{ ...display, color: C.ink, letterSpacing: '0.08em' }}
            >
              Explore Our Projects
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke={C.slate}
                strokeWidth={1.6}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none"
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
              />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
            >
              {locationOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Real bucketed price filter, matching the reference's
                field (a "Price range" dropdown is the 6th field in the
                actual mirror) — built from our own three real ₹-lakh
                price points, not their Barbados villa scale. */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: '#fff' }}
            >
              {priceRangeOptions.map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3.5 rounded-full text-sm font-semibold uppercase"
              style={{ ...mono, backgroundColor: C.ink, color: '#fff', letterSpacing: '0.08em' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Project grid ----------------
          The reference's cards are flush edge-to-edge — no rounded
          corners, no drop shadow, no gap between them, cards butt
          straight up against each other in a seamless 2-column grid.
          This had all three (rounded-[10px], a boxShadow, gap-6),
          which is why it read as a generic "card" grid instead of
          matching the reference's flatter, more architectural gallery
          feel. Text on the photo also carries no colored badge pill in
          the reference — just plain tracked uppercase text, which is
          what "Ongoing"/"Sold Out" now use instead of a filled chip. */}
      {/* Full-bleed to the actual screen edges — no max-width, no side
          padding on the section itself. Confirmed directly against the
          reference: the grid runs edge-to-edge of the browser viewport,
          not inside a centered container like the filter bar above it.
          A previous restructuring pass accidentally nested this inside
          a max-w-[1180px] wrapper while fixing an unrelated JSX bug,
          which quietly killed the full-bleed behavior — the empty-state
          message is the only thing that still needs its own centered,
          padded wrapper, since a single line of text going full-bleed
          edge-to-edge would just look broken. */}
      <section className="py-16" data-header-theme="light">
        {filtered.length === 0 && (
          <div className="px-6 md:px-10">
            <div className="max-w-[1180px] mx-auto">
              <Reveal className="text-center py-20">
                <p className="text-lg" style={{ color: C.slate }}>No projects match those filters.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-6 py-3 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: C.ink, color: '#fff' }}
                >
                  Reset Filters
                </button>
              </Reveal>
            </div>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((p, i) => {
              /* Link vs. plain div can't share one polymorphic tag
                 without fighting TS's LinkProps typing — the inner
                 markup is identical either way, so it's built once
                 and just wrapped differently. */
              /* Re-checked against the live reference directly (not
                 from memory): there IS a gap between cards, but it's
                 thin — a sliver of the page background, not the 24px
                 rounded-shadow "card" treatment from the previous
                 pass. The cards themselves are flat: sharp square
                 corners, no elevation/shadow at all. gap-6 -> gap-3,
                 and the border-radius/box-shadow that read as a
                 generic "card" grid are gone. */
              const cardStyle: React.CSSProperties = { aspectRatio: '2.5 / 1' }
              const textShadow = '0 2px 12px rgba(0,0,0,0.55)'
              const cardInner = (
                <>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={p.status === 'Sold' ? { filter: 'grayscale(0.5) brightness(0.7)' } : undefined}
                    loading="lazy"
                  />

                  <div className="absolute top-5 right-5 text-right">
                    <span
                      className="block text-sm"
                      style={{ ...body, color: 'rgba(255,255,255,0.92)', textShadow }}
                    >
                      {p.type}
                    </span>
                    <span
                      className="block mt-1 text-sm"
                      style={{ ...body, color: 'rgba(255,255,255,0.92)', textShadow }}
                    >
                      {p.status === 'Ongoing' ? 'Ongoing' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3
                      className="text-xl md:text-2xl font-bold uppercase"
                      style={{ ...display, color: '#fff', letterSpacing: '0.08em', lineHeight: 1.3, textShadow }}
                    >
                      {p.name}
                    </h3>
                    <p className="mt-2 text-base md:text-lg" style={{ ...body, color: '#fff', textShadow }}>
                      {p.price}
                    </p>
                  </div>
                </>
              )
              return (
                <Reveal key={p.name} delay={(i % 2) * 0.08}>
                  {p.link ? (
                    <Link href={p.link} className="relative block overflow-hidden" style={cardStyle}>
                      {cardInner}
                    </Link>
                  ) : (
                    <div className="relative block overflow-hidden" style={cardStyle}>
                      {cardInner}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        )}
      </section>

      {/* ---------------- Stats strip ----------------
          The reference has exactly this — three plain number+line
          facts between the grid and the footer (25 years experience /
          3 countries of practice / 1 goal). Missed entirely in the
          first build. Real OmShakthy numbers here, not invented ones:
          the 35+ years and 100% litigation-free figures are the same
          facts the About page's own legacy section uses, and the
          project count is the actual length of the array above, so it
          never drifts out of sync with what's really listed. */}
      <section className="px-6 md:px-10 py-16" style={{ borderTop: `1px solid ${C.border}` }} data-header-theme="light">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { to: 35, format: (n: number) => `${Math.round(n)}+`, label: 'years shaping Tamil Nadu’s real estate landscape.' },
            { to: projects.length, format: (n: number) => `${Math.round(n)}`, label: 'landmark developments delivered across Tamil Nadu.' },
            { to: 100, format: (n: number) => `${Math.round(n)}%`, label: 'litigation-free track record, every single time.' },
          ].map((s) => (
            <Reveal key={s.label} className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-bold flex-shrink-0" style={{ ...display, color: C.ink }}>
                <CountUp to={s.to} format={s.format} />
              </span>
              <span className="text-sm md:text-base" style={{ color: C.slate }}>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ProjectsContent
