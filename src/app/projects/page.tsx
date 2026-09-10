import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectsContent from '@/components/ui/ProjectsContent'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore OmShakthy Homes ongoing, upcoming and completed residential, industrial and land aggregation projects across Chennai.',
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <ProjectsContent />
      {/* This page alone gets the colorful 3D building render instead of
          the site-wide monochrome skyline, and at a smaller size — both
          per request, and both scoped to just this page via Footer's
          own props rather than touching the shared .ft__deco rule. */}
      <Footer decoSrc="/footer-building.png" decoClassName="ft__deco--sm" />
    </>
  )
}
