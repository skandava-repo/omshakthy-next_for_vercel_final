'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { blogs } from './PriceTrends'
import './BlogJourneyContent.css'

/* /blog2 — v2, rebuilt from scratch.
   v1 ("The Corridor Drive") turned the blog into horizontal panels you
   stepped through via a route-line/dot nav — which, on inspection, is
   the same underlying move this site's own CinematicTimeline.tsx
   already makes (translateX per stop, an index of markers). Dressing
   that mechanic in road/corridor language didn't make it a new idea.

   This version throws out the stop-navigation model entirely. The move
   here — closer to how Apple's product pages actually work — isn't
   "step through frames," it's: one photo per post PINS as you scroll
   through its section and grows continuously from a small rounded
   frame to full-bleed, then releases and plain-flow copy appears
   beneath it. No persistent nav chrome at all: no route line, no dots,
   no stop counter, no tag pills, no glass badges, no gradient scrims.
   Just scroll, big type, and one real piece of motion per post that's
   actually tied to scroll position rather than decorating a page that
   would look the same static.

   Mechanism: each post section is very tall (220vh). A sticky 100vh
   frame inside it holds the photo; framer-motion's useScroll (targeting
   that section) drives scale/border-radius on the photo from "small
   inset frame" to "fills the viewport" over the section's own scroll
   distance, clamped to finish partway through so there's room left to
   scroll past before the next section's pin takes over. Pure native
   scroll — nothing hijacked, no fixed positioning tricks.

   v3: giving every post its own 220vh cinematic section doesn't scale —
   a blog needs to hold many entries, and 220vh each turns a 5-post
   library into an already-very-long scroll that only gets worse as
   posts are added. The pin-scale treatment is now reserved for a single
   featured post; everything else lives in a compact, text-forward list.

   v4: the first version of that list gave each row its own thumbnail
   that faded in on hover in place — which fixed the scale problem but
   is itself an extremely common pattern (half the editorial sites on
   the web do exactly that), so the page's "innovative" quota ended up
   spent entirely on the one featured post while everything else quietly
   reverted to generic. Replaced with a single floating preview image
   that follows the actual cursor position and swaps its photo live as
   you move down the list — the rows themselves stay exactly as compact
   (plain text, no per-row image in the layout at all), but the list as
   a whole now has a real, distinctive interaction rather than a safe
   default one. */

const LOCATIONS: Record<string, string> = {
  'How to Pay Avadi Municipality Property Tax Online': 'Avadi',
  "Why Guduvancheri is Chennai's Next Growth Corridor": 'Guduvancheri',
  'Life at Omshakthy: Community & Milestones': 'Chennai',
  'Inside OmShakthy Regalia: A Gated Community Taking Shape in Avadi': 'Avadi',
  'Documents to Check Before You Buy a Plot in Chennai': 'Chennai',
}

const [featured, ...rest] = blogs

const BlogJourneyContent = () => {
  return (
    <main className="br">
      <Hero />
      <PostSection post={featured} />
      <StoryList posts={rest} />
      <Outro />
    </main>
  )
}

const Hero = () => (
  <section className="br__hero">
    <span className="br__hero-eyebrow">OmShakthy Journal</span>
    <h1 className="br__hero-title">
      Real stories.
      <br />
      From the ground
      <br />
      we build on.
    </h1>
    <span className="br__hero-hint">Scroll</span>
  </section>
)

