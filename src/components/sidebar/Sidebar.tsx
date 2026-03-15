import { useMemo } from "react";
import { useThrottledCallback } from "@tanstack/react-pacer";
import {
  getElementPhase,
  type TemperatureContext,
  type TemperatureEvent,
} from "../../machines/temperatureMachine";
import { Power, RotateCcw, Thermometer, ChevronRight, X } from "lucide-react";
import type { Element } from "../../types/element";

interface SidebarProps {
  state: { context: TemperatureContext };
  send: (event: TemperatureEvent) => void;
  elements: Element[];
}

export default function Sidebar({
  state,
  send,
  elements,
}: Readonly<SidebarProps>) {
  const { temperature, isActive, sidebarOpen } = state.context;

  const handleTemperatureChange = useThrottledCallback(
    (temp: number) => send({ type: "SET_TEMPERATURE", temperature: temp }),
    { wait: 100 }
  );

  // Calculate phase counts for all elements at current temperature
  const phaseCounts = useMemo(() => {
    const counts = { solid: 0, liquid: 0, gas: 0 };
    elements.forEach((element) => {
      const phase = getElementPhase(temperature, element.melt, element.boil);
      counts[phase]++;
    });
    return counts;
  }, [elements, temperature]);

  const getTempColor = () => {
    const t = Math.min(Math.max(temperature / 6000, 0), 1);
    if (t < 0.33) return "#4169e1";
    if (t < 0.66) return "#ffa500";
    return "#ff4500";
  };

  return (
    <>
      {/* Toggle Button - always visible */}
      <button
        onClick={() => send({ type: "TOGGLE_SIDEBAR" })}
        className="fixed left-0 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-r-lg bg-[#0d1b2a]/90 text-[#ffd700] backdrop-blur-sm transition-all duration-200 hover:bg-[#0d1b2a]"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Sidebar Panel - overlays content */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-[#ffd700]/20 bg-[#0d1b2a]/95 backdrop-blur-sm transition-transform duration-300 hidden lg:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ffd700]/20 px-4">
          <div className="flex items-center gap-2">
            <Thermometer size={20} className="text-[#ffd700]" />
            <span className="text-lg font-bold text-white">Temperature</span>
          </div>
          <button
            onClick={() => send({ type: "CLOSE_SIDEBAR" })}
            className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Power Toggle */}
          <button
            onClick={() => send({ type: "TOGGLE_ACTIVE" })}
            className={`flex items-center justify-center gap-3 rounded-lg p-3 transition-all ${
              isActive
                ? "bg-[#ffd700]/20 text-[#ffd700]"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
            title={isActive ? "Deactivate temperature" : "Activate temperature"}
          >
            <Power size={20} />
            <span>{isActive ? "On" : "Off"}</span>
          </button>

          {isActive && (
            <>
              {/* Temperature Slider */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="sidebar-temperature-slider"
                  className="text-xs text-white/60 uppercase tracking-wider"
                >
                  Temperature
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="sidebar-temperature-slider"
                    type="range"
                    min="0"
                    max="6000"
                    value={temperature}
                    onChange={(e) =>
                      handleTemperatureChange(Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#ffd700]"
                    style={{
                      background: `linear-gradient(to right, #4169e1, #ffa500, #ff4500)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>0K</span>
                  <span>6000K</span>
                </div>
              </div>

              {/* Current Temperature Display */}
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: getTempColor() }}
                  >
                    {temperature}K
                  </div>
                  <div className="text-xs text-white/60">
                    Global Temperature
                  </div>
                </div>
              </div>

              {/* Phase Counts */}
              <div className="rounded-lg bg-white/5 p-3">
                <div className="mb-2 text-xs text-white/40 uppercase tracking-wider">
                  Elements at {temperature}K
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-blue-400">
                      {phaseCounts.solid}
                    </span>
                    <span className="text-xs text-white/50">Solid</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-orange-400">
                      {phaseCounts.liquid}
                    </span>
                    <span className="text-xs text-white/50">Liquid</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-red-400">
                      {phaseCounts.gas}
                    </span>
                    <span className="text-xs text-white/50">Gas</span>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => send({ type: "RESET" })}
                className="flex items-center justify-center gap-2 rounded-lg bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white"
                title="Reset temperature"
              >
                <RotateCcw size={16} />
                <span className="text-sm">Reset</span>
              </button>
            </>
          )}

          {isActive && (
            <div className="mt-auto rounded-lg border border-[#ffd700]/10 p-3">
              <div className="mb-2 text-xs text-white/40 uppercase tracking-wider">
                Animation Debug
              </div>
              <div className="space-y-1 text-xs text-white/30">
                <div>Temp: {temperature}K</div>
                <div>Active: {isActive ? "Yes" : "No"}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
