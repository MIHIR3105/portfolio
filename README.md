# Mihir Panchal — Portfolio

A modern, recruiter-focused portfolio built with semantic HTML, modular CSS, and minimal JavaScript.

## How to run locally
- Open `index.html` directly in your browser, or
- Use a local dev server (VS Code Live Server, `python -m http.server`, etc.).

## Project structure
```
index.html
assets/
  images/
  icons/
  MihirPanchal.pdf
css/
  base.css
  utilities.css
  components.css
  sections.css
js/
  main.js
  animations.js
```

## Where to edit content
- **Hero/About/Experience/Skills/Contact:** `index.html`
- **Projects:** `index.html` → `#projects` section (cards + filter categories)
- **Social links:** `index.html` → About + Contact sections
- **Theme styles:** `css/base.css` (CSS variables)
- **Components/Layouts:** `css/components.css`, `css/sections.css`

## Replace resume
- Replace `assets/MihirPanchal.pdf` with your latest resume (same filename).

## Customize OG image
- Update `assets/images/og-preview.png` and edit the Open Graph tags in `index.html` if needed.

## Notes
- Theme preference is saved in `localStorage`.
- Animation respects `prefers-reduced-motion`.
