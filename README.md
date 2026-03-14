# Periodic Table

An interactive periodic table of elements built with modern web technologies, featuring a cosmic night sky theme.

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Building For Production

```bash
npm run build
```

## Technologies

- **TanStack Start** - Full-stack React framework with file-based routing
- **TanStack Router** - Type-safe routing with automatic route generation
- **React 19** - UI library
- **XState** - State machine for temperature and element phase transitions
- **Tailwind CSS v4** - Utility-first CSS framework
- **CSS Grid** - Used for the periodic table layout (18 columns × 10 rows)
- **CSS Custom Properties** - Theme variables for dark/light mode and component styling

## CSS Architecture

The periodic table uses CSS Grid for layout:

```css
.periodic-table {
  display: grid;
  grid-template-columns: repeat(18, minmax(48px, 1fr));
  grid-template-rows: repeat(10, minmax(56px, 1fr));
}
```

Elements are positioned using inline styles with `gridColumn` and `gridRow` from the element data (`xpos`, `ypos`).

## Theme

The app features a "cosmic night sky" theme:

- Deep navy background (`#0d1b2a`)
- Element cards with radial gradients and glowing gold borders
- Gold accents throughout for a star-like appearance

## Features

- Click any element to view detailed information in a modal
- Dark/light theme toggle
- Responsive design with horizontal scroll on mobile

## Future Ideas

These are potential features to explore (not implemented):

### Temperature State

- Add XState for temperature (0K - 6000K slider)
- Elements change state (solid/liquid/gas) based on their melt/boil points
- Visual effects: freeze animation, melting glow, vaporizing particles

### Atomic Structure Visualization

- Canvas animation for any element using existing data
- **Bohr-style** – electrons as dots on circular shells, rotating at different speeds (uses `shells`)
- **Orbital clouds** – blurred circles or gradients for s/p/d/f shapes (parse `electron_configuration`)
- **Pulsing** – electrons fade in/out or scale to suggest probability (visual only)
- **Temperature** – faster motion at higher temp; use `melt` and `boil` for phase boundaries
- All driven by: `shells`, `electron_configuration`, `melt`, `boil`, `number`, `atomic_mass`

### Cosmic Cauldron

- Select multiple elements to "mix" together
- Show what compounds they form (requires compound database)
- Display reaction equations and product properties

### Biological Presets

- Show which elements exist in a human body (with percentages)
- Presets for: human, dog, cat, oak tree, rose, E. coli
- Cosmic: Moon, Mars, Jupiter, Sun composition
- Educational comparison views

### Element Category Overlays

- Color-code by category: noble gases, alkali metals, halogens, etc.
- Toggle overlays on/off
- Filter table by category
