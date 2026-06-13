import { Check } from 'lucide-react'

const features = [
  'Real-time monitoring',
  'Sentiment & analytics',
  'Smart alerts',
  'Built for teams',
  'Role-based access',
  'API access',
  'Custom reports',
  'Export data'
]

export default function Features() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to listen and respond</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-white">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
