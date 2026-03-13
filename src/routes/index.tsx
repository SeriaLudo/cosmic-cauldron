import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PeriodicTable } from '../components/periodic-table'
import { Sidebar, TopBar } from '../components/sidebar'
import { getTemperatureColor } from '../machines/temperatureMachine'

export const Route = createFileRoute('/')({
  component: PeriodicTablePage,
})

function PeriodicTablePage() {
  const [temperature, setTemperature] = useState(298)
  const [isActive, setIsActive] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isActive) {
      const color = getTemperatureColor(temperature)
      document.documentElement.style.setProperty('--temp-glow', color)
      document.body.classList.add('temperature-active')
    } else {
      document.documentElement.style.removeProperty('--temp-glow')
      document.body.classList.remove('temperature-active')
    }
  }, [temperature, isActive])

  const handleTemperatureChange = (temp: number) => {
    setTemperature(temp)
  }

  const handleActiveChange = (active: boolean) => {
    setIsActive(active)
  }

  const handleReset = () => {
    setTemperature(298)
    setIsActive(false)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar 
        onTemperatureChange={handleTemperatureChange}
        onActiveChange={handleActiveChange}
        onReset={handleReset}
        onOpenChange={setSidebarOpen}
      />

      {/* Mobile TopBar */}
      <TopBar 
        onTemperatureChange={handleTemperatureChange}
        onActiveChange={handleActiveChange}
        onReset={handleReset}
      />

      {/* Temperature glow overlay */}
      {isActive && (
        <div 
          className="temperature-glow"
          style={{ 
            background: `radial-gradient(ellipse at center, transparent 20%, ${getTemperatureColor(temperature)} 100%)`,
            opacity: 0.15,
          }}
        />
      )}

      <main className="page-wrap px-4 pb-8 pt-20 lg:pt-6">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="display-title mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Periodic Table of Elements
          </h1>
          <p className="text-white/70">
            Interactive periodic table with detailed element information
          </p>
        </header>
        <PeriodicTable temperature={temperature} isActive={isActive} />
      </main>
    </>
  )
}
