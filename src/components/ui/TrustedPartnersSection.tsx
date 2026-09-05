'use client'
import { useEffect, useRef, useState } from 'react'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './TrustedPartnersSection.css'

const pillars = [
  {
    title: 'Land Aggregation',
    desc: 'Immense knowledge of land and its value, sound research and extended expertise in the realms of real estate properties.',
    image: '/tp/tp-land-aggregation.jpg',
  },
  {
    title: 'Residential Development',
    desc: 'Utmost care in revitalization efforts to improve community life across all residential projects that are undertaken.',
    image: '/tp/tp-residential.jpg',
  },
  {
    title: 'Hospitality Management',
    desc: 'Qualified and well trained individuals that provide quick and relevant solutions for all forms of support services.',
    image: '/tp/tp-hospitality-facade.jpg',
  },
  {
    title: 'Commercial Projects',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    image: '/tp/tp-commercial.jpg',
  },
  {
    title: 'Supply Chain Management',
    desc: 'Complete transparency in price, regulations, schedule and documentation allows for smooth execution of commercial projects.',
    image: '/tp/tp-supply-chain.jpg',
  },
]

const ROTATE_MS = 4200

const TrustedPartnersSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const built = useSectionEnter(sectionRef, 150)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    // Same guard the rest of this codebase uses for auto-advancing content
    // (TestimonialsSection, the Odometer) — stop the timer entirely under
    // prefers-reduced-motion, not just the crossfade/type transitions.
    // Hover already pauses it for anyone using a mouse, but there's no
    // equivalent pause control for someone who never hovers at all.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % pillars.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused])

  // data-header-theme="light" — its ivory/"Paper White" gradient bar
  // (this site's own --os-paper token) carries its own opaque-ish backing
  // regardless of what's behind it, so dark ink nav text stays legible
  // over this section's dark photo the same way it does over PriceTrends'
  // actual light background. (An earlier pass used no theme at all,
  // reasoning that "light" was built for light *sections* specifically —
  // true of why it exists, but irrelevant to whether it still works here:
  // what matters is the bar's own ivory backing, not the section under it.)
  return (
    <section ref={sectionRef} className="tp" aria-label="What we do" data-header-theme="light">
      <div className="tp__bg" aria-hidden="true">
        {pillars.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.title}
            src={p.image}
            alt=""
            className={`tp__bg-img${active === i ? ' is-on' : ''}`}
            // All 5 eager, not just the first — this section is held
            // permanently off-screen by PageController's own transform
            // (translateY on the whole track, not real document flow), so
            // the browser's native loading="lazy" intersection check never
            // considers images 1-4 "near the viewport" and never fetches
            // them at all, no matter how long the section sits active and
            // auto-cycling. The .is-on class was toggling correctly the
            // whole time; the photos themselves just never loaded, leaving
            // only the pale scrim visible — that's what read as "cloud."
          />
        ))}
        <span className="tp__bg-scrim" />
      </div>

      <div className={`tp__index${built ? ' is-in' : ''}`}>
        {/* Eyebrow + line pair — same motif LeadersSection and
            TestimonialsSection already use for their own eyebrows, not a
            one-off treatment invented just for this section. */}
        <p className="tp__index-eyebrow">
          <span className="tp__index-eyebrow-line" />
          What We Do
        </p>

        <nav className="tp__index-list" onMouseLeave={() => setPaused(false)}>
          {pillars.map((p, i) => (
            <button
              key={p.title}
              type="button"
              className={`tp__index-row${active === i ? ' is-active' : ''}`}
              onMouseEnter={() => {
                setPaused(true)
                setActive(i)
              }}
              onFocus={() => {
                setPaused(true)
                setActive(i)
              }}
            >
              {/* Large ghost numeral, not the small mono counter this had
                  before — same device RegaliaContent's own "What We Do"
                  section already uses (an oversized faint serif numeral
                  behind each entry), reused here rather than invented,
                  so this reads as more of the site's own established
                  editorial language instead of a generic list-with-a-
                  counter treatment. */}
              <span className="tp__index-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="tp__index-title">{p.title}</span>
              <span className="tp__index-desc">{p.desc}</span>
              {/* Story-style progress fill — only rendered for whichever
                  row is active, keyed on `active` so React remounts it
                  (restarting the CSS animation from 0) every time a new
                  row takes over, instead of a plain fade that gives no
                  sense of the auto-advance actually being timed. */}
              {active === i && (
                <span
                  key={active}
                  className={`tp__index-progress${paused ? ' is-paused' : ''}`}
                  style={{ animationDuration: `${ROTATE_MS}ms` }}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default TrustedPartnersSection
