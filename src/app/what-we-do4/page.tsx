import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SiteEvolutionContent from '@/components/ui/SiteEvolutionContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — one site, built five ways.',
}

export default function WhatWeDo4Page() {
  return (
    <>
      <Header />
      <SiteEvolutionContent />
      <Footer />
    </>
  )
}
