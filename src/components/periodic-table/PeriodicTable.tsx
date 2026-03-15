import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { Element, PeriodicTableData } from "../../types/element";
import type { TemperaturePhase } from "../../machines/temperatureMachine";
import { getElementPhase } from "../../machines/temperatureMachine";
import ElementCard from "./ElementCard";
import ElementModal from "./ElementModal";

interface PeriodicTableProps {
  temperature?: number;
  isActive?: boolean;
}

export default function PeriodicTable({
  temperature = 298,
  isActive = false,
}: Readonly<PeriodicTableProps>) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/periodic-table.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load periodic table data");
        return res.json();
      })
      .then((data: PeriodicTableData) => {
        setElements(data.elements);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Compute phase for each element based on temperature
  const elementPhases = useMemo(() => {
    const phases: Record<number, TemperaturePhase> = {};
    elements.forEach((element) => {
      phases[element.number] = getElementPhase(
        temperature,
        element.melt,
        element.boil
      );
    });
    return phases;
  }, [elements, temperature]);

  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const handleCardClick = useCallback((e: Event) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-element-number]"
    );
    if (card?.dataset.elementNumber) {
      const num = Number(card.dataset.elementNumber);
      const element = elementsRef.current.find((el) => el.number === num);
      if (element) setSelectedElement(element);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("click", handleCardClick);
    return () => container.removeEventListener("click", handleCardClick);
  }, [handleCardClick, loading]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-white/70">Loading periodic table...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="periodic-table-container overflow-x-auto p-16">
        <div
          ref={containerRef}
          className="periodic-table relative mx-auto min-w-[900px] max-w-[1400px]"
        >
          {elements.map((element) => (
            <ElementCard
              key={element.number}
              element={element}
              phase={isActive ? elementPhases[element.number] : undefined}
              data-element-number={element.number}
            />
          ))}
        </div>
      </div>

      {selectedElement && (
        <ElementModal
          element={selectedElement}
          temperature={temperature}
          onClose={() => setSelectedElement(null)}
        />
      )}

      <div className="mt-8 text-center text-sm text-white/60">
        <p>Click on an element to view detailed information.</p>
        <p className="mt-2">
          <strong className="text-white/80">Note:</strong> On mobile, scroll
          horizontally to view the full table. Pinch to zoom for better
          visibility on small screens.
        </p>
      </div>
    </>
  );
}
