import { MessageSquare, BarChart3, Bell, Users } from 'lucide-react'

const solutions = [
  {
    icon: MessageSquare,
    title: 'Social Listening',
    description: 'Monitor brand mentions across social media, news, and forums in real-time.'
  },
  {
    icon: BarChart3,
    title: 'Sentiment Analysis',
    description: 'AI-powered sentiment tracking to understand how your brand is perceived.'
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Get notified instantly when critical mentions or trends emerge.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Built for teams with role-based access and workflow automation.'
  }
]

export default function Solutions() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">One platform for listening, analysis, and action</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to monitor, analyze, and respond to brand mentions across the web.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, i) => (
            <div key={i} className="p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
              <solution.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{solution.title}</h3>
              <p className="text-slate-400 text-sm">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
