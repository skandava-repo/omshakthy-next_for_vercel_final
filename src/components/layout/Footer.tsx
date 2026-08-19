import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-brand-deep border-t border-brand/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-2xl text-brand font-bold mb-2">
              OmShakthy
            </h2>
            <p className="text-brand-light/50 text-xs tracking-[0.2em] mb-4">HOMES</p>
            <p className="text-white text-sm leading-relaxed">
              OmShakthy Agencies (Madras) Private Ltd. Building trust in real
              estate for more than 33 years.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-white hover:text-brand transition-colors" aria-label="Facebook">
                FB
              </a>
              <a href="#" className="text-white hover:text-brand transition-colors" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="text-white hover:text-brand transition-colors" aria-label="YouTube">
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Projects', path: '/projects' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' },
                { name: 'Careers', path: '/careers' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white text-sm hover:text-brand transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Projects
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                'Canopus Magha',
                'OmShakthy Regalia',
                'Elite Grand',
                'Industrial Park',
                'OmShakthy Mathura',
              ].map((project) => (
                <li key={project}>
                  <Link
                    href="/projects"
                    className="text-white text-sm hover:text-brand transition-colors"
                  >
                    {project}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="tel:04440303040"
                className="text-white hover:text-brand transition-colors"
              >
                📞 044 4030 3040
              </a>
              <a
                href="mailto:marketing@omshakthy.net"
                className="text-white hover:text-brand transition-colors"
              >
                ✉️ marketing@omshakthy.net
              </a>
              <p className="text-white">
                📍 OmShakthy Tower, 1N1 Jawaharlal Nehru Salai, Ekkaduthangal,
                Chennai 600032
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand/5 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white text-xs">
            © {new Date().getFullYear()} OmShakthy Homes. All Rights Reserved.
          </p>
          <Link href="/privacy" className="text-white text-xs hover:text-brand transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://api.whatsapp.com/send?text=Hi,%20I%20am%20interested%20in%20OmShakthy.&phone=919150088097"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/30 hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-2xl">💬</span>
      </a>
    </footer>
  )
}

export default Footer
