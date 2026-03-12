import { useState, useEffect } from 'react'
import type { Element, PeriodicTableData } from '../types/element'
import ElementCard from './ElementCard'
import ElementModal from './ElementModal'

export default function PeriodicTable() {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/periodic-table.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load periodic table data')
        return res.json()
      })
      .then((data: PeriodicTableData) => {
        setElements(data.elements)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-white/70">Loading periodic table...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <>
      <div className="periodic-table-container overflow-x-auto pb-4">
        <div className="periodic-table relative mx-auto min-w-[900px] max-w-[1400px]">
          {elements.map((element) => (
            <ElementCard
              key={element.number}
              element={element}
              onClick={() => setSelectedElement(element)}
            />
          ))}
        </div>
      </div>

      {selectedElement && (
        <ElementModal
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      <div className="mt-8 text-center text-sm text-white/60">
        <p>
          Click on an element to view detailed information.
        </p>
        <p className="mt-2">
          <strong className="text-white/80">Note:</strong> On mobile, scroll horizontally to view the full table.
          Pinch to zoom for better visibility on small screens.
        </p>
      </div>
    </>
  )
}
