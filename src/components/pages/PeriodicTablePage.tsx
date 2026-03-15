import { useState, useEffect, useDeferredValue } from "react";
import { useMachine } from "@xstate/react";
import {
  temperatureMachine,
  getTemperatureColor,
} from "../../machines/temperatureMachine";
import { PeriodicTable } from "../periodic-table";
import { Sidebar, TopBar } from "../sidebar";
import TemperatureBodyEffect from "../TemperatureBodyEffect";
import type { Element, PeriodicTableData } from "../../types/element";

export default function PeriodicTablePage() {
  const [state, send] = useMachine(temperatureMachine);
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);

  const { temperature, isActive } = state.context;
  const deferredTemperature = useDeferredValue(temperature);

  useEffect(() => {
    fetch("/periodic-table.json")
      .then((res) => res.json())
      .then((data: PeriodicTableData) => {
        setElements(data.elements);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <TemperatureBodyEffect isActive={isActive} temperature={temperature} />
      {/* Desktop Sidebar */}
      {!loading && <Sidebar state={state} send={send} elements={elements} />}

      {/* Mobile TopBar */}
      <TopBar state={state} send={send} />

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
        <PeriodicTable
          temperature={deferredTemperature}
          isActive={isActive}
        />
      </main>
    </>
  );
}
