import { useState, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { temperatureMachine } from '../../machines/temperatureMachine'
import { Flame, Snowflake, Droplets, Power, RotateCcw, Thermometer, ChevronRight, X } from 'lucide-react'

interface SidebarProps {
  onTemperatureChange: (temperature: number) => void
  onActiveChange: (active: boolean) => void
  onReset: () => void
  onOpenChange: (open: boolean) => void
}

export default function Sidebar({ onTemperatureChange, onActiveChange, onReset, onOpenChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Notify parent when open state changes
  useEffect(() => {
    onOpenChange(isOpen)
  }, [isOpen, onOpenChange])
  const [state, send] = useMachine(temperatureMachine)
  
  const { temperature, isActive } = state.context

  const handleTemperatureChange = (newTemp: number) => {
    send({ type: 'SET_TEMPERATURE', temperature: newTemp })
    onTemperatureChange(newTemp)
  }

  const handleToggle = () => {
    send({ type: 'TOGGLE_ACTIVE' })
    onActiveChange(!isActive)
  }

  const handleReset = () => {
    send({ type: 'RESET' })
    onReset()
  }

  const getTempColor = () => {
    const t = Math.min(Math.max(temperature / 6000, 0), 1)
    if (t < 0.33) return '#4169e1'
    if (t < 0.66) return '#ffa500'
    return '#ff4500'
  }

  const getPhaseIcon = () => {
    if (!isActive) return <Power size={16} />
    if (temperature < 273) return <Snowflake size={16} />
    if (temperature < 373) return <Droplets size={16} />
    return <Flame size={16} />
  }

  const getPhaseLabel = () => {
    if (!isActive) return 'Off'
    if (temperature < 273) return 'Frozen'
    if (temperature < 373) return 'Liquid'
    return 'Gas'
  }

  return (
    <>
      {/* Toggle Button - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-r-lg bg-[#0d1b2a]/90 text-[#ffd700] backdrop-blur-sm transition-all duration-200 hover:bg-[#0d1b2a]"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Sidebar Panel - overlays content */}
      <aside 
        className={`fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-[#ffd700]/20 bg-[#0d1b2a]/95 backdrop-blur-sm transition-transform duration-300 hidden lg:flex ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ffd700]/20 px-4">
          <div className="flex items-center gap-2">
            <Thermometer size={20} className="text-[#ffd700]" />
            <span className="text-lg font-bold text-white">Temperature</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Power Toggle */}
          <button
            onClick={handleToggle}
            className={`flex items-center justify-center gap-3 rounded-lg p-3 transition-all ${
              isActive 
                ? 'bg-[#ffd700]/20 text-[#ffd700]' 
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
            title={isActive ? 'Deactivate temperature' : 'Activate temperature'}
          >
            <Power size={20} />
            <span>{isActive ? 'On' : 'Off'}</span>
          </button>

          {isActive && (
            <>
              {/* Temperature Slider */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 uppercase tracking-wider">
                  Temperature
                </label>
                
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="6000"
                    value={temperature}
                    onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#ffd700]"
                    style={{
                      background: `linear-gradient(to right, #4169e1, #ffa500, #ff4500)`,
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>0K</span>
                  <span className="flex items-center gap-1">
                    {getPhaseIcon()}
                    {getPhaseLabel()}
                  </span>
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
                    {temperature < 273 ? 'Solid' : temperature < 373 ? 'Liquid' : 'Gas'}
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
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
                <div>Phase: {getPhaseLabel()}</div>
                <div>Temp: {temperature}K</div>
                <div>Active: {isActive ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
