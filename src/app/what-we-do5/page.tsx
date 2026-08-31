import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatWeDoEssayContent from '@/components/ui/WhatWeDoEssayContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Land aggregation, residential development, hospitality management, commercial projects and supply chain — land to keys, in five disciplines.',
}

export default function WhatWeDo5Page() {
  return (
    <>
      <Header />
      <WhatWeDoEssayContent />
      <Footer />
    </>
  )
}
