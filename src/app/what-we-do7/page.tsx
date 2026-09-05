import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatWeDoCloneContent from '@/components/ui/WhatWeDoCloneContent'

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'One group. Five disciplines, built in-house — land aggregation, residential development, hospitality management, commercial projects and supply chain.',
}

export default function WhatWeDo7Page() {
  return (
    <>
      <Header />
      {/* WhatWeDoCloneContent's own root is now a <section>, not <main>
         (it's also embedded as a section inside the home page now, which
         already has its own <main>) — this standalone page supplies the
         <main> landmark instead. */}
      <main>
        <WhatWeDoCloneContent />
      </main>
      <Footer />
    </>
  )
}
