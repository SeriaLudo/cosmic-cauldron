import { X } from 'lucide-react'
import type { Element } from '../types/element'

interface ElementModalProps {
  element: Element
  onClose: () => void
}

export default function ElementModal({ element, onClose }: ElementModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`element-${element.number}-title`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-[var(--element-border)] bg-[var(--modal-bg)] p-6 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <header className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-[var(--element-border)] bg-[var(--element-bg)] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <span className="text-3xl font-bold text-[var(--element-symbol)]">
              {element.symbol}
            </span>
            <span className="text-sm text-[var(--element-number)]">
              {element.number}
            </span>
          </div>
          <div>
            <h2
              id={`element-${element.number}-title`}
              className="text-3xl font-bold text-white"
            >
              {element.name}
            </h2>
            <p className="text-white/70">{element.category}</p>
          </div>
        </header>

        <section className="mb-6">
          <p className="leading-relaxed text-white/80">
            {element.summary}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/10 p-4">
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Atomic Mass
            </span>
            <span className="text-lg font-semibold text-white">
              {element.atomic_mass.toFixed(4)} u
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Phase
            </span>
            <span className="text-lg font-semibold text-white">
              {element.phase}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Period
            </span>
            <span className="text-lg font-semibold text-white">
              {element.period}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Group
            </span>
            <span className="text-lg font-semibold text-white">
              {element.group ?? 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Density
            </span>
            <span className="text-lg font-semibold text-white">
              {element.density ? `${element.density} g/L` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Block
            </span>
            <span className="text-lg font-semibold text-white">
              {element.block}
            </span>
          </div>
        </div>

        <section className="mt-4">
          <h3 className="mb-2 text-lg font-semibold text-white">
            Electron Configuration
          </h3>
          <code className="block break-all rounded-lg bg-[#0d1b2a] border border-[#ffd700]/30 p-3 text-sm text-[#ffd700] whitespace-pre-wrap font-mono">
            {element.electron_configuration}
          </code>
        </section>

        {element.appearance && (
          <section className="mt-4">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Appearance
            </h3>
            <p className="text-white/80">{element.appearance}</p>
          </section>
        )}

        {(element.boil || element.melt) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {element.melt && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
                  Melting Point
                </span>
                <span className="text-lg font-semibold text-white">
                  {element.melt} K
                </span>
              </div>
            )}
            {element.boil && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
                  Boiling Point
                </span>
                <span className="text-lg font-semibold text-white">
                  {element.boil} K
                </span>
              </div>
            )}
          </div>
        )}

        {element.electronegativity_pauling && (
          <section className="mt-4">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Electronegativity
            </h3>
            <span className="text-lg font-semibold text-white">
              {element.electronegativity_pauling} (Pauling scale)
            </span>
          </section>
        )}

        {element.discovered_by && (
          <section className="mt-4">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Discovered By
            </h3>
            <p className="text-white/80">
              {element.discovered_by}
              {element.named_by && ` (named by ${element.named_by})`}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
