import {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { Element, PeriodicTableData } from "../../types/element";
import type { TemperaturePhase } from "../../machines/temperatureMachine";
import { getElementPhase } from "../../machines/temperatureMachine";
import ElementCard from "./ElementCard";
import ElementModal from "./ElementModal";

interface PeriodicTableProps {
  temperature?: number;
  isActive?: boolean;
}

const visibilityObserverOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "160px",
  threshold: 0,
};

function useVisibleElementNumbers(elements: Element[]) {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(
    () => new Set()
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleElementsRef = useRef<Set<number>>(new Set());
  const elementNodesRef = useRef(new Map<number, HTMLButtonElement>());
  const elementRefCallbacksRef = useRef(
    new Map<number, (node: HTMLButtonElement | null) => void>()
  );

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setVisibleElements(new Set(elements.map((element) => element.number)));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      let changed = false;
      const nextVisibleElements = new Set(visibleElementsRef.current);

      entries.forEach((entry) => {
        const elementNumber = Number(
          (entry.target as HTMLElement).dataset.elementNumber
        );

        if (!Number.isFinite(elementNumber)) return;

        if (entry.isIntersecting) {
          if (!nextVisibleElements.has(elementNumber)) {
            nextVisibleElements.add(elementNumber);
            changed = true;
          }
        } else if (nextVisibleElements.delete(elementNumber)) {
          changed = true;
        }
      });

      if (!changed) return;

      visibleElementsRef.current = nextVisibleElements;
      setVisibleElements(nextVisibleElements);
    }, visibilityObserverOptions);

    observerRef.current = observer;
    elementNodesRef.current.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      observerRef.current = null;
      visibleElementsRef.current = new Set();
      setVisibleElements(new Set());
    };
  }, [elements]);

  const registerElement = useCallback((elementNumber: number) => {
    const existingCallback = elementRefCallbacksRef.current.get(elementNumber);

    if (existingCallback) return existingCallback;

    const refCallback = (node: HTMLButtonElement | null) => {
      const previousNode = elementNodesRef.current.get(elementNumber);

      if (previousNode) {
        observerRef.current?.unobserve(previousNode);
        elementNodesRef.current.delete(elementNumber);
      }

      if (!node) {
        visibleElementsRef.current.delete(elementNumber);
        setVisibleElements(new Set(visibleElementsRef.current));
        return;
      }

      node.dataset.elementNumber = String(elementNumber);
      elementNodesRef.current.set(elementNumber, node);
      observerRef.current?.observe(node);
    };

    elementRefCallbacksRef.current.set(elementNumber, refCallback);
    return refCallback;
  }, []);

  return { registerElement, visibleElements };
}

export default function PeriodicTable({
  temperature = 298,
  isActive = false,
}: Readonly<PeriodicTableProps>) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { registerElement, visibleElements } = useVisibleElementNumbers(elements);

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
        <div className="periodic-table relative mx-auto min-w-[900px] max-w-[1400px]">
          {elements.map((element) => (
            <ElementCard
              key={element.number}
              element={element}
              ref={registerElement(element.number)}
              phase={
                isActive && visibleElements.has(element.number)
                  ? elementPhases[element.number]
                  : undefined
              }
              onClick={() => setSelectedElement(element)}
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
