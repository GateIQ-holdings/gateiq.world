# Gate IQ — Marketing Site

Public marketing site for [gateiq.com](https://gateiq.com).

Built with plain HTML + CSS. No build step. Deployed via GitHub Pages.

## Files

| File | Purpose |
|---|---|
| `index.html` | Prelaunch site — Glide showcase, founding-member signup, 5,000-spot countdown |
| `prelaunch.css` | Prelaunch styles (imports the shared design tokens) |
| `launch.html` | Full launch site (password-gated private preview) — goes live at launch |
| `site.css` | Launch site styles (Gate IQ design tokens + layout) |
| `colors_and_type.css` | Shared design tokens (colors, type, spacing, dark mode) |
| `theme-toggle.js` | Light/dark toggle, persists to localStorage |
| `footer.js` | Shared footer, injected into `#site-footer` |

## Prelaunch knobs

In `index.html`: `SPOTS_CLAIMED` sets the founding-spot countdown (5,000 total), and `WAITLIST_ENDPOINT` is the Formspree form both sites share.

## Editing

Edit `index.html` and `site.css` directly. Push to `main` — GitHub Pages deploys automatically.

## Design system

Visual language is defined in the private [GateIQ](https://github.com/GateIQ-holdings/GateIQ) repo under `Concierge Design System/design.md`. Keep this site in sync with those tokens.
