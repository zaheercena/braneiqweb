const industries = [
  { name: 'Agencies & Consultancies', description: 'Monitor multiple clients from one dashboard' },
  { name: 'Enterprise Comms & PR', description: 'Protect and enhance corporate reputation' },
  { name: 'Retail & Consumer Brands', description: 'Track brand health and customer feedback' },
  { name: 'Sports & Entertainment', description: 'Engage fans and manage talent reputation' }
]

export default function Industries() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for teams across every sector</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, i) => (
            <div key={i} className="p-6 bg-slate-900 rounded-xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">{industry.name}</h3>
              <p className="text-slate-400 text-sm">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
