import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900/20 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to see BraneIQ in action?
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Get a personalized demo and see how BraneIQ can transform your brand intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/request-demo" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Request Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-600 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}
