'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform } from 'framer-motion'

/* AboutContent — built to mirror allys.mu/en/about section-for-section
   (the reference the user supplied as allys-about-mirror.zip): light
   throughout, generous whitespace, real photography, rounded cards, a
   calm fade-up-on-scroll reveal and nothing more — no parallax, no
   grain, no custom cursor, no pinned scroll-jacking. That reference has
   no institutional-trust section of its own, so SIDCO/SIPCOT/Mahindra
   World City/PepsiCo/BSNL are folded into the founder bio as concrete
   detail (the same way Allys' own bio names "30 years" and "10
   projects") rather than getting an extra section the mirror doesn't
   have. Header is this site's own Header.tsx, untouched. */

const C = {
  ink: '#0B1F3A',
  slate: '#64748B',
  blue: '#0D6BB2',
  blueDeep: '#004385',
  mist: '#7DB4EB',
  // Blue-tinted alternate section background, replacing the old warm
  // cream (#F4EFE6). Testimonials' own #F4F6F9 page ground reads as
  // near-white next to a true white section on this page (that
  // component never puts the two edge-to-edge — About does), so this
  // is pulled more visibly blue to actually read as a second tone.
  panel: '#E9F1F9',
  border: 'rgba(13, 107, 178, 0.12)',
}

const display: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em' }
const body: React.CSSProperties = { fontFamily: "'Inter', Helvetica, Arial, sans-serif" }
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', Consolas, monospace" }
const ease = [0.16, 1, 0.3, 1] as const

/* ---------- Reveal: SSR-safe "focus pull" reveal on scroll ----------
   Was a plain fade + rise. Now blur(6px)->0 and scale(0.96)->1 ride
   alongside the same opacity/y — content settles into focus as it
   scrolls in rather than just fading up. Still one single spring-free
   transition, still fires once, still degrades to a static div before
   hydration — just a visibly richer entrance for every section using
   it (which is effectively every section on this page). */
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
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- KineticHeading: word-by-word rise ----------
   Every other heading on this page is one motion.div fading/blurring
   up as a single block (Reveal). This animates the actual words: each
   one sits in its own overflow-hidden mask and slides up from below
   into place with its own stagger delay, so the copy itself is what's
   moving, not a box around it. */
const KineticHeading = ({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const words = text.split(' ')
  if (!mounted) {
    return (
      <h2 className={className} style={style}>
        {text}
      </h2>
    )
  }
  return (
    <h2 className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotate: 4 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

/* ---------- ImageReveal: curtain-wipe photo entrance ----------
   A solid panel covers the photo, then wipes away right-to-left
   (scaleX 1 -> 0, transform-origin: right) while the image itself
   settles from a slight zoom + blur — the one genuinely new trick this
   page didn't already have. Drop-in for a plain <img>: pass the same
   src/alt plus imgClassName/imgStyle for what used to be the <img>'s
   own className/style; the wrapper just needs to sit inside whatever
   rounded/shadowed box already exists (Reveal usually provides it) —
   it doesn't set its own size, so there's no risk of the height
   circularity that bit .bp__banner earlier: the <img>'s own explicit
   height/aspect classes are what the wrapper's auto height resolves
   from, and the curtain is purely absolute/out-of-flow on top of that. */
const ImageReveal = ({
  src,
  alt = '',
  imgClassName,
  imgStyle,
  delay = 0,
  panelColor = C.ink,
}: {
  src: string
  alt?: string
  imgClassName?: string
  imgStyle?: React.CSSProperties
  delay?: number
  panelColor?: string
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div className="relative">
        <img src={src} alt={alt} className={imgClassName} style={imgStyle} />
      </div>
    )
  }
  return (
    <div className="relative">
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        style={imgStyle}
        initial={{ scale: 1.18, filter: 'blur(6px)' }}
        whileInView={{ scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.3, delay: delay + 0.15, ease }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: panelColor, transformOrigin: 'right center' }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.85, delay, ease }}
      />
    </div>
  )
}

