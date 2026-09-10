import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutContent from '@/components/ui/AboutContent'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'OmShakthy Homes — 35 years of trust in Tamil Nadu real estate. Founded in 1991, over 7,500 happy customers, ₹2,000+ Cr in transactions, and a 100% litigation-free track record.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutContent />
      {/* Same footer illustration override as the Projects page — the
          colorful 3D building render at the smaller size, instead of
          the site-wide monochrome skyline. */}
      <Footer decoSrc="/footer-building.png" decoClassName="ft__deco--sm" />
    </>
  )
}
