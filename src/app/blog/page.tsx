import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogListingContent from '@/components/ui/BlogListingContent'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Real estate insights, buying guides, legal documents and lifestyle tips from OmShakthy Homes — top plot developers in Chennai.',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <BlogListingContent />
      <Footer />
    </>
  )
}
