import { Twitter, Facebook, Instagram, Newspaper, MessageCircle } from 'lucide-react'

const sources = [
  { icon: Twitter, name: 'Twitter/X' },
  { icon: Facebook, name: 'Facebook' },
  { icon: Instagram, name: 'Instagram' },
  { icon: Newspaper, name: 'News Sites' },
  { icon: MessageCircle, name: 'Forums' },
]

export default function DataSources() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Connect the channels that matter</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {sources.map((source, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6">
              <source.icon className="w-10 h-10 text-blue-500" />
              <span className="text-slate-400 text-sm">{source.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
