'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'

/* ------------------------------------------------------------------
   Omshakthy Brand Guidelines V1.0 — Direction 01 · Heritage Indigo
   ------------------------------------------------------------------ */
const C = {
  ink: '#025f8a', // Deep Ink (primary dark)
  paper: '#F8F8F5', // Paper White
  brass: '#C9A227', // Brass (accent — earn the colour)
  cream: '#F8F8F5', // Warm Cream
  mist: '#8DB4D1', // Mist Blue (accent only)
  field: '#2D6A3F', // Field Green (status only)
  paperMuted: 'rgba(251, 248, 242, 0.66)',
  inkMuted: 'rgba(11, 31, 58, 0.68)',
  hairLight: 'rgba(200, 161, 90, 0.45)',
  hairDark: 'rgba(251, 248, 242, 0.18)',
}

const display: React.CSSProperties = {
  fontFamily: "'Fraunces', Georgia, serif",
  lineHeight: 1.02,
  letterSpacing: '-0.01em',
  fontWeight: 400,
}
const body: React.CSSProperties = {
  fontFamily: "'Inter', Helvetica, Arial, sans-serif",
  lineHeight: 1.6,
  fontWeight: 400,
}
const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', Consolas, monospace",
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontSize: '0.72rem',
  fontWeight: 400,
}

/* ---------- Motion helpers ---------- */
const easeLux = [0.16, 1, 0.3, 1] as const

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

  // Don't animate on the server — render content visible immediately.
  // Once hydrated, enable scroll-reveal animations.
  if (!mounted) {
    return <div className={className} style={style}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: easeLux } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12%' }}
    >
      {children}
    </motion.div>
  )
}

const Kicker = ({ children, color = C.brass }: { children: React.ReactNode; color?: string }) => (
  <span className="block mb-4" style={{ ...mono, color }}>
    {children}
  </span>
)

