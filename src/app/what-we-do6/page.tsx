import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteReelContent from '@/components/ui/SiteReelContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — one site, moving through all five.',
}

export default function WhatWeDo6Page() {
  return (
    <>
      <Header />
      <SiteReelContent />
      <Footer />
    </>
  )
}
