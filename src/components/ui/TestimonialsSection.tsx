'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, motion, AnimatePresence } from 'framer-motion'
import './TestimonialsSection.css'

interface Review {
  quote: string
  name: string
  detail: string
  photo: string
  rating: number
  // No real video files exist per customer yet — `video: true` just adds a
  // small play-icon hint on that person's tile; the featured card itself
  // still just shows their written quote (there's nothing to play).
  video?: boolean
  videoDuration?: string
}

// Content sourced from the Figma "Customer Stories" section.
// NOTE: `photo` images in /public/testimonials are royalty-free placeholders
// (randomuser.me). Swap them for real customer / licensed Indian portraits.
// PLACEHOLDER PASS: every quote below has had a clearly-marked dummy
// second half appended (bracketed note + lorem ipsum) to roughly double
// its length, at the user's own request, purely to preview how the
// featured card reads/lays out with longer content — the user is
// swapping this filler for the real expanded quotes afterwards. Nothing
// past "[PLACEHOLDER — replace with the rest of the real quote.]" on
// each entry is an actual customer's words.
const reviews: Review[] = [
  {
    quote:
      'Owning a flat in Santha Towers is a symbol of security for my retired life. The team was transparent, on-time and truly cared. [PLACEHOLDER — replace with the rest of the real quote.] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    name: 'Jalaja Madanmohan',
    detail: 'B103 – OmShakthy Santha Towers',
    photo: '/testimonials/jalaja.png',
    rating: 5,
  },
  {
    quote:
      "They went above and beyond — providing reticulated gas at no extra cost even though it wasn't part of the original agreement. That's OmShakthy. [PLACEHOLDER — replace with the rest of the real quote.] Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    name: 'D. Dhanasekaran',
    detail: 'OmShakthy Santha Towers',
    photo: '/testimonials/dhanasekaran.png',
    rating: 5,
    video: true,
    videoDuration: '0:48',
  },
  {
    quote:
      'We invested in Regalia at launch price. In 18 months, the land value has appreciated by over 22%. Best investment of my life. [PLACEHOLDER — replace with the rest of the real quote.] Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    name: 'Suresh Rajan',
    detail: 'OmShakthy Regalia, Avadi',
    photo: '/testimonials/suresh.png',
    rating: 5,
  },
  {
    quote:
      'The construction quality is exceptional. Every detail shows their commitment to excellence and customer satisfaction. [PLACEHOLDER — replace with the rest of the real quote.] Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    name: 'Priya Sharma',
    detail: 'OmShakthy Heights',
    photo: '/testimonials/priya.png',
    rating: 5,
    video: true,
    videoDuration: '1:05',
  },
  {
    quote:
      'Great location, amazing amenities, and the after-sales service is outstanding. I recommend OmShakthy to all my friends. [PLACEHOLDER — replace with the rest of the real quote.] Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    name: 'Rajesh Kumar',
    detail: 'OmShakthy Crown',
    photo: '/testimonials/rajesh.png',
    rating: 5,
  },
  {
    quote:
      'The best real estate investment I could have made. OmShakthy delivered exactly what they promised. [PLACEHOLDER — replace with the rest of the real quote.] Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit, sed quia.',
    name: 'Anitha Patel',
    detail: 'OmShakthy Residency',
    photo: '/testimonials/anitha.jpg',
    rating: 5,
    video: true,
    videoDuration: '0:36',
  },
  {
    quote:
      'Getting the keys to our first home together was one of the happiest days of our lives. OmShakthy made the entire journey smooth, transparent and stress-free. [PLACEHOLDER — replace with the rest of the real quote.] At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.',
    name: 'Vikram & Meera Iyer',
    detail: 'OmShakthy Meadows, Guduvancheri',
    photo: '/testimonials/vikram-meera.jpg',
    rating: 5,
    video: true,
    videoDuration: '0:52',
  },
]

// Tiles are video-testimonials only now — only 4 of the 7 reviews above
// have `video: true`. Padded to 6 (3-and-3 tile columns) by repeating the
// existing video reviews as a dev-stage placeholder, per instruction,
// until enough real video-testimonial customers exist to fill 6 distinct
// slots. Written dynamically (not two hardcoded duplicate entries) so it
// keeps working correctly once more real video reviews get added above —
// it'll just repeat less, then stop repeating once there are 6+.
const videoReviews: Review[] = (() => {
  const withVideo = reviews.filter((r) => r.video)
  const padded = [...withVideo]
  let i = 0
  while (padded.length < 6) {
    padded.push(withVideo[i % withVideo.length])
    i++
  }
  return padded.slice(0, 6)
})()

const Stars = ({ n }: { n: number }) => (
  <span className="tw-stars" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < n ? 'is-on' : ''} aria-hidden>
        ★
      </span>
    ))}
  </span>
)

