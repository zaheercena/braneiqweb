'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="text-xl font-semibold text-white">BraneIQ</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/solutions" className="text-slate-300 hover:text-white transition-colors">Solutions</Link>
            <Link href="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="/industries" className="text-slate-300 hover:text-white transition-colors">Industries</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/request-demo" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
              Request Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-4">
            <Link href="/solutions" className="block text-slate-300 hover:text-white">Solutions</Link>
            <Link href="/features" className="block text-slate-300 hover:text-white">Features</Link>
            <Link href="/industries" className="block text-slate-300 hover:text-white">Industries</Link>
            <Link href="/pricing" className="block text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/login" className="block text-slate-300 hover:text-white">Login</Link>
            <Link href="/request-demo" className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center">
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
