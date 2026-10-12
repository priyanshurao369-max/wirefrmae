# ARMSCON wireframe

Clickable grayscale HTML for the PGIMS festival site (19–21 Nov 2026). No backend. Show this in a browser to the developer team.

## Open it

Serve the folder (needed for the brochure PDF and clean links):

```bash
npx --yes serve .
```

Then open the URL shown and start at `/` (landing).

## Walkthrough

1. **Landing** — 60% image, ARMSCON text-logo, copy, loader, then **Enter site**.
2. **Home** — logo left, countdown + **Menu** right, character slot, text-logo.
3. **Menu** — Home, Brochure, Workshops, Events, Cultural, Registration, Sponsors, Teams, About.
4. **Workshops / Events / Cultural** — sliding posters; tap for slide-up copy.
5. **Registration** opens the **Profile hub** (Registration / Login / Ticket).
6. Register: PGIMS vs other college → picks → Star Night + Mr & Miss ARMSCON → dummy **Pay** → logged-in profile with **4 QR tickets**.

## Dummy vs production

| Wireframe | Build later |
| --- | --- |
| Image slots | Real art / character / posters |
| `brochure.pdf` stub | Designed PDF |
| sessionStorage forms | Auth + database |
| Pay button | Payment gateway |
| CSS QR blocks | Generated QR tickets |

Fest name and dates are locked: **ARMSCON · 19–21 November 2026**. Workshop, sponsor, and team names are placeholders.
