import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

import type { Element } from "#/types/element";
import { getElementPhase } from "../../machines/temperatureMachine";

function formatElectronConfig(value: string): ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /([spdf])(\d+)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = re.exec(value)) !== null) {
    parts.push(
      value.slice(lastIndex, match.index),
      match[1],
      <sup key={`ec-${key++}`}>{match[2]}</sup>
    );
    lastIndex = re.lastIndex;
  }
  parts.push(value.slice(lastIndex));
  return parts;
}

interface ElementModalProps {
  element: Element;
  temperature?: number;
  onClose: () => void;
}

export default function ElementModal({
  element,
  temperature = 298,
  onClose,
}: Readonly<ElementModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => dialogRef.current?.close();
  }, []);

  const handleClose = () => dialogRef.current?.close();

  // Calculate phase based on temperature
  const currentPhase = getElementPhase(temperature, element.melt, element.boil);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-0 flex max-h-none w-full max-w-none items-center justify-center border-none bg-transparent p-4 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      aria-modal="true"
      aria-labelledby={`element-${element.number}-title`}
    >
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        onClick={handleClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-(--element-border) bg-(--modal-bg) p-6 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <header className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-(--element-border) bg-(--element-bg) shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <span className="text-3xl font-bold text-(--element-symbol)">
              {element.symbol}
            </span>
            <span className="text-sm text-(--element-number)">
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
          <p className="leading-relaxed text-white/80">{element.summary}</p>
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
            <span className="text-lg font-semibold text-white capitalize">
              {currentPhase}
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
              {element.group ?? "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-[#ffd700]">
              Density
            </span>
            <span className="text-lg font-semibold text-white">
              {element.density ? `${element.density} g/L` : "N/A"}
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
          <code className="block break-all rounded-lg bg-black border border-[#ffd700]/30 p-3 text-sm text-[#ffd700] whitespace-pre-wrap font-mono">
            {formatElectronConfig(element.electron_configuration_semantic)}
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
    </dialog>
  );
}