/* ---------- Count-up figure ---------- */
const CountUp = ({
  to,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
}: {
  to: number
  format?: (n: number) => string
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{format(val)}</span>
}

/* ---------- Marquee ticker ---------- */
const TICK = 'Generating Real Assets ✦ Since 1991 ✦ Clear Title ✦ DTCP Approved ✦ Chennai · Thiruvallur · Kanchipuram ✦ '
const Marquee = () => (
  <div
    className="overflow-hidden py-4"
    style={{ backgroundColor: C.paper, color: C.ink, borderTop: `1px solid ${C.hairLight}`, borderBottom: `1px solid ${C.hairLight}` }}
  >
    <motion.div
      className="flex whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
    >
      <span style={{ ...mono, color: C.brass, fontSize: '0.8rem' }}>{TICK.repeat(3)}</span>
      <span style={{ ...mono, color: C.brass, fontSize: '0.8rem' }}>{TICK.repeat(3)}</span>
    </motion.div>
  </div>
)

const Regalia = () => {
  // Set page background to ink on mount
  useEffect(() => {
    document.body.style.backgroundColor = C.paper
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  /* Page scroll progress */
  const { scrollYProgress } = useScroll()

  /* Hero parallax */
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const videoScale = useTransform(heroProgress, [0, 1], [1, 1.18])
  const videoY = useTransform(heroProgress, [0, 1], ['0%', '14%'])
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -140])
  const heroTextOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])
  const ghostY = useTransform(heroProgress, [0, 1], [0, -260])

  /* Story watermark parallax */
  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  })
  const storyGhostY = useTransform(storyProgress, [0, 1], [120, -120])

  return (
    <div style={{ backgroundColor: C.paper, color: C.ink, ...body }}>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0% 50%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: C.brass,
          zIndex: 1002,
        }}
      />

      {/* ---------------- Cinematic hero ---------------- */}
      <div ref={heroRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: C.ink }}>
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale: videoScale, y: videoY }}
          src="/regalia-video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={(e) => {
            // freeze on the final frame instead of looping
            const v = e.currentTarget
            v.pause()
            if (v.duration) v.currentTime = v.duration
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(11,31,58,0.94) 4%, rgba(11,31,58,0.25) 45%, rgba(11,31,58,0.4))' }}
        />

        {/* Giant outlined wordmark — overlaps the video (text/background layering) */}
        <motion.div
          style={{ y: ghostY }}
          className="absolute inset-x-0 bottom-24 md:bottom-28 flex justify-center pointer-events-none select-none"
        >
          <span
            style={{
              ...display,
              fontWeight: 300,
              fontSize: 'clamp(4rem, 20vw, 20rem)',
              color: 'transparent',
              WebkitTextStroke: `1px ${C.brass}`,
              opacity: 0.28,
              lineHeight: 0.8,
              letterSpacing: '0.02em',
            }}
          >
            REGALIA
          </span>
        </motion.div>

        {/* Foreground hero copy */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="absolute bottom-16 left-6 md:left-16 max-w-3xl"
        >
          <motion.span
            className="block mb-4"
            style={{ ...mono, color: C.brass }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeLux }}
          >
            Now Open · Avadi, Chennai
          </motion.span>
          <motion.h1
            className="text-5xl md:text-8xl"
            style={{ ...display, color: C.paper, fontWeight: 300 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: easeLux }}
          >
            Omshakthy Regalia
          </motion.h1>
          <motion.p
            className="mt-5 text-base md:text-xl"
            style={{ ...body, color: C.paperMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeLux }}
          >
            Plots you can walk. Papers you can trust.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ ...mono, color: C.paperMuted, fontSize: '0.6rem' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll
        </motion.div>
      </div>

      {/* ---------------- Brand story (ink, pulled up over hero) ---------------- */}
      <div
        ref={storyRef}
        className="relative -mt-16 rounded-t-[2.5rem] overflow-hidden"
        style={{ backgroundColor: C.paper, boxShadow: '0 -40px 80px rgba(11,31,58,0.6)' }}
      >
        {/* parallax ghost number */}
        <motion.span
          style={{
            ...display,
            y: storyGhostY,
            position: 'absolute',
            right: '-2%',
            top: '10%',
            fontSize: 'clamp(8rem, 30vw, 28rem)',
            color: 'transparent',
            WebkitTextStroke: `1px ${C.hairLight}`,
            opacity: 0.5,
            pointerEvents: 'none',
            lineHeight: 0.8,
          }}
        >
          01
        </motion.span>

        <section className="relative px-6 md:px-16 py-28 max-w-4xl mx-auto">
          <Reveal>
            <Kicker>Generating Real Assets</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-3xl md:text-5xl mb-8" style={{ ...display, color: C.ink, fontWeight: 300 }}>
              We don't sell plots. We help families plant something that outlives us.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ color: C.inkMuted }}>
              Omshakthy begins with a simple conviction — that the most honest wealth a family can
              build is rooted, measured in acres not algorithms. From DTCP-approved layouts to gated
              farm communities, every project is a promise: clear title, transparent paperwork, and
              guidance from a team that treats each buyer like a life-long neighbour.
            </p>
          </Reveal>
        </section>
      </div>

      {/* ---------------- Marquee ---------------- */}
      <Marquee />

      {/* ---------------- Key figures (paper) — animated count-up ---------------- */}
      <section className="px-6 md:px-16 py-24" style={{ backgroundColor: C.ink, color: C.paper }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker>By The Numbers</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 300 }}>
              Thirty-plus years. Zero title disputes.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
            {[
              { to: 7500, unit: 'Acres', label: 'Successfully aggregated & developed', plus: true },
              { to: 30, unit: 'Projects', label: 'Landmark projects delivered', plus: true },
              { to: 2, unit: 'Lakh+ Sq.Ft', label: 'Commercial space leased' },
              { to: 7500, unit: 'Customers', label: 'Happy customers since 1991', plus: true },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-4xl md:text-6xl" style={{ ...display, color: C.paper }}>
                    <CountUp to={s.to} />
                  </span>
                  {s.plus && (
                    <span className="text-3xl md:text-5xl" style={{ ...display, color: C.brass }}>
                      +
                    </span>
                  )}
                </div>
                <p className="mt-2" style={{ ...mono, color: C.brass, fontSize: '0.66rem' }}>{s.unit}</p>
                <p className="mt-3" style={{ ...body, color: C.paperMuted, fontSize: '0.9rem' }}>{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- What we do (ink) — editorial sticky scroll ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20 items-start">
          {/* Sticky heading */}
          <div className="md:sticky md:top-28 md:self-start">
            <Kicker>What We Do</Kicker>
            <h2 className="text-3xl md:text-5xl" style={{ ...display, color: C.ink, fontWeight: 300 }}>
              Paper first. Promise second.
            </h2>
            <p className="mt-6" style={{ color: C.inkMuted }}>
              Four disciplines, one standard — legally verified, patiently built, transparently
              handed over.
            </p>
          </div>

          {/* Scrolling items */}
          <div className="space-y-20">
            {[
              {
                n: '01',
                title: 'Land Aggregation',
                text: 'With over 20 years of experience, Omshakthy is a reliable land promoter in Chennai. Extensive local research and a deep understanding of value let us identify high-potential land with every legal clearance in place.',
                hl: 'Aggregated more than 7,500 Acres',
              },
              {
                n: '02',
                title: 'Residential Developments',
                text: 'Every residential project should generate enduring value for homeowners and investors alike — quality infrastructure, community living and patient, long-term appreciation.',
                hl: '30+ Landmark Projects Delivered',
              },
              {
                n: '03',
                title: 'Hospitality Management',
                text: 'Professionally managed hospitality ventures that deliver seamless guest experiences, led by a well-trained team.',
                hl: '2 Three-Star Hotels · 90 Premium Rooms',
              },
              {
                n: '04',
                title: 'Commercial Projects',
                text: 'Transparency, prompt execution and statutory compliance from design to delivery — commercial spaces built to foster enduring business success.',
                hl: 'Over 2 Lakh Sq. Ft. leased',
              },
            ].map((d, i) => (
              <Reveal key={d.title} delay={i * 0.05}>
                <div className="relative pl-8" style={{ borderLeft: `2px solid ${C.brass}` }}>
                  <span
                    className="absolute -top-6 right-0"
                    style={{ ...display, color: C.hairLight, fontSize: '4rem', fontWeight: 300 }}
                  >
                    {d.n}
                  </span>
                  <h3 className="text-2xl md:text-4xl mb-4" style={{ ...display, color: C.ink }}>
                    {d.title}
                  </h3>
                  <p className="mb-4" style={{ color: C.inkMuted }}>{d.text}</p>
                  <p style={{ ...mono, color: C.brass }}>{d.hl}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Since 1991 (paper, oversized statement) ---------------- */}
      <section className="px-6 md:px-16 py-28 text-center" style={{ backgroundColor: C.ink, color: C.paper }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <Kicker>Est. 1991 · Chennai</Kicker>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 300 }}>
              Incorporated in 1991 to consolidate land for the future — industries, Special Economic
              Zones and residential spaces around the prime corridors of the city.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Project highlights (ink, mist accents + hover) ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.paper, color: C.ink }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker>Why Regalia</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.ink }}>
              Project Highlights
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {['Clear Title', 'CMDA & DTCP Approved', 'Fast-Growing Location', 'Modern Amenities', 'Blacktop Roads'].map(
              (h, i) => (
                <Reveal key={h} delay={i * 0.07} className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center text-lg cursor-default"
                    style={{ border: `1.3px solid ${C.mist}` }}
                    initial={{ backgroundColor: 'rgba(141,180,209,0)', color: C.mist }}
                    whileHover={{ backgroundColor: C.mist, color: C.ink, scale: 1.1, rotate: 90 }}
                    transition={{ duration: 0.4, ease: easeLux }}
                  >
                    ✦
                  </motion.div>
                  <p style={{ ...mono, color: C.ink, fontSize: '0.66rem' }}>{h}</p>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Mission / Vision (paper) ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.ink, color: C.paper }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { t: 'Our Mission', p: 'To turn every rupee of trust into a real, title-clear asset that lasts for generations.' },
            { t: 'Our Vision', p: "To be South India's most trusted steward of land — where legacy is engineered, not imagined." },
          ].map((m, i) => (
            <Reveal key={m.t} delay={i * 0.1}>
              <Kicker>{m.t}</Kicker>
              <p className="text-2xl md:text-3xl" style={{ ...display, color: C.paper, fontWeight: 300 }}>
                {m.p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Leadership (ink) ---------------- */}
      <section className="px-6 md:px-16 py-28 max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <Kicker>The People</Kicker>
          <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.ink }}>
            Leadership
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: C.hairLight }}>
          {[
            {
              name: 'R. Ramachanthran',
              role: 'Founder',
              points: [
                'Founded Omshakthy Agencies (Madras) Pvt Ltd in 1991',
                'Preferred land aggregator for corporates & State Government',
                'Over 3 decades in Real Estate, Construction and Hospitality',
              ],
            },
            {
              name: 'N R Manigantan',
              role: 'Managing Director',
              points: [
                'More than 2 decades in Real Estate & Construction',
                'Extensive knowledge in land acquisition & agglomeration',
                'Clear vision on industrial infrastructure & asset building',
              ],
            },
            {
              name: 'Rajib Kumar Hota',
              role: 'Executive Director',
              points: [
                'Post-graduate from Delhi University; enrolled with the Bar Council',
                'Diploma in MBA from LIBA',
                'Independent Director on several boards',
              ],
            },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} className="p-10" style={{ backgroundColor: C.ink }}>
              <h3 className="text-xl md:text-2xl" style={{ ...display, color: C.paper }}>
                {p.name}
              </h3>
              <p className="mt-2 mb-6" style={{ ...mono, color: C.brass }}>{p.role}</p>
              <ul className="space-y-3" style={{ color: C.paperMuted, fontSize: '0.9rem' }}>
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span style={{ color: C.brass }}>—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ (paper) ---------------- */}
      <section className="px-6 md:px-16 py-28" style={{ backgroundColor: C.ink, color: C.paper }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <Kicker>Good to Know</Kicker>
            <h2 className="text-2xl md:text-4xl" style={{ ...display, color: C.paper, fontWeight: 300 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div>
            {[
              {
                q: 'Is Omshakthy a trusted real estate developer in Chennai?',
                a: 'Omshakthy Homes (a division of Omshakthy Agencies, established 1991) has served more than 20,000 customers across several RERA-registered residential plots and apartment projects.',
              },
              {
                q: 'Is Omshakthy RERA registered?',
                a: 'Yes. All projects are individually registered with TNRERA. Omshakthy Regalia holds RERA ID TN/1/Layout/2490/2025 — verifiable on the official TNRERA portal.',
              },
              {
                q: 'How long has Omshakthy been in the business?',
                a: 'Omshakthy Agencies (Madras) Pvt Ltd traces its roots to 1991 and carries more than 30 years of experience in the Chennai land market.',
              },
              {
                q: 'Where is Omshakthy located?',
                a: 'No. 14, Second Main Road, Anna Nagar East, Chennai · 600 102. Call to arrange an office visit or a Saturday site walk.',
              },
              {
                q: 'Can NRIs buy plots from Omshakthy?',
                a: 'Yes. NRIs can invest subject to standard RBI and FEMA guidelines governing NRI property purchases in India.',
              },
            ].map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="py-7" style={{ borderTop: `1px solid ${C.hairLight}` }}>
                  <h3 className="text-lg md:text-xl mb-3" style={{ ...display, color: C.paper }}>
                    {f.q}
                  </h3>
                  <p style={{ color: C.paperMuted }}>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Contact (ink) ---------------- */}
      <section className="px-6 md:px-16 py-24 text-center" style={{ backgroundColor: C.paper, color: C.ink }}>
        <Reveal>
          <Kicker>Get in Touch</Kicker>
          <p className="text-2xl md:text-4xl mb-4" style={{ ...display, color: C.ink, fontWeight: 300 }}>
            Omshakthy Agencies (Madras) Pvt Ltd
          </p>
          <p style={{ ...mono, color: C.inkMuted, fontSize: '0.7rem' }}>
            No. 14, Second Main Road · Anna Nagar East · Chennai 600 102
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4" style={{ ...mono, color: C.brass }}>
            <a href="tel:04440303040" className="hover:opacity-70">044 40303040</a>
            <span style={{ color: C.hairLight }}>·</span>
            <a href="mailto:marketing@omshakthy.net" className="hover:opacity-70">marketing@omshakthy.net</a>
          </div>
          <p className="mt-10" style={{ ...mono, color: C.inkMuted, fontSize: '0.66rem' }}>
            Generating Real Assets
          </p>
        </Reveal>
      </section>
    </div>
  )
}

export default Regalia
