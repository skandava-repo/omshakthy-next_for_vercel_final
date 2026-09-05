'use client'
import './LeadersSection.css'

/* Editorial video-intro band (video backdrop, "OUR LEADERSHIP" eyebrow,
   "Three decades..." headline) sitting above a "meet the team" pill-card
   roster (circular photo, name/role/tag, gold accents) ported from a
   reference design. The roster's cards keep their pill shape; a
   social-icon row a later pass had added is dropped here, and a numbered
   index (01/02/03/04), a foreground timeline strip, and a supporting
   line under the headline — all shown in that same reference — were each
   considered and deliberately left out, per instruction. .ld3__intro-main
   holds only the eyebrow + headline, nothing else. Content is still
   Omshakthy's real leadership (names/roles/photos), not any reference's
   placeholder text. */

type Leader = {
  name: string
  role: string
  tag: string
  // No `img` = no real photo exists yet (see Shakthi below) — renders an
  // initials placeholder instead of misattributing someone else's photo.
  img?: string
  pos: string
  size: string
}

const leaders: Leader[] = [
  {
    name: 'R. Ramachandran',
    role: 'Chairman',
    tag: 'Vision & Legacy',
    img: '/leaders/chairman.png',
    pos: '38% 6%',
    size: 'auto 168%',
  },
  {
    name: 'N R Manigantan',
    role: 'Managing Director',
    tag: 'Strategy & Growth',
    img: '/leaders/manigantan.png',
    pos: '44% 8%',
    size: 'auto 138%',
  },
  {
    name: 'Rajib Kumar Hota',
    role: 'Executive Director',
    tag: 'Governance & Ethics',
    img: '/leaders/hota.png',
    pos: 'center 22%',
    size: 'cover',
  },
  {
    name: 'Shakthy',
    role: 'Executive Director',
    tag: 'To Be Announced',
    // No distinct photo exists — every "Shakthi" asset in /public/leaders
    // (md-cutout.png) is byte-identical to manigantan.png. That's someone
    // else's actual face, not a placeholder, so it doesn't belong here.
    pos: 'center 15%',
    size: 'cover',
  },
]

function Card({ leader, index }: { leader: Leader; index: number }) {
  return (
    <article
      className="ld3__card"
      style={{ animationDelay: `${0.2 + index * 0.09}s` }}
    >
      <div className="ld3__photo-wrap">
        {leader.img ? (
          <span
            className="ld3__photo"
            style={{ backgroundImage: `url(${leader.img})`, backgroundPosition: leader.pos, backgroundSize: leader.size }}
          />
        ) : (
          <div className="ld3__photo-placeholder" aria-hidden>
            <span>{leader.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="ld3__body">
        <h3 className="ld3__name">{leader.name}</h3>
        <span className="ld3__name-rule" aria-hidden="true" />
        <p className="ld3__role">{leader.role}</p>
        <p className="ld3__tag">{leader.tag}</p>
      </div>
      <span className="ld3__card-rule" aria-hidden="true" />
    </article>
  )
}

const LeadersSection = () => {
  return (
    <section className="ld3" id="leadership" data-snap="true" aria-label="Our leadership" data-header-theme="transparent">
      <div className="ld3__intro">
        {/* Same background clip TrustedPartnersSection uses behind its
            pillars — reused here rather than the static skyline photo, so
            the backdrop is footage instead of a still. */}
        <video
          className="ld3__intro-video"
          src="/trusted-partners-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="ld3__intro-main">
          <p className="ld3__eyebrow">
            <span className="ld3__eyebrow-line" />
            OUR LEADERSHIP
            <span className="ld3__eyebrow-line" />
          </p>
          <h1 className="ld3__h1">
            Three decades.
            <br />
            One unwavering <span className="ld3__accent">vision.</span>
          </h1>
          <span className="ld3__h1-rule" aria-hidden="true" />
        </div>
      </div>

      <div className="ld3__roster">
        {leaders.map((leader, i) => (
          <Card key={leader.name} leader={leader} index={i} />
        ))}
      </div>

      <div className="ld3__tagline">
        <span className="ld3__tagline-dot" aria-hidden="true" />
        <span className="ld3__tagline-line" aria-hidden="true" />
        <p className="ld3__tagline-text">Built on values. Driven by purpose. Committed to tomorrow.</p>
        <span className="ld3__tagline-line" aria-hidden="true" />
        <span className="ld3__tagline-dot" aria-hidden="true" />
      </div>

      <span className="ld3__watermark" aria-hidden="true">EST. 1991</span>
    </section>
  )
}

export default LeadersSection
