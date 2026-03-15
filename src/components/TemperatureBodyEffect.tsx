import { useEffect } from "react";
import { getTemperatureColor } from "../machines/temperatureMachine";

interface TemperatureBodyEffectProps {
  isActive: boolean;
  temperature: number;
}

/**
 * Applies temperature-related document styles when active.
 * Renders nothing; declaratively syncs body class and CSS variable to props.
 */
export default function TemperatureBodyEffect({
  isActive,
  temperature,
}: TemperatureBodyEffectProps) {
  useEffect(() => {
    if (isActive) {
      document.documentElement.style.setProperty(
        "--temp-glow",
        getTemperatureColor(temperature)
      );
      document.body.classList.add("temperature-active");
    } else {
      document.documentElement.style.removeProperty("--temp-glow");
      document.body.classList.remove("temperature-active");
    }
    return () => {
      document.documentElement.style.removeProperty("--temp-glow");
      document.body.classList.remove("temperature-active");
    };
  }, [isActive, temperature]);

  return null;
}
