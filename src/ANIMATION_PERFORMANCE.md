# Phase Animation Performance

This document explains why the temperature phase animations (solid, liquid, gas) use a `::before` pseudo-element and animate only `transform` and `opacity`, and why that performs better than animating `box-shadow` directly on the element card.

## TL;DR

**It's not about re-rendering.** React still re-renders the element cards when temperature changes. The performance gain comes from **which CSS properties we animate**:

- **Before:** Animating `box-shadow` in keyframes → triggers **repaint** every frame
- **After:** Static `box-shadow` on `::before` + animate `transform`/`opacity` → **compositor-only**, no repaint

---

## The Browser Rendering Pipeline

When the browser draws a page, it goes through several stages:

1. **Layout** — Calculate size and position of each element
2. **Paint** — Fill in pixels (colors, borders, shadows, etc.)
3. **Composite** — Layer elements and apply transforms/opacity on the GPU

Some properties only affect the **composite** step. Others force a full **repaint** (back to step 2).

| Property      | Triggers repaint? | Notes                                      |
| ------------- | ----------------- | ------------------------------------------ |
| `transform`   | No                | GPU handles it; layer is moved/scaled      |
| `opacity`     | No                | GPU blends the layer                       |
| `box-shadow`  | Yes               | Shadow shape/color changes require repaint |
| `filter`      | Yes (usually)     | Depends on filter type                     |
| `background`  | Yes               | Pixel data changes                         |

When we animate `box-shadow` in a keyframe, the browser must **repaint** the element (and often its neighbors) every frame. With 118 cards, that's a lot of repaint work.

When we animate `transform` or `opacity`, the browser can skip layout and paint. The compositor thread applies the change to an existing layer on the GPU. That's much cheaper.

---

## What Are Pseudo-Elements?

`::before` and `::after` are **CSS pseudo-elements**. They create extra boxes in the document without adding HTML:

```css
.element::before {
  content: "";  /* Required for pseudo-elements to appear */
  /* ... styles ... */
}
```

**Common uses:**

- Decorative shapes (borders, corners, icons)
- Clearfix hacks
- Overlays and masks
- **Separating concerns** — e.g., a glow layer that can be styled and animated independently

Here, the pseudo-element gives us a **separate layer** for the glow. We can put the expensive `box-shadow` on it and animate only cheap properties on that layer.

---

## What Is the Compositor?

The **compositor** is part of the browser's rendering engine. It:

1. Takes painted layers from the main thread
2. Sends them to the GPU
3. Applies transforms, opacity, and blending
4. Draws the final screen

It runs on a separate thread and can update the screen without blocking the main thread. Properties like `transform` and `opacity` are handled here, so animating them is smooth and cheap.

Properties that change how pixels are drawn (e.g. `box-shadow`, `background`, `border`) require the main thread to **repaint** first. That blocks other work and can cause jank.

---

## Our Approach

```
┌─────────────────────────────────────────────────────────────┐
│  Element Card (button)                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ::before pseudo-element                             │   │
│  │  • Static box-shadow (never animates)                 │   │
│  │  • Animated: transform: scale(), opacity              │   │
│  │  • Compositor handles animation → no repaint         │   │
│  └─────────────────────────────────────────────────────┘   │
│  Content (symbol, name, etc.)                               │
└─────────────────────────────────────────────────────────────┘
```

1. **Static box-shadow** — The glow is drawn once. No per-frame repaint.
2. **Animate transform + opacity** — Scale and opacity changes are handled by the compositor.
3. **Ripple effect** — `scale(1)` → `scale(1.1)` makes the glow expand and contract.
4. **Opacity pulse** — `opacity: 0.8` → `1` adds a subtle pulse.

The glow looks similar to the original, but the browser does far less work per frame.

---

## Why Not Animate box-shadow on the Pseudo-Element?

We could animate `box-shadow` on `::before` instead of on the card. The cost would be the same: animating `box-shadow` triggers repaint regardless of which element it's on. The gain comes from **not animating** `box-shadow` at all.

---

## References

- [CSS Triggers](https://csstriggers.com/) — Which properties trigger layout, paint, or composite
- [Rendering Performance (web.dev)](https://web.dev/rendering-performance/) — Overview of the rendering pipeline
- [Compositing (Chromium)](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/) — How Chrome uses the compositor
