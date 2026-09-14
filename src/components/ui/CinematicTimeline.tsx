'use client'
import { useEffect, useRef, useState } from 'react'
import './CinematicTimeline.css'

const milestones = [
  {
    year: '1991',
    title: 'The Beginning',
    // **bold** marks the highlighted phrase — see renderDescription() below.
    description: 'Founded **OmShakthy Agencies (Madras) Pvt. Ltd.,** marking the beginning of a legacy in creating enduring real assets.',
    stat: '1',
    statLabel: 'Company Founded',
    // .webp, not .jpg — JPEG's block compression visibly bands the smooth
    // white-panel gradient on this image (confirmed: the .jpg export shows
    // a banding line the source .png doesn't have). .webp handles it
    // cleanly and comes in smaller besides.
    image: '/timeline-1991.webp',
    // All 6 background images have had their baked-in text removed and
    // replaced by the live .ct-slide__content overlay below.
    textFree: true,
  },
  {
    year: '1993',
    title: 'SIDCO Partnership',
    description: 'Acquired **350 acres** for **SIDCO**, establishing credibility and laying the foundation for enduring partnerships.',
    stat: '350',
    statLabel: 'Acres Acquired',
    image: '/timeline-1993.webp',
    textFree: true,
  },
  {
    year: '1997',
    // \n here forces "World City" onto its own line in .ct-slide__title
    // (see renderTitle() below) — harmless everywhere else this field is
    // used as plain text (.ct-bar__bigyear-label), where it just
    // collapses to whitespace like any other newline in inline HTML text.
    title: 'Mahindra\nWorld City',
    description: 'Acquired 2000 acres for Mahindra World City SEZ without litigation.',
    stat: '2,000',
    statLabel: 'Acres for SEZ',
    image: '/timeline-1997.webp',
    textFree: true,
  },
  {
    year: '1998',
    title: 'Construction Era',
    description: 'Entered construction, winning projects close to 5 million sq.ft.',
    stat: '5M',
    statLabel: 'Sq.Ft Projects',
    image: '/timeline-1998.webp',
    textFree: true,
  },
  {
    year: '2000',
    title: 'Corporate Giants',
    description: 'Partnered with **Pepsi** and **Reliance** across Tamil Nadu.',
    stat: '40',
    statLabel: 'Acres for Pepsi',
    image: '/timeline-2000.webp',
    textFree: true,
  },
  {
    year: '2024',
    title: 'Legacy Continues',
    description: 'Over **5,000+** acres of land aggregated.',
    stat: '5,000+',
    statLabel: 'Acres Aggregated',
    image: '/timeline-2024.webp',
    textFree: true,
  },
]

// Splits a description on **bold** markers and renders the marked
// portion as <strong>. Plain string in, JSX out — keeps the milestones
// data readable instead of forcing each description into an array of
// pre-split fragments.
function renderDescription(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// Splits a title on \n and renders each segment on its own line via <br>.
// Only used for .ct-slide__title — other places that read m.title
// (.ct-bar__bigyear-label) render it as plain text, where a literal \n
// just collapses to whitespace like normal inline HTML.
function renderTitle(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ))
}

const CinematicTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  // Keep ref in sync
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Expose a handler PageController can call. Returns true if the timeline
  // consumed the scroll (still has milestones left in that direction),
  // false if it's at a boundary and PageController should move sections.
  //
  // __timelineReset is separate and intentional: PageController calls it
  // specifically when the user backs OUT of LeadersSection into this one
  // (Leadership -> Timeline, scrolling up) — re-entering should always
  // restart at 1991, not resume wherever the timeline was left (e.g. still
  // on 2024 from having scrolled all the way through it earlier). This
  // used to also fire on every up-tick while already INSIDE the timeline,
  // which is what caused a real bug (a single accidental up-blip ejecting
  // the user to a different section entirely, read as the timeline
  // "skipping") — that part was removed; only the Leadership-re-entry
  // case calls this now.
  useEffect(() => {
    (window as any).__timelineAdvance = (dir: number) => {
      const next = activeIndexRef.current + dir
      if (next >= 0 && next < milestones.length) {
        setActiveIndex(next)
        return true // consumed
      }
      return false // boundary — let page move
    }
    ;(window as any).__timelineReset = () => {
      setActiveIndex(0)
    }
    return () => {
      delete (window as any).__timelineAdvance
      delete (window as any).__timelineReset
    }
  }, [])

  return (
    <div className="ct-section">
      <div
        className="ct-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {milestones.map((m, i) => (
          <div
            // ct-slide--<year> is a per-slide styling hook — lets any of the
            // six milestones get its own CSS override (font-size, spacing,
            // position, whatever) without touching the other five, on top
            // of the shared .ct-slide__* baseline rules in the CSS file.
            className={`ct-slide ct-slide--${m.year} ${i === activeIndex ? 'ct-slide--active' : ''}`}
            key={i}
          >
            <div className="ct-slide__bgwrap">
              <div
                className="ct-slide__bg"
                style={{
                  backgroundImage: `url(${m.image})`,
                  backgroundPosition: m.image === '/timeline-1997.webp' ? 'center 22%' : m.image === '/timeline-1998.webp' ? 'center 40%' : ['/timeline-1993.webp', '/timeline-2000.webp', '/timeline-2024.webp'].includes(m.image) ? 'center 30%' : 'center',
                  backgroundSize: 'cover',
                }}
              />
            </div>
            <div className="ct-slide__overlay" />
            {m.textFree && (
              <div className="ct-slide__content">
                <div className="ct-slide__year-display">{m.year}</div>
                <div className="ct-slide__underline" />
                <div className="ct-slide__title">{renderTitle(m.title)}</div>
                <div className="ct-slide__dash" />
                <p className="ct-slide__desc">{renderDescription(m.description)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Innovative timeline progress bar */}
      <div className="ct-bar">
        {/* Big morphing year on the left */}
        <div className="ct-bar__bigyear">
          <span className="ct-bar__bigyear-text" key={activeIndex}>
            {milestones[activeIndex].year}
          </span>
          <span className="ct-bar__bigyear-label">{milestones[activeIndex].title}</span>
        </div>

        {/* Segmented liquid-fill progress */}
        <div className="ct-bar__segments">
          {milestones.map((m, i) => (
            <button
              key={i}
              className={`ct-seg ${i === activeIndex ? 'ct-seg--active' : ''} ${i < activeIndex ? 'ct-seg--done' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className="ct-seg__fill" />
              <span className="ct-seg__year">{m.year}</span>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="ct-bar__counter">
          <span className="ct-bar__counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="ct-bar__counter-total">/ {String(milestones.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

export default CinematicTimeline
