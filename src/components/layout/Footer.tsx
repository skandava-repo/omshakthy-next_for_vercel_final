import Link from 'next/link'
import './Footer.css'

interface FooterProps {
  // Lets one page swap the corner illustration without affecting every
  // other page's Footer — defaults to the site-wide monochrome skyline.
  decoSrc?: string
  // Optional extra class appended alongside .ft__deco, so a page can
  // override just its own illustration's size (e.g. Projects wants it
  // smaller) without touching the shared .ft__deco rule every other
  // page (including home) still uses.
  decoClassName?: string
}

const Footer = ({ decoSrc = '/footer-mono.png', decoClassName }: FooterProps) => {
  return (
    <>
    <footer className="ft">
      <div className="ft__inner">
        <div className="ft__top">
          {/* Brand */}
          <div className="ft__brand">
            <Link href="/" className="ft__logo">
              <img src="/omshakthy-logo.png" alt="OmShakthy Homes" className="ft__logo-img" />
            </Link>
            <p className="ft__tagline">
              OmShakthy Agencies (Madras) Private Ltd. Building trust in real
              estate for more than 33 years.
            </p>
          </div>

          {/* Link columns */}
          <div className="ft__columns">
            <div>
              <h3 className="ft__col-title">Company</h3>
              <ul className="ft__col-links">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Careers', path: '/careers' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="ft__link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="ft__col-title">Projects</h3>
              <ul className="ft__col-links">
                {[
                  'Kanopus Magha',
                  'OmShakthy Regalia',
                  'Elite Grand',
                  'Industrial Park',
                  'OmShakthy Mathura',
                ].map((project) => (
                  <li key={project}>
                    <Link href="/projects" className="ft__link">
                      {project}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="ft__col-title">Contact</h3>
              <ul className="ft__col-links">
                <li>
                  <a href="tel:04440303040" className="ft__link">
                    044 4030 3040
                  </a>
                </li>
                <li>
                  <a href="mailto:marketing@omshakthy.net" className="ft__link">
                    marketing@omshakthy.net
                  </a>
                </li>
                <li className="ft__contact-line">
                  OmShakthy Tower, 1N1 Jawaharlal Nehru Salai, Ekkaduthangal,
                  Chennai 600032
                </li>
              </ul>

              {/* Social icons — moved back inside the footer, next to
                  the address, per request (were in the sibling bottom
                  bar below the footer before this). */}
              <div className="ft__socials">
                <a
                  href="#"
                  className="ft__social"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.3-.04-1.15-.13-2.15-.13-2.13 0-3.6 1.3-3.6 3.7V10.5H8.5v3h2.25V21h2.75z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="ft__social"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="ft__social"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M10.5 9.5l5 2.5-5 2.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner illustration — a monochrome skyline silhouette, real
          transparency confirmed (not a checkerboard-preview artifact).
          Bottom-left, uncropped, matching the footer's light background
          instead of the earlier version's dark-blue-tuned treatment.
          Swappable via decoSrc — the Projects page uses a different
          image (the colorful 3D building render), every other page
          gets this default. */}
      <img
        src={decoSrc}
        alt=""
        aria-hidden="true"
        className={`ft__deco${decoClassName ? ` ${decoClassName}` : ''}`}
      />

    </footer>

    {/* Bottom bar — a sibling of <footer>, not inside it (per request):
        a thin white strip holding just the copyright/Privacy Policy
        line now — the social icons moved back inside the footer, next
        to the address, per request. */}
    <div className="ft__bottom">
      <p className="ft__copyright">
        © {new Date().getFullYear()} OmShakthy Homes. All Rights Reserved.
        {' · '}
        <Link href="/privacy" className="ft__bottom-link">
          Privacy Policy
        </Link>
      </p>
    </div>

    {/* WhatsApp Floating Button */}
    <a
      href="https://api.whatsapp.com/send?text=Hi,%20I%20am%20interested%20in%20OmShakthy.&phone=919150088097"
      target="_blank"
      rel="noopener noreferrer"
      className="ft__whatsapp"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.34-.5.05-1.14.07-1.84-.12-.42-.11-.97-.31-1.66-.6-2.93-1.27-4.84-4.2-4.99-4.4-.15-.2-1.2-1.59-1.2-3.03 0-1.44.76-2.15 1.03-2.44.27-.29.6-.36.8-.36.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.6.83 2.06.9 2.21.07.15.11.32.02.52-.09.2-.14.32-.27.5-.13.17-.28.38-.4.51-.13.14-.27.28-.12.55.15.27.68 1.12 1.46 1.81 1 .89 1.85 1.16 2.12 1.29.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.51.31.07.11.07.63-.17 1.31z" />
      </svg>
    </a>
    </>
  )
}

export default Footer
