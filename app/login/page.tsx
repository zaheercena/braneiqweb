export default function Login() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white" />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white" />
          <button type="submit" className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