/* ---------- AutoSlide: auto-advancing crossfade slideshow ----------
   Drop-in cousin of ImageReveal — same curtain-wipe entrance on the
   first frame — but instead of settling on one static photo it keeps
   cycling through `images` on its own timer, crossfading between
   frames with AnimatePresence rather than waiting on arrows/dots. */
const AutoSlide = ({
  images,
  alt = '',
  imgClassName,
  imgStyle,
  interval = 4000,
  delay = 0,
  panelColor = C.ink,
}: {
  images: string[]
  alt?: string
  imgClassName?: string
  imgStyle?: React.CSSProperties
  interval?: number
  delay?: number
  panelColor?: string
}) => {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(0)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  if (!mounted) {
    return (
      <div className="relative">
        <img src={images[0]} alt={alt} className={imgClassName} style={imgStyle} />
      </div>
    )
  }
  return (
    <div className="relative">
      {/* Invisible, in-flow — establishes the box's height/width so the
          crossfading frames (absolutely positioned) have something to
          size against. */}
      <img src={images[0]} alt="" aria-hidden className={imgClassName} style={{ ...imgStyle, opacity: 0 }} />
      <AnimatePresence>
        <motion.img
          key={active}
          src={images[active]}
          alt={alt}
          className={`absolute inset-0 ${imgClassName ?? ''}`}
          style={imgStyle}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease }}
        />
      </AnimatePresence>
      <motion.div
        className="absolute inset-0"
        style={{ background: panelColor, transformOrigin: 'right center' }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.85, delay, ease }}
      />
    </div>
  )
}


/* ---------- WhyChooseRow: converging entrance + live scroll parallax ----------
   The photo/text pairing needed actual motion, not just a one-time
   fade — this is a real scroll-tied animation, not another reveal:
   1. On entrance, the photo and its text slide in from opposite
      edges and meet in the middle (row flips per index).
   2. The photo itself then keeps moving the entire time the row is
      in the viewport — scrollYProgress drives its vertical offset
      inside an overflow-hidden frame, a live parallax that plays for
      as long as you're scrolled past it, not a single reveal. */
