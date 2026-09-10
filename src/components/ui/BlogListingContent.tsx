'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { blogs } from './PriceTrends'
import './BlogListingContent.css'

/* "Blog" — v3. v2 fixed the "Recently Added" grid's asymmetric shape but
   left the rest of the page not actually matching the reference's real
   composition: the hero was a plain 50/50 split instead of the photo
   pinning into the text, the sidebar card's headline sat below the
   photo instead of overlaid on it, the small cards were photo-left
   instead of photo-top, and two whole sections (a text-list + banner
   block, a bottom thumbnail strip) didn't exist at all. This pass
   builds all five.

   The reference's byline has a named reporter with a headshot — this
   site doesn't have individual bylined authors for these posts, so
   using "OmShakthy Team" + the actual company mark instead of
   inventing a person's name and face. Sections 5/6 below reuse the
   same 3 real posts in different modules (a real front page's "Recently
   Added", "Editor's Picks" and "More Stories" rows commonly overlap on
   the same top stories) rather than inventing new ones. */

const corridors: Record<string, string> = {
  'How to Pay Avadi Municipality Property Tax Online': 'Avadi',
  "Why Guduvancheri is Chennai's Next Growth Corridor": 'Guduvancheri',
}

const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.cat)))]

// Spells out the post count in the closing note below — this used to be a
// hardcoded "Three entries" that quietly went wrong the moment a fourth
// post was added; keying off blogs.length means it can never go stale
// again as the library grows.
const NUMBER_WORDS: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
}

const CorridorLink = ({ title }: { title: string }) => {
  const corridor = corridors[title]
  if (!corridor) return null
  return (
    <a href="/projects" className="bp__corridor">
      See live listings in {corridor}
      {/* Its own span so the arrow alone can slide on hover, via CSS —
          a small tell that this link actually goes somewhere. */}
      <span className="bp__corridor-arrow" aria-hidden="true">→</span>
    </a>
  )
}

// Fade+slide reveal used by every major section below, so the page feels
// like it's unfolding as you scroll rather than the reference's flat,
// fully-rendered-at-load newsroom clone. Recently Added had this already;
// the hero, mixed section and strip previously just appeared static.
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
}

