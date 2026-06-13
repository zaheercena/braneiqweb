import { Link2, Monitor, Zap } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    number: '01',
    title: 'Connect sources',
    description: 'Link your social accounts, news feeds, and review platforms in minutes.'
  },
  {
    icon: Monitor,
    number: '02',
    title: 'Monitor & enrich',
    description: 'Our AI automatically tags, categorizes, and analyzes every mention.'
  },
  {
    icon: Zap,
    number: '03',
    title: 'Act & report',
    description: 'Respond directly from the platform and generate executive reports.'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">From setup to insight in days, not months</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-slate-800 mb-4">{step.number}</div>
              <step.icon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
