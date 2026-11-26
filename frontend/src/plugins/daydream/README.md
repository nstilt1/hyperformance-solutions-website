# Daydream Filter plugin

The [Daydream Filter](https://alteredbrainchemistry.com) browser extension,
built into a website. A `requestAnimationFrame` loop drives the hue instead of
injected CSS keyframes, so rate and mode changes apply live without restarting
the cycle. The extension's slider curves (`calcSat`, `calcSpeed`, `calcFreq`)
are copied verbatim, odd constants included. Don't simplify them.

Visitors get a toggle (brain + ON/OFF) and a settings card with the
extension's controls: rate, saturation, full page vs. images and videos, In /
Out / In & Out, number of cycles. They also choose where the toggle lives:
**floating button** (bottom-right, the default) or **navbar**. Either way the toggle is one
pill: the brain toggles the filter and the rest of the pill opens settings. Settings persist in `localStorage`. The filter
starts **off**.

## Requirements

- Next.js App Router, React 18 or 19, TypeScript (or a JS project with
  TypeScript installed: it's `.ts`/`.tsx`, strict-mode clean).
- No other dependencies: plain CSS, inline icons, relative imports only.

## Add it to a site

1. Copy this folder to `src/plugins/daydream/` and `brain.png` to
   `public/plugins/daydream/brain.png`.
2. Import the CSS once, in the root layout:
   ```ts
   import "@/plugins/daydream/daydream.css"
   ```
3. Wrap the page content in an element the filter can target. Plugin UI must
   be **outside** it, or full-page mode recolors the controls too. By default
   that's `[data-site-content]`:
   ```tsx
   <div data-site-content>{children}</div>
   ```
4. Render the two placements (each shows itself only when chosen):
   ```tsx
   import { DaydreamNavbarToggle, DaydreamFloatingToggle } from "@/plugins/daydream"

   // in the navbar (inside the content wrapper is fine):
   <DaydreamNavbarToggle />

   // outside the content wrapper (e.g. next to it in the layout):
   <DaydreamFloatingToggle />
   ```
   If the site has a slot registry, register the default export instead: it's
   `{ id: "daydream", slots: { navbar, overlay } }`.
5. Optional, adapt to the host (call at module scope, e.g. where you register
   plugins):
   ```ts
   import { configureDaydream } from "@/plugins/daydream"
   configureDaydream({
     contentSelector: "main",              // element full-page mode filters
     storageKey: "mysite:daydream:v1",
     brainSrc: "/images/brain.png",
     // defaults: { ...DAYDREAM_DEFAULTS, placement: "navbar" },
   })
   ```
   CSS hooks: `--dd-panel-top` (navbar card offset below your header),
   `--dd-accent`, `--dd-z`.

Show it behind a photosensitivity warning: the effect produces rapidly
changing colors.

## Files

| File | What it is |
| --- | --- |
| `engine.ts` | Extension math, settings (normalize/load/save), config, rAF engine. No React. |
| `store.ts` | Shared state for all plugin components (`useDaydream`, `setDaydream`). |
| `TogglePill.tsx` | The pill: brain button layered over the settings button. |
| `NavbarToggle.tsx` / `FloatingToggle.tsx` | The two placements. |
| `DaydreamPanel.tsx` | Settings card (portaled to `<body>`). |
| `BrainIcon.tsx`, `icons.tsx` | Icons. |
| `daydream.css` | All styles, including the effect itself. |
