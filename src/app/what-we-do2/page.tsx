import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CapabilityStatementContent from '@/components/ui/CapabilityStatementContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — one integrated capability statement.',
}

export default function WhatWeDo2Page() {
  return (
    <>
      <Header />
      <CapabilityStatementContent />
      <Footer />
    </>
  )
}