const WhyChooseRow = ({
  f,
  i,
}: {
  f: { img: string; title: string; desc: string }
  i: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const flip = i % 2 === 1

  return (
    <div ref={ref} className={`flex flex-col md:items-center gap-4 md:gap-6 ${flip ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      <motion.div
        className="w-full md:w-[46%] flex-shrink-0 rounded-[28px] overflow-hidden"
        style={{ boxShadow: '0 24px 60px -20px rgba(11,31,58,0.2)' }}
        initial={{ opacity: 0, x: flip ? 90 : -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.85, ease }}
      >
        <div className="relative h-[260px] md:h-[320px] overflow-hidden">
          <motion.img
            src={f.img}
            alt={f.title}
            className="absolute inset-x-0 w-full h-[130%] object-cover"
            style={{ top: '-15%', y }}
          />
        </div>
      </motion.div>
      <motion.div
        className={flip ? 'md:text-right' : ''}
        initial={{ opacity: 0, x: flip ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.85, delay: 0.12, ease }}
      >
        <span style={{ ...mono, fontSize: '0.75rem', letterSpacing: '0.25em', color: C.blueDeep }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-3 text-2xl md:text-3xl font-bold" style={{ ...display, color: C.ink }}>
          {f.title}
        </h3>
        <p
          className="mt-3 text-base md:text-lg leading-relaxed max-w-md"
          style={{ color: C.slate, ...(flip ? { marginLeft: 'auto' } : {}) }}
        >
          {f.desc}
        </p>
      </motion.div>
    </div>
  )
}

/* ---------- Count-up figure ---------- */
const CountUp = ({ to, format }: { to: number; format: (n: number) => string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setVal(v) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

/* ---------- Simple stroke icons (same thin, single-color line style as the reference's feature grid) ---------- */
const ICONS: Record<string, string> = {
  shield: 'M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z M9 12l2 2 4-4',
  pin: 'M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z M12 12a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  layers: 'm12 3 9 4.8-9 4.8-9-4.8L12 3Z M3 13l9 4.8 9-4.8 M3 17.4l9 4.8 9-4.8',
  calendar: 'M4 6h16v15H4Z M4 11h16 M8 3v5 M16 3v5',
  users: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5 M18 8a3 3 0 1 0 0-6 M17 12c2.5 0 5 2 5 5.5',
  map: 'M9 4 3 6v15l6-2 6 2 6-2V4l-6 2-6-2Z M9 4v15 M15 6v15',
  building: 'M5 21V7l7-4 7 4v14Z M9 21v-6h6v6 M9 11h.01 M15 11h.01 M9 15h.01 M15 15h.01',
  coin: 'M12 3v2.5 M12 18.5V21 M8 7.5c0-1.7 1.7-2.8 4-2.8s4 1.1 4 2.8-1.7 2.3-4 2.3-4 .6-4 2.3 1.7 2.9 4 2.9 4-1.1 4-2.9',
}
const FeatureIcon = ({ name, size = 30 }: { name: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={C.blueDeep} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[name]} />
  </svg>
)

const whyChooseUs = [
  {
    img: '/projects/regalia.jpg',
    title: 'Clear & Verified Titles',
    desc: 'Every property undergoes meticulous legal verification. With DTCP and CMDA approved developments wherever applicable and a 100% litigation-free history, your investment begins with complete peace of mind.',
  },
  {
    img: '/projects/canopus-magha.jpg',
    title: 'Locations That Grow With You',
    desc: 'We identify emerging growth corridors before they become market hotspots, so our customers benefit from superior appreciation and long-term returns.',
  },
  {
    img: '/projects/property-6.jpg',
    title: 'Expertise Across Every Asset Class',
    desc: 'From a 600 sq.ft residential plot to multi-acre industrial developments, we bring decades of expertise across residential, commercial, industrial, logistics, and hospitality real estate.',
  },
]

/* Ordered roughly as a route out from Chennai's core rather than
   alphabetically — the visual below reads them as stops along a line,
   so the order itself carries meaning. */
/* Real landmark photo per location, sourced from Wikimedia Commons
   (CC-licensed, hotlinked via Special:FilePath — resolves to the
   actual file, no local copy needed). */
const WIKI = 'https://commons.wikimedia.org/wiki/Special:FilePath/'
const locations = [
  { name: 'Avadi', tag: 'Industrial growth corridor', img: `${WIKI}Tidel_Park_Avadi.jpg` },
  { name: 'Chromepet', tag: 'Established residential hub', img: `${WIKI}Chrompet_flyover.jpg` },
  { name: 'GST Road', tag: 'Prime highway corridor', img: `${WIKI}Tambaram_highway_in_Chennai.jpg` },
  { name: 'Guduvanchery', tag: 'Emerging southern suburb', img: `${WIKI}Arulmigu_Nandeeswarar_Temple_at_Guduvancheri,_South_Chennai_01.jpg` },
  { name: 'Thirumudivakkam', tag: 'Riverside growth belt', img: `${WIKI}Kotturpuram_Bridge_Adyar_River_Chennai_Jul18_DSC05376.jpg` },
  { name: 'OMR', tag: 'IT corridor gateway', img: `${WIKI}Chennai.tidelpark.jpg` },
  { name: 'Coimbatore', tag: 'Textile city expansion', img: `${WIKI}Adiyogi_Statue_at_Coimbatore,_Tamil_Nadu.jpg` },
  { name: 'Tirunelveli', tag: 'Southern Tamil Nadu gateway', img: `${WIKI}Tirunelveli_Nellaiappar_Temple_1.jpg` },
  { name: 'Kanyakumari', tag: "India's coastal tip", img: `${WIKI}Vivekananda_Rock_Memorial,_Kanyakumari.jpg` },
]

const legacyStats = [
  { icon: 'calendar', to: 35, format: (n: number) => `${Math.round(n)}+`, label: 'Years of Real Estate Excellence' },
  { icon: 'users', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Happy Customers' },
  { icon: 'map', to: 7500, format: (n: number) => `${Math.round(n).toLocaleString('en-IN')}+`, label: 'Acres Aggregated & Developed' },
  { icon: 'building', to: 30, format: (n: number) => `${Math.round(n)}+`, label: 'Landmark Projects Delivered' },
  { icon: 'coin', to: 2000, format: (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}+ Cr`, label: 'In Business Transactions' },
  { icon: 'shield', to: 100, format: (n: number) => `${Math.round(n)}%`, label: 'Litigation-Free Track Record' },
]

const AboutContent = () => {
  return (
    <main style={{ backgroundColor: '#fff', color: C.ink, ...body }}>
      {/* ---------------- Hero ---------------- */}
      <section
        className="relative flex items-end min-h-[40vh] pt-20 pb-8 px-4 md:px-6"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11,31,58,0.65) 0%, rgba(11,31,58,0.3) 45%, rgba(11,31,58,0.55) 100%), url('/about/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1180px] mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-5xl md:text-7xl font-bold"
            style={{ ...display, color: '#fff' }}
          >
            About OmShakthy Homes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-5 max-w-xl text-base md:text-lg"
            style={{ color: 'rgba(255,255,255,0.86)' }}
          >
            Chennai&rsquo;s most trusted real estate brand, with over 35 years of expertise in
            creating exceptional residential, commercial, and institutional developments.
          </motion.p>
        </div>
      </section>

      {/* ---------------- Chennai Property Experts + Signature photo ----------------
          Wrapped in one relative/overflow-hidden shell so the building-
          sketch watermark can bleed across both sections instead of
          getting clipped at the first section's own bottom edge. */}
      <div className="relative overflow-hidden">
        {/* Line-art building sketch as a faint background watermark,
            positioned to straddle the seam between the two sections —
            low opacity so copy/photos in front stay fully legible;
            painted behind them automatically since it's absolute with
            no z-index and they're normal flow. */}
        <img
          src="/about/building-sketch.png"
          alt=""
          aria-hidden
          className="absolute -left-20 md:-left-32 w-[820px] md:w-[1280px] pointer-events-none select-none hidden sm:block"
          style={{ opacity: 0.08, top: '52%', transform: 'translateY(-50%)' }}
        />
        <section className="relative px-4 md:px-6 py-10 md:py-12" data-header-theme="light">
          <div className="max-w-[1180px] mx-auto grid md:grid-cols-2 gap-6 items-center relative">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ ...display, color: C.ink }}>
                Chennai Property Experts
              </h2>
              <p className="mt-6 text-base md:text-lg leading-relaxed" style={{ color: C.slate }}>
                OmShakthy Homes is a premier real estate development company based in Chennai,
                specializing in residential plots, villas, apartments, and large-scale industrial
                and commercial land solutions for both families and institutions.
              </p>
              <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: C.slate }}>
                Founded in 1991 by visionary entrepreneur R. Ramachanthran, the company began by
                providing strategic land aggregation for Government bodies and institutions
                including SIDCO, SIPCOT, Mahindra World City, PepsiCo, and BSNL. Today, under the
                dynamic leadership of Managing Director N.R. Manigantan, we have successfully
                delivered more than 30 landmark projects across Tamil Nadu.
              </p>
            </Reveal>
            {/* Plain div, not Reveal — ImageReveal's own curtain-wipe +
                zoom-settle is the entrance here; stacking Reveal's blur/
                scale on top of it would double-animate the same box. */}
            <div className="rounded-[28px] overflow-hidden" style={{ boxShadow: '0 24px 60px -20px rgba(11,31,58,0.25)' }}>
              <AutoSlide
                images={['/about/loc-9.png', '/about/loc-2.jpg', '/about/loc-3.jpg', '/about/loc-4.jpg']}
                alt="OmShakthy Homes development"
                imgClassName="w-full h-[420px] object-cover"
                delay={0.1}
              />
            </div>
          </div>
        </section>

        {/* ---------------- Signature photo, logo mark centered ---------------- */}
        <section className="relative px-4 md:px-6 pb-10">
          <div className="max-w-[1180px] mx-auto rounded-[28px] overflow-hidden relative" style={{ boxShadow: '0 24px 60px -20px rgba(11,31,58,0.25)' }}>
            <ImageReveal
              src="/about/loc-7.jpg"
              imgClassName="w-full h-[360px] md:h-[440px] object-cover"
              imgStyle={{ filter: 'brightness(0.55)' }}
            />
            {/* Logo + wordmark hold until the curtain has cleared, then
                rise in on their own beat rather than appearing with the
                photo underneath it. */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
            >
              <img src="/omshakthy-logo.png" alt="OmShakthy Homes" className="w-20 h-20 md:w-28 md:h-28 object-contain" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }} />
              <span className="tracking-[0.3em] text-sm md:text-base font-semibold uppercase" style={{ color: '#fff' }}>
                OmShakthy Homes
              </span>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ---------------- What Sets Us Apart ---------------- */}
      <section className="relative px-4 md:px-6 py-10 md:py-12" style={{ backgroundColor: C.panel }} data-header-theme="light">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ ...display, color: C.ink }}>
              Why Thousands Choose Us
            </h2>
            <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
              Our commitment to transparency and excellence drives everything we do
            </p>
          </Reveal>
          {/* Real project photography standing in for the old line-icons —
              each point paired with an actual OmShakthy development
              rather than an abstract glyph, laid out as alternating
              photo/text rows (not a card grid). WhyChooseRow carries its
              own converging slide-in entrance plus a live scroll-tied
              parallax on the photo — actual ongoing motion, not a
              one-shot fade. */}
          <div className="mt-8 flex flex-col gap-6 md:gap-10">
            {whyChooseUs.map((f, i) => (
              <WhyChooseRow key={f.title} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Where We Build ----------------
          A separate card per location, moving in a continuous marquee —
          the same infinite x: 0% -> -50% loop technique used elsewhere
          for ticker text, just built out of real cards instead. The
          array is duplicated exactly once (18 cards total) so the loop
          seams perfectly at the halfway point with no visible jump. */}
      <section className="relative px-4 md:px-6 py-10 md:py-12" data-header-theme="light">
        <div className="max-w-[1180px] mx-auto relative">
          {/* Ghost "09" — the actual count of corridors below, not an
              arbitrary decoration, echoing the same index-number motif
              each card already carries (01-09) rather than leaving the
              header as a plain centered heading like every other
              section on the page. */}
          <span
            aria-hidden
            className="absolute select-none pointer-events-none hidden md:block"
            style={{
              ...display,
              top: '-3rem',
              right: 0,
              fontSize: 'clamp(8rem, 16vw, 13rem)',
              fontWeight: 700,
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: `1.5px ${C.blue}`,
              opacity: 0.4,
            }}
          >
            09
          </span>
          <div className="relative text-center">
            {/* Not wrapped in Reveal — KineticHeading animates its own
                words individually; stacking Reveal's whole-block blur/
                scale on top would double-animate the same text. */}
            <KineticHeading
              text="Where We Build"
              className="text-4xl md:text-5xl font-bold"
              style={{ ...display, color: C.ink }}
            />
            <Reveal delay={0.35}>
              <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
                Nine growth corridors across Tamil Nadu, always expanding
              </p>
            </Reveal>
          </div>
        </div>

        {/* Full-bleed — breaks out of the max-w-[1180px] container so
            cards can scroll edge-to-edge under the section's own
            padding, with a fade at both edges instead of a hard clip. */}
        <div
          className="mt-8 -mx-4 md:-mx-6 overflow-hidden"
          style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}
        >
          <motion.div
            className="flex gap-3 px-4 md:px-6"
            style={{ width: 'max-content' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          >
            {[...locations, ...locations].map((loc, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 overflow-hidden"
                style={{
                  width: 240,
                  height: 300,
                  borderRadius: '32px 6px 32px 6px',
                  boxShadow: '0 16px 40px -16px rgba(11,31,58,0.35)',
                }}
              >
                <img src={loc.img} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(0deg, rgba(11,31,58,0.92) 0%, rgba(11,31,58,0.25) 55%, rgba(11,31,58,0.05) 78%)' }}
                />
                <span
                  className="absolute top-5 left-5"
                  style={{ ...mono, fontSize: '0.75rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.65)' }}
                >
                  {String((i % locations.length) + 1).padStart(2, '0')}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-xl font-bold" style={{ ...display, color: '#fff' }}>{loc.name}</h4>
                  <p
                    className="mt-1 text-xs font-medium uppercase"
                    style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)' }}
                  >
                    {loc.tag}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- A Legacy Measured by Trust ----------------
          Back to white — the Closing CTA right below has its own panel-
          colored card with zero top padding above it, so a panel section
          here fused directly into that card with no visible seam (same
          pale blue, no gap). White keeps that card's boundary visible;
          two whites back to back reads as plain continuous page, not a
          merged block, since there's no card here for the seam to hide. */}
      <section className="relative px-4 md:px-6 py-10 md:py-12" data-header-theme="light">
        <div className="max-w-[1180px] mx-auto">
          <Reveal className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ ...display, color: C.ink }}>
              A Legacy Measured by Trust
            </h2>
            <p className="mt-4 text-base md:text-lg" style={{ color: C.slate }}>
              Success isn&rsquo;t measured merely by years in business — it&rsquo;s measured by
              the confidence people place in us.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
            {legacyStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div
                  className="h-full rounded-2xl bg-white p-4 md:p-5 text-center"
                  style={{ boxShadow: '0 10px 30px -14px rgba(11,31,58,0.15)', border: `1px solid ${C.border}` }}
                >
                  <div className="flex justify-center">
                    <FeatureIcon name={s.icon} />
                  </div>
                  <div className="mt-4 text-3xl md:text-4xl font-bold" style={{ ...display, color: C.ink }}>
                    <CountUp to={s.to} format={s.format} />
                  </div>
                  <div className="mt-2 text-sm md:text-base" style={{ color: C.slate }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.3} className="max-w-[1180px] mx-auto mt-6 text-center">
          <p className="text-sm md:text-base" style={{ color: C.slate }}>
            Presence across Chennai, Coimbatore, Tirunelveli, Kanyakumari and rapidly growing
            investment corridors throughout Tamil Nadu.
          </p>
        </Reveal>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="px-4 md:px-6 pb-10">
        <Reveal
          className="max-w-[1180px] mx-auto rounded-[28px] overflow-hidden grid md:grid-cols-2"
          style={{ backgroundColor: C.panel }}
        >
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span style={{ width: 46, height: 4, background: C.blue, borderRadius: 4, display: 'block' }} />
            <h2 className="mt-6 text-3xl md:text-4xl font-bold leading-tight" style={{ ...display, color: C.ink }}>
              Ready to Build Your Future With Us?
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: C.slate }}>
              Because at OmShakthy Homes, we believe every great future begins with the right
              piece of land. Let us help you find your dream property or next investment
              opportunity.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/projects" className="px-6 py-3 rounded-full font-semibold text-white text-sm" style={{ backgroundColor: C.ink }}>
                View Projects
              </a>
              <a href="/contact" className="px-6 py-3 rounded-full font-semibold text-sm border" style={{ borderColor: C.ink, color: C.ink }}>
                Contact Us
              </a>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <img src="/footer-mono.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.9 }} />
          </div>
        </Reveal>
      </section>
    </main>
  )
}

export default AboutContent
