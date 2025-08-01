import Hero from '@/components/sections/Hero'
import Demo from '@/components/sections/Demo'
import InteractiveDemo from '@/components/demo/InteractiveDemo'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Demo />
      <InteractiveDemo />
      <Features />
      <CTA />
    </main>
  )
}