const AuthorByline = ({ date, read, onPhoto }: { date: string; read?: string; onPhoto?: boolean }) => (
  <span className={`bp__author${onPhoto ? ' bp__author--on-photo' : ''}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/omshakthy-logo.png" alt="" className="bp__author-avatar" />
    <span className="bp__author-text">
      OmShakthy Team
      <br />
      <small>{date}{read ? ` · ${read}` : ''}</small>
    </span>
  </span>
)

const BlogListingContent = () => {
  const [filter, setFilter] = useState('All')
  const [hero, feature] = blogs
  const [avadi, guduvancheri, milestones] = blogs
  const filtered = filter === 'All' ? blogs : blogs.filter((b) => b.cat === filter)

  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  /* .bp__mixed's right banner needs to match the left column's actual
     rendered height (two stacked .bp__mini cards + the gap between
     them) — not an approximation. CSS alone can't do this reliably
     here: the banner's own source photo is a portrait image (taller
     than wide), and a flex/grid-based "stretch to fill" approach hits
     a genuine circular-sizing case (the grid row's auto height is
     computed FROM the banner's own intrinsic content size, which for
     an aspect-ratio image ignores flex-basis/flex-grow and reports its
     full un-shrunk height back into that same calculation). Measuring
     the left column directly and applying it as an explicit pixel
     height sidesteps that entirely. Only applied above the 860px
     stacked-layout breakpoint (BlogListingContent.css) — below it,
     bannerHeight stays undefined and the banner just flows naturally. */
  const mixedListRef = useRef<HTMLDivElement>(null)
  const [bannerHeight, setBannerHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const el = mixedListRef.current
    if (!el) return
    const update = () => {
      setBannerHeight(window.innerWidth > 860 ? el.getBoundingClientRect().height : undefined)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <main className="bp">
      <header className="bp__masthead">
        <span className="bp__masthead-meta">
          {today} <span className="bp__masthead-dot" />Chennai
        </span>
        <div className="bp__masthead-center">
          <span className="bp__masthead-name">Blog</span>
        </div>
        <a className="bp__masthead-mail" href="mailto:marketing@omshakthy.net">
          Mail Us
        </a>
      </header>

      <motion.section className="bp__hero" {...reveal}>
        {/* The reference's photo is a tall block running the full hero
            height, with a narrow text column (headline/excerpt/byline
            all confined to one strip) whose headline sits in a solid
            white box that actually overlaps the photo's left edge —
            not a plain "photo top, text below" split, which is what
            this used to be. The title's inner span (not the h1 itself)
            carries the background, with box-decoration-break so a
            multi-line headline gets one boxed background per line
            instead of one big rectangle behind the whole block. */}
        <a href="#" className="bp__hero-main" aria-label={hero.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.image} alt={hero.title} className="bp__hero-img" />
          {/* Fades the photo's own left edge into the page's cream, so
              the headline's overlap reads as the photo receding behind
              soft light rather than a hard-edged box sitting on a hard
              photo edge. */}
          <span className="bp__hero-shade" aria-hidden="true" />
          <div className="bp__hero-body">
            <span className="bp__cat">{hero.cat}</span>
            <h1 className="bp__hero-title">
              <span className="bp__hero-title-text">{hero.title}</span>
            </h1>
            <p className="bp__hero-excerpt">
              <span className="bp__dropcap">{hero.excerpt.charAt(0)}</span>
              {hero.excerpt.slice(1)}
            </p>
            <AuthorByline date={hero.date} read={hero.read} />
          </div>
        </a>

        <div className="bp__side">
          {/* Badge, headline AND byline all overlaid on the photo's own
              scrim — the reference's sidebar card does this throughout;
              the previous version only overlaid the badge and put the
              title below the photo instead. */}
          <a href="#" className="bp__side-card" aria-label={feature.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.image} alt={feature.title} className="bp__side-img" />
            <span className="bp__side-shade" aria-hidden="true" />
            <span className="bp__cat bp__cat--on-photo">{feature.cat}</span>
            <div className="bp__side-body">
              <h2 className="bp__side-title">{feature.title}</h2>
              <span className="bp__byline bp__byline--on-photo">{feature.date}</span>
            </div>
          </a>
          <CorridorLink title={feature.title} />

          {/* A real customer testimonial, not an invented editorial pull-
              quote — the reference's quote card, filled with content that
              actually exists. */}
          <figure className="bp__quote">
            <blockquote>
              &ldquo;Owning a flat in Santha Towers is a symbol of security for my retired life. The
              team was transparent, on-time and truly cared.&rdquo;
            </blockquote>
            <figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/testimonials/jalaja.png" alt="Jalaja Madanmohan" />
              <span>Jalaja Madanmohan<br /><small>B103 · OmShakthy Santha Towers</small></span>
            </figcaption>
          </figure>
        </div>
      </motion.section>

      <motion.section
        className="bp__recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bp__recent-header">
          <h2 className="bp__recent-title">Recently Added</h2>
          <div className="bp__recent-tabs">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`bp__tab${filter === c ? ' is-active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {/* Shared layoutId — framer-motion animates this one pill
                    sliding between buttons as it unmounts/remounts in
                    whichever button is active, instead of the filter just
                    snapping between plain text colors. */}
                {filter === c && (
                  <motion.span
                    className="bp__tab-pill"
                    layoutId="bp-tab-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="bp__tab-label">{c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* One big overlaid-caption feature, plus the rest as a 2-column
            grid of photo-top/text-below cards — the reference's small
            cards are never photo-left/text-right, which is what this
            used to be. */}
        <div className="bp__grid">
          <AnimatePresence mode="popLayout">
            {filtered[0] && (
              <motion.article
                className="bp__feature"
                key={filtered[0].title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <a href="#" className="bp__feature-link" aria-label={filtered[0].title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filtered[0].image} alt={filtered[0].title} className="bp__feature-img" />
                  <span className="bp__feature-shade" aria-hidden="true" />
                  <span className="bp__cat bp__cat--on-photo">{filtered[0].cat}</span>
                  <div className="bp__feature-body">
                    <h3 className="bp__feature-title">{filtered[0].title}</h3>
                    <span className="bp__byline bp__byline--on-photo">{filtered[0].date} · {filtered[0].read}</span>
                  </div>
                </a>
              </motion.article>
            )}
          </AnimatePresence>

          <div className="bp__list">
            <AnimatePresence mode="popLayout">
              {filtered.slice(1).map((b) => (
                <motion.article
                  className="bp__card"
                  key={b.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* The card's own read-more target — a separate <a> from
                      CorridorLink below, not nested inside it: an <a>
                      inside an <a> is invalid HTML and threw a real
                      hydration error here before this was split apart. */}
                  <a href="#" className="bp__card-link" aria-label={b.title}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image} alt={b.title} className="bp__card-img" />
                    <div className="bp__card-body">
                      <span className="bp__cat">{b.cat}</span>
                      <h3 className="bp__card-title">{b.title}</h3>
                      <span className="bp__byline">{b.date} · {b.read}</span>
                    </div>
                  </a>
                  <CorridorLink title={b.title} />
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Section that didn't exist before: a compact text-first list
          (thumbnail to the right of the copy, not above it) beside one
          large banner story (headline sitting above the photo as plain
          text, not overlaid — the reference varies this on purpose
          instead of using the overlay treatment everywhere). */}
      <motion.section className="bp__mixed" {...reveal}>
        <div className="bp__mixed-list" ref={mixedListRef}>
          {[avadi, milestones].map((b) => (
            <a href="#" className="bp__mini" key={b.title} aria-label={b.title}>
              <div className="bp__mini-body">
                <span className="bp__cat">{b.cat}</span>
                <h3 className="bp__mini-title">{b.title}</h3>
                <p className="bp__mini-excerpt">{b.excerpt}</p>
                <span className="bp__byline">{b.date} · {b.read}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt="" className="bp__mini-img" />
            </a>
          ))}
        </div>

        <a href="#" className="bp__banner" aria-label={guduvancheri.title} style={bannerHeight ? { height: bannerHeight } : undefined}>
          <h2 className="bp__banner-title">{guduvancheri.title}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={guduvancheri.image} alt={guduvancheri.title} className="bp__banner-img" />
        </a>
      </motion.section>

      {/* Bottom recap strip — the reference's last row before its
          footer. */}
      <motion.div className="bp__strip" {...reveal}>
        {blogs.map((b) => (
          <a href="#" className="bp__strip-item" key={b.title} aria-label={b.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt="" className="bp__strip-img" />
            <span>
              <span className="bp__cat">{b.cat}</span>
              <span className="bp__strip-title">{b.title}</span>
            </span>
          </a>
        ))}
      </motion.div>

      <p className="bp__note">
        {NUMBER_WORDS[blogs.length] ?? blogs.length} entries, each one real — this is a working
        journal, not a stock feed. More field notes land here as we build.
      </p>
    </main>
  )
}

export default BlogListingContent