const PostSection = ({ post }: { post: (typeof blogs)[number] }) => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Clamped to reach its final state by ~45% of the section's own scroll
  // span, not 100% of it — leaves the back half of the tall section for
  // the pin to actually hold still and be looked at, and for the release
  // into the copy below to feel like a distinct beat rather than the
  // scale animation still trickling in right as the text appears.
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.5, 1, 1])
  const radius = useTransform(scrollYProgress, [0, 0.45, 1], [32, 0, 0])
  const imgScale = useTransform(scrollYProgress, [0, 0.45, 1], [1.25, 1, 1])
  const frameOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1])

  return (
    <>
      {/* This tall element's ONLY job is to reserve scroll runway for the
          pin — it must contain nothing but the pin. Copy used to be a
          second child in here, which seemed reasonable but isn't how
          sticky layout actually works: a sticky element still reserves
          its own plain box-height (100vh) in document flow regardless of
          how long it visually stays pinned, so a sibling placed right
          after it starts its own flow position only 100vh down — while
          the pin visually keeps covering that same screen region for
          the section's full extra scroll range. The result was the
          copy silently rendering *behind* the still-pinned, opaque
          photo for a big chunk of scroll. Making the tall element
          single-purpose (just the pin) and moving copy to a real
          sibling after it fixes this by construction, not by patching
          z-index. */}
      <section className="br__post-pin-track" ref={ref}>
        <div className="br__post-pin">
          <motion.div className="br__post-frame" style={{ scale, borderRadius: radius, opacity: frameOpacity }}>
            <motion.img src={post.image} alt={post.title} className="br__post-img" style={{ scale: imgScale }} />
          </motion.div>
        </div>
      </section>

      <div className="br__post-copy">
        <RevealLine className="br__post-eyebrow">
          Featured · {post.cat} · {LOCATIONS[post.title] ?? 'Chennai'}
        </RevealLine>
        <h2 className="br__post-title">
          <RevealLine>{post.title}</RevealLine>
        </h2>
        <RevealLine className="br__post-excerpt" delay={0.08}>
          {post.excerpt}
        </RevealLine>
        <RevealLine className="br__post-meta" delay={0.14}>
          OmShakthy Team · {post.date} · {post.read}
        </RevealLine>
        <motion.a
          href="#"
          className="br__post-link"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Read the story →
        </motion.a>
      </div>
    </>
  )
}

// Small text lines fade+rise into place as they cross into view — the
// only recurring "device" on the page, deliberately just typography
// doing the work rather than another visual widget.
const RevealLine = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => (
  <motion.span
    className={className}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ display: 'block' }}
  >
    {children}
  </motion.span>
)

// Everything after the one featured post lives here — plain text rows,
// no per-row image in the layout at all (that's what keeps the list
// cheap enough to hold many posts). The visual interest instead comes
// from ONE floating preview that tracks the cursor and swaps photos as
// it crosses each row, rather than a static thumbnail sitting in the
// row itself.
const StoryList = ({ posts }: { posts: typeof blogs }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  // Spring-smoothed rather than tracking the raw cursor 1:1 — a preview
  // that snaps exactly to the pointer reads as a tooltip; one that
  // trails slightly reads as a deliberate object being carried down
  // the list, which is the actual effect being aimed for here.
  const springX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.4 })
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.4 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <section className="br__list">
      <RevealLine className="br__list-eyebrow">More stories</RevealLine>
      <div
        className="br__list-rows"
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
      >
        {posts.map((post, i) => (
          <a
            href="#"
            className="br__row"
            key={post.title}
            aria-label={post.title}
            onMouseEnter={() => setHovered(i)}
          >
            <span className="br__row-meta">
              {post.cat} · {LOCATIONS[post.title] ?? 'Chennai'} · {post.date}
            </span>
            <h3 className="br__row-title">{post.title}</h3>
          </a>
        ))}

        <motion.div
          className="br__cursor-preview"
          style={{ left: springX, top: springY, opacity: hovered !== null ? 1 : 0 }}
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            {hovered !== null && (
              <motion.img
                key={posts[hovered].title}
                src={posts[hovered].image}
                alt=""
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

const Outro = () => (
  <section className="br__outro">
    <RevealLine className="br__outro-quote">
      &ldquo;Owning a flat in Santha Towers is a symbol of security for my retired life. The team
      was transparent, on-time and truly cared.&rdquo;
    </RevealLine>
    <RevealLine className="br__outro-attr" delay={0.1}>
      Jalaja Madanmohan · B103, OmShakthy Santha Towers
    </RevealLine>
    <motion.div
      className="br__outro-actions"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="/projects" className="br__outro-cta">
        See live listings →
      </a>
      <a href="/blog" className="br__outro-secondary">
        Read the classic index
      </a>
    </motion.div>
  </section>
)

export default BlogJourneyContent
