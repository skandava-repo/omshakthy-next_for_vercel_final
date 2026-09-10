'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useSectionEnter } from '@/lib/useSectionEnter'
import './FinancialPartnersSection.css'

/* ============================================================
   FinancialPartnersSection
   Bank/partner logo strip — split out of TrustedPartnersSection so
   that section's snapped slide (see PageController) could dedicate
   its full 100vh to the pillar gallery alone. Rendered right after
   </PageController> in HomeClient, it's the first thing native
   scroll reaches once the pillar gallery releases.
   ============================================================ */

const partnerLogos = [
  { name: 'HDFC Bank', file: '/partners/hdfc.png' },
  { name: 'ICICI Bank', file: '/partners/icici.png' },
  { name: 'Axis Bank', file: '/partners/axis.png' },
  { name: 'Kotak Mahindra Bank', file: '/partners/kotak.png' },
  { name: 'IDFC FIRST Bank', file: '/partners/idfc-first.png' },
  { name: 'Bajaj Finserv', file: '/partners/bajaj-finserv.png' },
]

const EASE = [0.16, 1, 0.3, 1] as const

const FinancialPartnersSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const built = useSectionEnter(sectionRef, 150)

  // No data-header-theme — dropped the "light" paper scrim (same fix
  // as LeadersSection/WhatWeDoCloneContent) so the header shows the
  // same dark gradient bar as Hero instead of a mismatched light one.
  return (
    <section ref={sectionRef} className="fp" aria-label="Financial partners">
      <div className="fp__inner">
        <span className="fp__label">Financial Partners</span>
        <motion.h3
          className="fp__title"
          initial={{ opacity: 0, y: 24 }}
          animate={built ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Trusted by India&rsquo;s <em>Leading Financial Institutions.</em>
        </motion.h3>
        <div className="fp__logos">
          {partnerLogos.map((p, i) => (
            <motion.div
              className="fp__logo"
              key={p.name}
              initial={{ opacity: 0, y: 18 }}
              animate={built ? { opacity: 1, y: 0 } : {}}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.2 + i * 0.11 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.file} alt={p.name} loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FinancialPartnersSection
