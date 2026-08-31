import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatWeDoContent from '@/components/ui/WhatWeDoContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — the five disciplines behind everything OmShakthy builds.',
}

export default function WhatWeDoPage() {
  return (
    <>
      <Header />
      <WhatWeDoContent />
      <Footer />
    </>
  )
}
