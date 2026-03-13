import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useThrottledCallback } from '@tanstack/react-pacer'
import { PeriodicTable } from '../components/periodic-table'
import { Sidebar, TopBar } from '../components/sidebar'
import { getTemperatureColor } from '../machines/temperatureMachine'
import type { Element, PeriodicTableData } from '../types/element'

export const Route = createFileRoute('/')({
  component: PeriodicTablePage,
})

function PeriodicTablePage() {
  const [temperature, setTemperature] = useState(298)
  const [isActive, setIsActive] = useState(false)
  const [elements, setElements] = useState<Element[]>([])
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/periodic-table.json')
      .then((res) => res.json())
      .then((data: PeriodicTableData) => {
        setElements(data.elements)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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

  // Throttle temperature updates to reduce re-renders when dragging the slider.
  // Sidebar/TopBar still update their local xstate immediately for responsive UI;
  // the route state (and PeriodicTable) updates at most every 100ms.
  const handleTemperatureChange = useThrottledCallback(
    (temp: number) => setTemperature(temp),
    { wait: 100 },
  )

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
      {!loading && (
        <Sidebar 
          elements={elements}
          onTemperatureChange={handleTemperatureChange}
          onActiveChange={handleActiveChange}
          onReset={handleReset}
          onOpenChange={setSidebarOpen}
        />
      )}

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
