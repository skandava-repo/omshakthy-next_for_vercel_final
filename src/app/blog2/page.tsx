import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogJourneyContent from '@/components/ui/BlogJourneyContent'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'A drive down the corridors OmShakthy builds in — real guides, real projects, real people, told as a journey rather than a feed.',
}

export default function Blog2Page() {
  return (
    <>
      <Header />
      <BlogJourneyContent />
      <Footer />
    </>
  )
}
