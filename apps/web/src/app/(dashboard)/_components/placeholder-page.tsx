export default function Page({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-slate-400">{description}</p>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500">
        Coming soon
      </div>
    </div>
  );
}
