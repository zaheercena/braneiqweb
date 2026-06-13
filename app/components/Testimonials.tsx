const testimonials = [
  {
    quote: 'BraneIQ transformed how we monitor brand mentions. We catch issues before they escalate.',
    author: 'Sarah Chen',
    role: 'Head of Communications',
    company: 'TechCorp'
  },
  {
    quote: 'The sentiment analysis is incredibly accurate. It saves our team hours every week.',
    author: 'Michael Roberts',
    role: 'Marketing Director',
    company: 'RetailPlus'
  },
  {
    quote: 'Finally, a tool that brings all our social data into one place with actionable insights.',
    author: 'Emily Watson',
    role: 'Brand Manager',
    company: 'FashionBrand'
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Teams that listen smarter</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-6 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-slate-500 text-sm">{testimonial.role}, {testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
