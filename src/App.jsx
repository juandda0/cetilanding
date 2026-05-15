import { useState } from 'react'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import InteractiveDemo from './components/InteractiveDemo'
import SavingsDemo from './components/SavingsDemo'
import CTAFinal from './components/CTAFinal'
import Onboarding from './components/Onboarding'
import './App.css'

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  return (
    <div className="app">
      <Hero onStart={() => setShowOnboarding(true)} />
      <HowItWorks />
      <InteractiveDemo />
      <SavingsDemo />
      <CTAFinal onStart={() => setShowOnboarding(true)} />

      {showOnboarding && (
        <Onboarding onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
