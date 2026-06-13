import Link from 'next/link'

const footerLinks = {
  Product: ['Features', 'Solutions', 'Pricing', 'Integrations', 'API'],
  Resources: ['Documentation', 'Blog', 'Case Studies', 'Guides'],
  Company: ['About', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security']
}

export default function Footer() {
  return (
    <footer className="py-16 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                B
              </div>
              <span className="text-xl font-semibold text-white">BraneIQ</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              Turn social noise into brand intelligence. Monitor mentions, track sentiment, and respond faster.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link href={`/${link.toLowerCase()}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 BraneIQ. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
