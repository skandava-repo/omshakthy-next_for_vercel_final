import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TrustedPartnersSection from '@/components/ui/TrustedPartnersSection'

// Preserves the home page's own "What We Do" section (TrustedPartnersSection
// — the photo-index component with the tp__bg-scrim background wash) before
// it's replaced there with WhatWeDoCloneContent, per explicit request. This
// component doesn't depend on PageController — it's a self-contained 100vh
// section — so it drops into a normal Header/Footer page here unchanged.
export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — the five disciplines behind everything OmShakthy builds.',
}

export default function WhatWeDo8Page() {
  return (
    <>
      <Header />
      <TrustedPartnersSection />
      <Footer />
    </>
  )
}
