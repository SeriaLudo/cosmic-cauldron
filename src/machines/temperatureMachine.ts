import { setup, assign } from "xstate";

export type TemperaturePhase = "solid" | "liquid" | "gas";

export interface TemperatureContext {
  temperature: number;
  isActive: boolean;
}

export type TemperatureEvent =
  | { type: "SET_TEMPERATURE"; temperature: number }
  | { type: "TOGGLE_ACTIVE" }
  | { type: "ACTIVATE" }
  | { type: "DEACTIVATE" }
  | { type: "RESET" };

/**
 * Temperature Machine
 *
 * Manages the temperature slider state and element phase transitions.
 *
 * States:
 * - inactive: Temperature effects are turned off (default view)
 * - active: Temperature effects are enabled and elements show phase states
 *
 * Context:
 * - temperature: Current temperature in Kelvin (0-6000K)
 * - isActive: Whether temperature effects are enabled
 */
export const temperatureMachine = setup({
  types: {
    context: {} as TemperatureContext,
    events: {} as TemperatureEvent,
  },
  actions: {
    // Set the temperature value
    setTemperature: assign({
      temperature: ({ event }) =>
        event.type === "SET_TEMPERATURE" ? event.temperature : 0,
    }),
    // Toggle the active state
    toggleActive: assign({
      isActive: ({ context }) => !context.isActive,
    }),
    // Activate temperature effects
    activate: assign({
      isActive: true,
    }),
    // Deactivate temperature effects
    deactivate: assign({
      isActive: false,
    }),
    // Reset to defaults
    resetTemperature: assign({
      temperature: 298, // Room temperature ~25°C
      isActive: false,
    }),
  },
}).createMachine({
  id: "temperature",
  initial: "inactive",
  context: {
    temperature: 298, // Room temperature in Kelvin (~25°C)
    isActive: false,
  },
  states: {
    // Inactive state - no temperature effects shown
    inactive: {
      on: {
        ACTIVATE: {
          target: "active",
          actions: "activate",
        },
        TOGGLE_ACTIVE: {
          target: "active",
          actions: "activate",
        },
        SET_TEMPERATURE: {
          actions: "setTemperature",
        },
        RESET: {
          actions: "resetTemperature",
        },
      },
    },
    // Active state - temperature effects enabled
    active: {
      on: {
        DEACTIVATE: {
          target: "inactive",
          actions: "deactivate",
        },
        TOGGLE_ACTIVE: {
          target: "inactive",
          actions: "deactivate",
        },
        SET_TEMPERATURE: {
          actions: "setTemperature",
        },
        RESET: {
          actions: "resetTemperature",
        },
      },
    },
  },
});

/**
 * Helper function to determine element phase based on temperature
 *
 * @param temperature - Current temperature in Kelvin
 * @param melt - Melting point in Kelvin (null if unknown)
 * @param boil - Boiling point in Kelvin (null if unknown)
 * @returns The phase: 'solid', 'liquid', or 'gas'
 */
export function getElementPhase(
  temperature: number,
  melt: number | null,
  boil: number | null
): TemperaturePhase {
  // Handle unknown values
  if (melt === null && boil === null) {
    return "solid"; // Default to solid for unknown
  }

  // For gases with unknown boil, check if above 0K
  if (boil === null) {
    return temperature >= (melt ?? 0) ? "gas" : "solid";
  }

  // For solids with unknown melt
  if (melt === null) {
    return temperature >= boil ? "gas" : "solid";
  }

  // Normal case
  if (temperature >= boil) {
    return "gas";
  } else if (temperature >= melt) {
    return "liquid";
  } else {
    return "solid";
  }
}

/**
 * Get temperature color for background gradient
 * Maps temperature (0-6000K) to a color from icy blue to hot red/gold
 *
 * @param temperature - Temperature in Kelvin
 * @returns CSS color string
 */
export function getTemperatureColor(temperature: number): string {
  // Normalize to 0-1 range
  const t = Math.min(Math.max(temperature / 6000, 0), 1);

  if (t < 0.25) {
    // Cold: icy blue (#4169e1) to cool blue (#1e90ff)
    return `rgb(${Math.round(65 + t * 4 * 80)}, ${Math.round(105 + t * 4 * 80)}, ${Math.round(225 - t * 4 * 30)})`;
  } else if (t < 0.5) {
    // Cool to warm: blue (#1e90ff) to orange (#ffa500)
    const normalized = (t - 0.25) * 4;
    return `rgb(${Math.round(30 + normalized * 225)}, ${Math.round(144 + normalized * 20)}, ${Math.round(255 - normalized * 180)})`;
  } else if (t < 0.75) {
    // Warm to hot: orange (#ffa500) to red (#ff4500)
    const normalized = (t - 0.5) * 4;
    return `rgb(255, ${Math.round(165 - normalized * 100)}, ${Math.round(75 - normalized * 50)})`;
  } else {
    // Hot: red (#ff4500) to white-hot
    const normalized = (t - 0.75) * 4;
    return `rgb(255, ${Math.round(65 + normalized * 190)}, ${Math.round(25 + normalized * 230)})`;
  }
}

/**
 * Get a temperature description string
 */
export function getTemperatureDescription(temperature: number): string {
  if (temperature < 0) return "Absolute Zero";
  if (temperature < 20) return "Very Cold";
  if (temperature < 77) return "Cold (Liquid Nitrogen)";
  if (temperature < 273) return "Very Cold";
  if (temperature < 373) return "Room Temperature";
  if (temperature < 1000) return "Warm";
  if (temperature < 2000) return "Hot";
  if (temperature < 4000) return "Very Hot";
  return "Extremely Hot";
}
