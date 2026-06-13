export default function RequestDemo() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Request a Demo</h1>
        <p className="text-slate-400 text-center mb-8">See how BraneIQ can transform your brand intelligence</p>
        <form className="space-y-4 bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
            <input type="text" placeholder="Last Name" className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
          </div>
          <input type="email" placeholder="Work Email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
          <input type="text" placeholder="Company" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
          <button type="submit" className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
            Request Demo
          </button>
        </form>
      </div>
    </div>
  )
}
