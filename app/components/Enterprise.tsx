import { Shield, Lock, Users, Clock } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Role-based access & audit logs',
    description: 'Granular permissions and complete activity tracking'
  },
  {
    icon: Lock,
    title: 'Multi-tenant isolation',
    description: 'Secure data separation between teams and clients'
  },
  {
    icon: Users,
    title: 'SSO & SAML support',
    description: 'Integrate with your existing identity provider'
  },
  {
    icon: Clock,
    title: 'Real-time pipeline',
    description: 'Process millions of mentions with sub-second latency'
  }
]

export default function Enterprise() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Enterprise-ready</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-6 bg-slate-950 rounded-xl border border-slate-800">
              <feature.icon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
