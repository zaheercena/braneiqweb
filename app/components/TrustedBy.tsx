export default function TrustedBy() {
  const brands = ['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5']
  
  return (
    <section className="py-12 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-500 text-sm mb-8">Trusted by leading brands</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {brands.map((brand, i) => (
            <div key={i} className="h-8 w-24 bg-slate-800 rounded opacity-50" />
          ))}
        </div>
      </div>
    </section>
  )
}