// Odometer digit reel — each digit spins through 0-9 and lands on its value.
const ROLLS = 2 // full 0-9 cycles before settling
const CELL = 1.7 // reel cell height in em (tall enough that big serif/italic
// glyphs sit fully inside the window with margin above & below)

const DigitReel = ({
  digit,
  play,
  delay,
}: {
  digit: number
  play: boolean
  delay: number
}) => {
  // sequence: ROLLS full cycles of 0-9, then 0..digit so it lands on `digit`
  const seq: number[] = []
  for (let r = 0; r < ROLLS; r++) for (let i = 0; i < 10; i++) seq.push(i)
  for (let i = 0; i <= digit; i++) seq.push(i)
  const landIndex = seq.length - 1

  return (
    <span className="reel" aria-hidden>
      <motion.span
        className="reel__col"
        initial={{ y: 0 }}
        animate={{ y: play ? `-${landIndex * CELL}em` : 0 }}
        transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {seq.map((n, i) => (
          <span className="reel__digit" key={i}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Renders a formatted value (e.g. "20,000", "4.9") as reels for digits and
// static glyphs for separators. Optional trailing suffix (e.g. "+").
const Odometer = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const play = inView

  let digitCount = 0
  return (
    <span className="odo" ref={ref} aria-label={value + suffix}>
      {value.split('').map((ch, i) => {
        if (ch >= '0' && ch <= '9') {
          const delay = digitCount * 0.12
          digitCount += 1
          if (reduce) {
            return (
              <span className="reel" key={i} aria-hidden>
                <span className="reel__digit">{ch}</span>
              </span>
            )
          }
          return <DigitReel key={i} digit={Number(ch)} play={play} delay={delay} />
        }
        return (
          <span className="odo__sep" key={i} aria-hidden>
            {ch}
          </span>
        )
      })}
      {suffix && (
        <span className="odo__sep" aria-hidden>
          {suffix}
        </span>
      )}
    </span>
  )
}

// Short highlights for the auto-scrolling "wall of love" ribbon.
const highlights = [
  { t: 'Transparent, on-time and truly cared.', n: 'Jalaja M.' },
  { t: 'They went above and beyond.', n: 'D. Dhanasekaran' },
  { t: 'Value up 22% in just 18 months.', n: 'Suresh R.' },
]

/* The featured card is a fixed height (so switching quotes doesn't jump the
   layout), so the quote's type scales to fit it instead — same idea the old
   deck used, kept here for the same reason. */
const quoteSize = (len: number) => {
  const size = 1.55 - Math.max(0, len - 100) * 0.0022
  return `${Math.max(1.25, Math.min(1.55, size)).toFixed(3)}rem`
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
    <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
  </svg>
)

/* One tile in the side columns — its own independent video preview, with
   no relationship to the featured card at all (no shared active index,
   no "now playing" badge). A real <button>, same as the original deck's
   own video-card play button, but with no onClick: there's no actual
   video file for any customer yet (checked — only photos exist in
   public/testimonials), so this is honest structural affordance for
   "this would play a video" rather than a fake handler that does nothing
   when clicked. Native button semantics still give it real keyboard
   focus/hover for free, which a plain aria-hidden div wouldn't. */
function Tile({ review }: { review: Review }) {
  return (
    <button type="button" className="tw-tile" aria-label={`Play video testimonial from ${review.name}`}>
      <img className="tw-tile-photo" src={review.photo} alt="" loading="lazy" />
      <span className="tw-tile-scrim" aria-hidden />
      <span className="tw-tile-play" aria-hidden>
        <PlayIcon />
      </span>
      <span className="tw-tile-name">{review.name}</span>
    </button>
  )
}

/* Large featured card — auto-advances through ALL of `reviews` (all 7,
   written + video ones alike) on its own timer, completely independent
   of the video tiles either side of it: no shared index, no relationship
   to which tile (if any) a screen reader/sighted user is looking at.
   Keyed on `activeKey` (the rotation index) rather than the review's own
   name/identity, purely so Framer always sees a "new" key on every
   advance — irrelevant now that this cycles the full, non-repeating
   `reviews` list (name collisions were only a videoReviews problem), but
   using the index is still the simpler, more obviously-correct choice
   than a value that happens to also be unique here. `reduce` collapses the
   transition to an instant swap, same pattern the Odometer above uses for
   prefers-reduced-motion rather than relying on the CSS media query alone
   (Framer's animate/exit props aren't touched by that media query on
   their own — they need to be told directly).

   The navy card frame (.tw-featured — background, border, shadow, brand
   mark, quote mark) is now completely static; only the actual per-review
   content (.tw-featured-body: quote + cite) is what animates, sliding
   horizontally like flipping through pages inside a fixed window. Earlier
   attempts (a literal 3D rotateY flip, then a fade+scale+drift) both
   moved the ENTIRE card as one rigid block — that's very likely what read
   as unstable/wrong: the whole navy frame jumping or spinning on every
   auto-advance. Keeping the frame still and only sliding the content is
   the more standard, reliably-polished pattern for quote/testimonial
   carousels. Same proven easing curve as before
   (cubic-bezier(0.16,1,0.3,1)) — already used elsewhere in this codebase
   (the original deck's card transitions, LeadersSection's card
   entrances), not reinvented per attempt. */
function FeaturedCard({ review, reduce, activeKey }: { review: Review; reduce: boolean; activeKey: number }) {
  return (
    <div className="tw-featured-stage">
      <article className="tw-featured">
        <div className="tw-featured-brand">
          <img src="/omshakthy-logo.png" alt="" className="tw-featured-brand-mark" />
          OMSHAKTHY
        </div>
        <span className="tw-featured-quotemark" aria-hidden>
          &ldquo;
        </span>
        <div className="tw-featured-body-clip">
          <AnimatePresence>
            <motion.div
              key={activeKey}
              className="tw-featured-body"
              initial={reduce ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -28 }}
              transition={{ duration: reduce ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ '--tw-quote-size': quoteSize(review.quote.length) } as React.CSSProperties}
              aria-live="polite"
            >
              <blockquote className="tw-featured-quote">{review.quote}</blockquote>
              <footer className="tw-featured-cite">
                <div>
                  <span className="tw-featured-name">{review.name}</span>
                  <span className="tw-featured-detail">{review.detail}</span>
                </div>
                <Stars n={review.rating} />
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>
    </div>
  )
}

// How long the featured card holds each testimonial before advancing to
// the next one.
const ROTATE_MS = 5000

const TestimonialsSection = () => {
  const [centerIndex, setCenterIndex] = useState(0)
  const reduce = useReducedMotion()
  // 3 tiles left / 3 right — videoReviews is always padded to exactly 6
  // (see its own comment), so this split is never uneven the way slicing
  // the full 7-review `reviews` array was. No index/state of their own —
  // these are static video previews, independent of the featured card.
  const left = videoReviews.slice(0, 3)
  const right = videoReviews.slice(3, 6)

  // Drives ONLY the featured card, cycling all 7 reviews — entirely
  // separate from the (static) video tiles above. Stopped entirely under
  // prefers-reduced-motion rather than just skipping the transition
  // animation: an auto-advancing carousel with no way to pause it is
  // itself a motion concern, not just the transition between states.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setCenterIndex((a) => (a + 1) % reviews.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <section className="tw" id="testimonials" aria-label="Customer testimonials">
      <div className="tw__aurora" aria-hidden>
        <span className="tw__blob tw__blob--1" />
        <span className="tw__blob tw__blob--2" />
      </div>
      <header className="tw__header">
        <div>
          <span className="tw__eyebrow">Customer Stories</span>
          <h2 className="tw__title">
            Trusted by <em><Odometer value="7,500" suffix="+" /></em> Happy Customers.
          </h2>
        </div>
        <div className="tw__rating">
          <div className="tw__rating-score">
            <Odometer value="4.9" />
          </div>
          <div>
            <Stars n={5} />
            <div className="tw__rating-sub">
              <Odometer value="300" suffix="+" /> Google Reviews
            </div>
          </div>
        </div>
      </header>

      {/* Video-testimonial tiles either side of one large featured card —
          two entirely independent things, not a synced pair. Tiles are
          static video previews (real buttons, own focus/hover, no
          onClick yet — see Tile's own comment for why); the featured card
          auto-advances through all 7 written testimonials on its own
          timer, unrelated to whichever tile a visitor happens to be
          looking at. */}
      <div className="tw__grid">
        <div className="tw__tiles">
          {left.map((r, i) => (
            <Tile key={`${r.name}-${i}`} review={r} />
          ))}
        </div>

        <FeaturedCard review={reviews[centerIndex]} reduce={!!reduce} activeKey={centerIndex} />

        <div className="tw__tiles">
          {right.map((r, i) => (
            <Tile key={`${r.name}-${i + left.length}`} review={r} />
          ))}
        </div>
      </div>

      {/* auto-scrolling "wall of love" ribbon */}
      <div className="tw__marquee" aria-hidden>
        <div className={`tw__marquee-track${reduce ? ' is-static' : ''}`}>
          {[...highlights, ...highlights, ...highlights].map((h, i) => (
            <span className="tw__chip" key={i}>
              <span className="tw__chip-stars">★★★★★</span>
              <span className="tw__chip-text">{h.t}</span>
              <span className="tw__chip-name">— {h.n}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
