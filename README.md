# Mihir Panchal — Portfolio

A modern, recruiter-focused portfolio built with semantic HTML, a single CSS file, and minimal JavaScript.

## How to run locally
- Open `index.html` directly in your browser, or
- Use a local dev server (VS Code Live Server, `python -m http.server`, etc.).

## Project structure
```
index.html
styles.css
script.js
assets/
  images/
  MihirPanchal.pdf
  fox.svg
  postman.svg
```

## Where to edit content
- **Hero/About/Experience/Skills/Contact:** `index.html`
- **Projects:** `index.html` → `#projects` section
- **Social links:** `index.html` → About + Contact sections
- **Theme styles & components:** `styles.css`
- **Interactions/animations:** `script.js`

## Replace resume
- Replace `assets/MihirPanchal.pdf` with your latest resume (same filename).

## Notes
- Theme preference is saved in `localStorage`.
- Animation respects `prefers-reduced-motion`.
