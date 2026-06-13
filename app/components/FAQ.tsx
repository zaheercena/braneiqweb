'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'How does BraneIQ collect data?',
    answer: 'We connect to social media APIs, news feeds, review sites, and forums to collect mentions in real-time. Our AI then processes and enriches this data with sentiment analysis and entity recognition.'
  },
  {
    question: 'Can I monitor multiple brands?',
    answer: 'Yes, BraneIQ supports multi-brand monitoring with separate workspaces for each brand. Perfect for agencies managing multiple clients.'
  },
  {
    question: 'What languages do you support?',
    answer: 'We support 50+ languages with native sentiment analysis and entity recognition for each language.'
  },
  {
    question: 'How fast is the data updated?',
    answer: 'Most data streams update in real-time with sub-second latency. Some sources may have slightly longer delays depending on API rate limits.'
  },
  {
    question: 'Do you offer API access?',
    answer: 'Yes, enterprise plans include full REST API access with comprehensive documentation and SDKs.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-white">{faq.question}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6">
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
