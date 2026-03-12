import type { Element } from '../types/element'

interface ElementCardProps {
  element: Element
  onClick: () => void
}

export default function ElementCard({ element, onClick }: ElementCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="element-card group relative flex flex-col items-center justify-center rounded border border-[#ffd700]/50 bg-[var(--element-bg)] p-1 text-center text-center transition-all duration-200 hover:scale-110 hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.6),0_0_50px_rgba(255,215,0,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%), var(--element-bg)',
        boxShadow: '0 0 8px rgba(255,215,0,0.2), inset 0 0 10px rgba(255,215,0,0.05)',
      }}
      title={element.name}
    >
      <span className="element-number text-[9px] font-medium text-white/70">
        {element.number}
      </span>
      <span className="element-symbol text-lg font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
        {element.symbol}
      </span>
      <span className="element-name truncate text-[7px] leading-tight text-white/80">
        {element.name}
      </span>
      <span className="element-mass text-[7px] text-white/60">
        {element.atomic_mass.toFixed(2)}
      </span>
    </button>
  )
}
