'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'

const navLinksLeft = [
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
]

const navLinksRight = [
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
]

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [solid, setSolid] = useState(false)
  // Which data-header-theme value the currently-active section declares —
  // '' (default gradient/dark), 'light' (paper sections), or 'solid-blue'
  // (flat brand blue, no gradient — currently just Leadership).
  const [theme, setTheme] = useState('')
  const location = { pathname: usePathname() }
  const isHome = location.pathname === '/'

  // On content pages the header is fixed and transparent; make it solid once
  // the user scrolls past the hero so page content doesn't collide with the nav.
  useEffect(() => {
    if (isHome) {
      setSolid(false)
      return
    }
    const onScroll = () => setSolid(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome, location.pathname])

  useEffect(() => {
    const updateNav = () => {
      // PageController: Hero=0, Property=1, Timeline=2
      const currentSection = (window as any).__pageControllerCurrentSection

      setScrolled(currentSection >= 1)

      // Most sections are dark/photo-backed, so the header defaults to white
      // text on a dark scrim. A section can opt into a light background by
      // tagging itself data-header-theme="light" (e.g. PriceTrends' paper
      // theme) — read that off whichever section is currently active rather
      // than hardcoding an index, so it keeps working if section order changes.
      const sections = document.querySelectorAll('.page-controller__section')
      const activeSection = sections[currentSection]
      const themedEl = activeSection?.querySelector('[data-header-theme]')
      setTheme(themedEl?.getAttribute('data-header-theme') || '')

      const nav = document.querySelector('.site-nav__inner') as HTMLElement
      if (nav) {
        nav.style.transition = 'padding 0.5s ease'
        // Left padding fixed at 15px; right padding stays wide/compact per section
        nav.style.paddingLeft = '15px'
        if (currentSection >= 1) {
          nav.style.paddingRight = '90px'
        } else {
          nav.style.paddingRight = '90px'
        }
      }
    }

    updateNav()
    // PageController dispatches this event on section change
    window.addEventListener('pageSectionChange', updateNav)
    return () => window.removeEventListener('pageSectionChange', updateNav)
  }, [])

  // The above only tracks theme while PageController owns the scroll (via
  // pageSectionChange). Once it hands off to native scroll — past the last
  // snapped section — currentSection stops changing, so that effect goes
  // stale. This picks theme detection back up from actual scroll position
  // for whatever's now in normal document flow (also tagged
  // data-header-theme="light" where relevant, e.g. TrustedPartners/Spotlight).
  useEffect(() => {
    const checkThemeByScroll = () => {
      if (window.scrollY <= 0) return // still in PageController's domain
      const sections = document.querySelectorAll('[data-header-theme]')
      sections.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= 80 && r.bottom >= 0) {
          setTheme(el.getAttribute('data-header-theme') || '')
        }
      })
    }
    window.addEventListener('scroll', checkThemeByScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkThemeByScroll)
  }, [])

  return (
    <>
      <nav className={`site-nav ${scrolled || solid ? 'site-nav--scrolled' : ''} ${theme ? `site-nav--${theme}` : ''}`}>
        <div className="site-nav__inner">
          {/* Logo — left aligned */}
          <Link href="/" className="site-nav__logo">
            <img
              src="/omshakthy-logo.png"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--light"
            />
            <img
              src="/omshakthy-logo.png"
              alt="OmShakthy Homes"
              className="site-nav__logo-img site-nav__logo-img--dark"
            />
          </Link>

          {/* Center nav: both link lists, pushed to the middle of the header
              (flex:1 + justify-content:center) instead of bunched next to
              the phone/CTA on the right. */}
          <div className="site-nav__center">
            <ul className="site-nav__links">
              {navLinksLeft.map((link, i) => (
                <li key={link.name} className="site-nav__item">
                  <Link
                    href={link.path}
                    className="site-nav__link"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="site-nav__links">
              {navLinksRight.map((link, i) => (
                <li key={link.name} className="site-nav__item">
                  <Link
                    href={link.path}
                    className="site-nav__link"
                    style={{ animationDelay: `${(i + 3) * 0.1}s` }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: phone + CTA, kept separate from the (now centered) links */}
          <div className="site-nav__actions">
            <a href="tel:04440303040" className="site-nav__phone">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
                <path
                  fill="currentColor"
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
                />
              </svg>
              <span>044 4030 3040</span>
            </a>
            <Link href="/contact" className="site-nav__cta">
              Book Site Visit
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
