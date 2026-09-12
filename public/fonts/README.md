# CHANDRA — Commercial Production Fonts Directory

This directory is designated for the client-provided licensed commercial WOFF2 font files.

## Required Production Files:
1. `MonumentGrotesk-Condensed-Heavy.woff2` (Primary Display: `MOVE PEOPLE`, campaign titles)
2. `MonumentGrotesk-Regular.woff2` (Secondary Display: Project titles, section titles)
3. `MonumentGrotesk-Medium.woff2` (Secondary Display bold accents)
4. `MonumentGrotesk-SemiMono.woff2` (Technical meta, timestamps, production counts)
5. `Sohne-Buch.woff2` (Functional / UI: body text, paragraphs, captions)
6. `Sohne-Medium.woff2` (Functional / UI: navigation, buttons, labels, metadata)
7. `Canela-Light.woff2` / `TiemposHeadline-Light.woff2` (Optional editorial serif accents)

## Current Status:
Temporary fallbacks are active in CSS variables (`--font-display-condensed`, `--font-display`, `--font-body`, `--font-mono`, `--font-serif`).
Once licensed files are placed in this folder, the `@font-face` declarations in `src/styles/tokens.css` will seamlessly take precedence without modifying any layout or component code.
