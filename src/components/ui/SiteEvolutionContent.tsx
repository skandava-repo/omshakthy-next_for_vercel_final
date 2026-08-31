'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import './SiteEvolutionContent.css'

/* "What We Do" — v7. Every version before this one (a photo accordion,
   a site-plan of hover tiles, a field-log of Polaroids, a capability
   ledger, a heavy-motion cursor/marquee/sticky-stack page) shared the
   same bone structure underneath whatever skin sat on top: five
   interchangeable items arranged in a container — a grid, a gallery, a
   list, a stack of full-screen cards. Restyling that structure five
   times is why every version still read as a template with this
   company's words dropped in.

   This one has no container of five items at all. It's one continuous
   line drawing of a single site — a plot of land, a road, a rooftop —
   that draws itself in as you scroll, gaining one more piece of detail
   at each of the five disciplines: the plot is surveyed, a home rises
   on it, a hospitality space joins it, a commercial tower goes up
   beside it, a supply route threads underneath all of it. By the end
   you're looking at one finished small skyline built from five
   disciplines, which is literally the company's actual pipeline (land
   to keys, in that order) rather than a services list — the form of
   the page IS the content, not a container the content was poured
   into. Built with framer-motion's scroll-linked `pathLength`, a
   different technique than every previous attempt used (an SVG line
   drawing itself, not a card/tile/panel doing something on hover). No
   custom cursor, no marquee, no decorative-only flourishes — one idea,
   done with restraint, because throwing in every trend at once is what
   made the last page read as trying too hard rather than considered. */

interface Step {
  code: string
  title: string
  copy: string
}

const steps: Step[] = [
  { code: '01', title: 'Land Aggregation', copy: 'Every address starts as a plot on a map — appraised, verified, title-clear.' },
  { code: '02', title: 'Residential Development', copy: 'Then it becomes a place someone actually calls home.' },
  { code: '03', title: 'Hospitality Management', copy: 'A space people choose to return to, run by our own trained teams.' },
  { code: '04', title: 'Commercial Projects', copy: 'Business finds its own address on the same site.' },
  { code: '05', title: 'Supply Chain Management', copy: 'And everything it took to build all of it arrived on schedule.' },
]

const Step = ({ step, index }: { step: Step; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-42% 0px -42% 0px' })

  return (
    <div ref={ref} className={`se__step${inView ? ' is-active' : ''}`}>
      <span className="se__step-dot" aria-hidden="true" />
      <span className="se__step-code">{step.code} / 05</span>
      <h2 className="se__step-title">{step.title}</h2>
      <p className="se__step-copy">{step.copy}</p>
      {index === steps.length - 1 && (
        <p className="se__step-close">One site. Five disciplines. Thirty years of building it this way.</p>
      )}
    </div>
  )
}

const SiteEvolutionContent = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  const p1 = useTransform(scrollYProgress, [0, 0.16], reduce ? [1, 1] : [0, 1])
  const p2 = useTransform(scrollYProgress, [0.14, 0.34], reduce ? [1, 1] : [0, 1])
  const p3 = useTransform(scrollYProgress, [0.32, 0.5], reduce ? [1, 1] : [0, 1])
  const p4 = useTransform(scrollYProgress, [0.48, 0.7], reduce ? [1, 1] : [0, 1])
  const p5 = useTransform(scrollYProgress, [0.68, 0.9], reduce ? [1, 1] : [0, 1])

  return (
    <main className="se" data-header-theme="light">
      <header className="se__intro">
        <p className="se__eyebrow">What We Do</p>
        <h1 className="se__title">One site, built five ways.</h1>
        <p className="se__sub">
          Scroll — the drawing on the right fills in one discipline at a time, in the order it
          actually happens on the ground.
        </p>
      </header>

      <div className="se__scroller" ref={trackRef}>
        <div className="se__illustration">
          <svg viewBox="0 0 640 320" className="se__svg" role="img" aria-label="A site drawn in stages: a surveyed plot, a home, a hospitality space, a commercial tower and a supply route.">
            {/* 01 — surveyed plot: boundary + corner markers */}
            <motion.path className="se__ln" style={{ pathLength: p1 }} d="M52,262 L588,262" />
            <motion.path className="se__ln" style={{ pathLength: p1 }} d="M96,110 L96,262 M96,110 L560,110 L560,262" />
            <motion.path className="se__ln se__ln--soft" style={{ pathLength: p1 }} d="M96,120 L96,110 L106,110" />
            <motion.path className="se__ln se__ln--soft" style={{ pathLength: p1 }} d="M550,110 L560,110 L560,120" />

            {/* 02 — residential block rises on the plot */}
            <motion.path className="se__ln" style={{ pathLength: p2 }} d="M170,262 L170,180 L258,180 L258,262" />
            <motion.path className="se__ln" style={{ pathLength: p2 }} d="M158,180 L214,140 L270,180" />
            <motion.rect className="se__ln" style={{ pathLength: p2 }} x="188" y="208" width="16" height="16" />
            <motion.rect className="se__ln" style={{ pathLength: p2 }} x="222" y="208" width="16" height="16" />

            {/* 03 — a hospitality flourish beside it */}
            <motion.path className="se__ln" style={{ pathLength: p3 }} d="M120,262 L120,222" />
            <motion.path className="se__ln" style={{ pathLength: p3 }} d="M100,222 Q120,200 140,222" />

            {/* 04 — a commercial tower goes up */}
            <motion.path className="se__ln" style={{ pathLength: p4 }} d="M356,262 L356,98 L424,98 L424,262" />
            <motion.path className="se__ln" style={{ pathLength: p4 }} d="M390,98 L390,82" />
            <motion.path className="se__ln se__ln--soft" style={{ pathLength: p4 }} d="M356,150 L424,150 M356,200 L424,200" />

            {/* 05 — a supply route threads underneath everything */}
            <motion.path className="se__ln se__ln--gold" style={{ pathLength: p5 }} d="M40,290 L600,290" />
            <motion.g style={{ opacity: p5 }}>
              <rect className="se__ln se__ln--gold" x="236" y="278" width="26" height="12" rx="2" />
              <circle className="se__ln se__ln--gold" cx="244" cy="292" r="3" />
              <circle className="se__ln se__ln--gold" cx="256" cy="292" r="3" />
              <rect className="se__ln se__ln--gold" x="452" y="278" width="26" height="12" rx="2" />
              <circle className="se__ln se__ln--gold" cx="460" cy="292" r="3" />
              <circle className="se__ln se__ln--gold" cx="472" cy="292" r="3" />
            </motion.g>
          </svg>
        </div>

        <div className="se__steps">
          {steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default SiteEvolutionContent
