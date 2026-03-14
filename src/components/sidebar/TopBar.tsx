import { useMachine } from "@xstate/react";
import { temperatureMachine } from "../../machines/temperatureMachine";
import {
  Flame,
  Snowflake,
  Droplets,
  Power,
  RotateCcw,
  Thermometer,
} from "lucide-react";

interface TopBarProps {
  onTemperatureChange: (temperature: number) => void;
  onActiveChange: (active: boolean) => void;
  onReset: () => void;
}

export default function TopBar({
  onTemperatureChange,
  onActiveChange,
  onReset,
}: Readonly<TopBarProps>) {
  const [state, send] = useMachine(temperatureMachine);

  const { temperature, isActive } = state.context;

  const handleTemperatureChange = (newTemp: number) => {
    send({ type: "SET_TEMPERATURE", temperature: newTemp });
    onTemperatureChange(newTemp);
  };

  const handleToggle = () => {
    send({ type: "TOGGLE_ACTIVE" });
    onActiveChange(!isActive);
  };

  const handleReset = () => {
    send({ type: "RESET" });
    onReset();
  };

  const getTempColor = () => {
    const t = Math.min(Math.max(temperature / 6000, 0), 1);
    if (t < 0.33) return "#4169e1";
    if (t < 0.66) return "#ffa500";
    return "#ff4500";
  };

  const getPhaseIcon = () => {
    if (!isActive) return <Power size={14} />;
    if (temperature < 273) return <Snowflake size={14} />;
    if (temperature < 373) return <Droplets size={14} />;
    return <Flame size={14} />;
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex flex-wrap items-center justify-between border-b border-[#ffd700]/20 bg-[#0d1b2a]/95 px-4 py-2 backdrop-blur-sm lg:hidden">
      <div className="flex items-center gap-2 text-white">
        <Thermometer size={18} className="text-[#ffd700]" />
        <span className="font-bold">Periodic Table</span>
      </div>

      <div className="flex items-center gap-3">
        {isActive && (
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold"
              style={{ color: getTempColor() }}
            >
              {temperature}K
            </span>
            <span className="text-white/50">{getPhaseIcon()}</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          className={`rounded-full p-2 ${
            isActive
              ? "bg-[#ffd700]/20 text-[#ffd700]"
              : "bg-white/10 text-white/50"
          }`}
        >
          <Power size={18} />
        </button>

        {isActive && (
          <button
            onClick={handleReset}
            className="rounded-full bg-white/10 p-2 text-white/50 hover:bg-white/20 hover:text-white"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {isActive && (
        <div className="mt-2 w-full">
          <input
            type="range"
            min="0"
            max="6000"
            value={temperature}
            onChange={(e) => handleTemperatureChange(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#ffd700]"
            style={{
              background: `linear-gradient(to right, #4169e1, #ffa500, #ff4500)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-white/40">
            <span>0K</span>
            <span>3000K</span>
            <span>6000K</span>
          </div>
        </div>
      )}
    </header>
  );
}
