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
  // Same blue-tinted fill AboutContent.tsx uses for its alternate
  // section background — reused here on the filter fields themselves so
  // they read as distinct controls against the white section instead of
  // blending into it (white-on-white with only a 12%-opacity border).
  panel: '#E9F1F9',
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
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 100%), url('/projects/explore-bg.jpg')`,
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
      {/* Back to white with the animated building-sketch watermark — the
          real aerial photo tried here didn't work out, reverted. */}
      <section className="relative overflow-hidden px-6 md:px-10 pt-16 pb-16" style={{ backgroundColor: '#fff' }} data-header-theme="light">
        <motion.img
          src="/about/building-sketch.png"
          alt=""
          aria-hidden
          className="absolute left-1/2 w-[900px] md:w-[1300px] max-w-none pointer-events-none select-none hidden sm:block"
          style={{ opacity: 0.08, top: '80%', y: '-50%' }}
          animate={{ x: ['-60%', '-40%', '-60%'], rotate: [-2, 2, -2] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1180px] mx-auto relative">
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
                style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
              />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
            >
              {locationOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
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
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
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
              style={{ ...body, border: `1px solid ${C.border}`, color: C.ink, backgroundColor: C.panel }}
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
      {/* No longer full-bleed — per request, the cards were reading as
          "flush left and right" against the viewport edges, so the grid
          now sits inside the same px-6/md:px-10 + max-w-[1180px]
          centered container the filter bar above it already uses,
          shrinking the cards in from both edges. (Was deliberately
          edge-to-edge before, matching a reference design — that's the
          part being reversed here.) */}
      <section className="px-4 md:px-6" data-header-theme="light">
        <div className="max-w-[1600px] mx-auto">
          {filtered.length === 0 && (
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
          )}
          {filtered.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((p, i) => {
              /* Link vs. plain div can't share one polymorphic tag
                 without fighting TS's LinkProps typing — the inner
                 markup is identical either way, so it's built once
                 and just wrapped differently. */
              /* Redesigned per request: rounded corners (was
                 deliberately flat/square before). Previous pass tried a
                 row of two separate boxes (a white panel + a photo box
                 side by side), each with its own background — that
                 always shows a seam where the two meet, because their
                 colors can never line up pixel-for-pixel at every
                 height. Fixed by going back to ONE photo filling the
                 whole card, with a single gradient scrim laid on top of
                 it (white/pale-blue, opaque on the left, fading to
                 fully transparent by the image's midpoint) — the
                 "opaque left portion" is just where that scrim reads as
                 solid, so it's physically the same layer as the fade,
                 not two things touching. Project details sit on top of
                 the scrim as plain dark text. gap-3 -> gap-5 to narrow
                 each card slightly, per request. */
              const cardInner = (
                <div className="relative overflow-hidden" style={{ aspectRatio: '2.5 / 1' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={p.status === 'Sold' ? { filter: 'grayscale(0.5) brightness(0.7)' } : undefined}
                    loading="lazy"
                  />

                  {/* One continuous scrim — opaque white/pale-blue on
                      the left, gradually fading to fully transparent.
                      Nothing else shares this edge, so there's nothing
                      for it to seam against. */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to right, #ffffff 0%, #ffffff 20%, #eaf3fb 28%, rgba(234,243,251,0.65) 34%, rgba(234,243,251,0.25) 39%, rgba(234,243,251,0) 45%)',
                    }}
                  />

                  {/* Project details, sitting on the opaque part of the scrim. */}
                  <div className="absolute inset-y-0 left-0 flex flex-col justify-center" style={{ width: '38%', padding: '0 1.1rem 0 1.4rem' }}>
                    <span
                      className="inline-flex items-center gap-1 rounded-full uppercase w-fit"
                      style={{
                        ...body,
                        padding: '0.2rem 0.5rem',
                        background: p.status === 'Ongoing' ? 'rgba(13,107,178,0.1)' : 'rgba(180,83,9,0.1)',
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: p.status === 'Ongoing' ? C.blue : '#B45309',
                      }}
                    >
                      <span
                        className="rounded-full flex-shrink-0"
                        style={{ width: 5, height: 5, background: 'currentColor' }}
                      />
                      {p.status === 'Ongoing' ? 'Ongoing' : 'Sold Out'}
                    </span>
                    <h3
                      className="uppercase"
                      style={{
                        ...display,
                        margin: '0.3rem 0 0',
                        fontSize: 28,
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: '0.02em',
                        color: C.ink,
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        minWidth: 0,
                        maxWidth: 210,
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="flex items-center gap-1"
                      style={{ ...body, margin: '0.15rem 0 0', fontSize: 15, color: C.slate, minWidth: 0 }}
                    >
                      <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.4" />
                      </svg>
                      {p.location}
                    </p>
                    <p style={{ ...body, marginTop: '0.35rem', fontSize: 14.5, fontWeight: 600, color: C.ink }}>
                      {p.price}
                    </p>
                    {/* Same type label already shown top-right on the
                        photo (className="block text-sm") — also added
                        here in the details panel, per request. */}
                    <p className="block text-sm" style={{ ...body, marginTop: '0.35rem', color: C.slate }}>
                      {p.type}
                    </p>
                  </div>
                </div>
              )
              return (
                <Reveal key={p.name} delay={(i % 2) * 0.08}>
                  {p.link ? (
                    <Link href={p.link} className="block overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(13, 107, 178, 0.35)' }}>
                      {cardInner}
                    </Link>
                  ) : (
                    <div className="block overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(13, 107, 178, 0.35)' }}>
                      {cardInner}
                    </div>
                  )}
                </Reveal>
              )
            })}
            </div>
          )}
        </div>
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
