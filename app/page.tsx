import Header from './components/Header'
import Hero from './components/Hero'
import TrustedBy from './components/TrustedBy'
import Stats from './components/Stats'
import Solutions from './components/Solutions'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Industries from './components/Industries'
import Testimonials from './components/Testimonials'
import DataSources from './components/DataSources'
import Enterprise from './components/Enterprise'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <TrustedBy />
      <Stats />
      <Solutions />
      <HowItWorks />
      <Features />
      <Industries />
      <Testimonials />
      <DataSources />
      <Enterprise />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
