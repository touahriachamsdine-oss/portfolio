# TOUAHRIA Chams Eddine — Portfolio

Dark cyberpunk portfolio built with **Next.js 14 + Tailwind CSS + Framer Motion**.

## Features
- **Live particle canvas** with cursor repulsion and node connections
- **Glitch effect** on hero name
- **Magnetic buttons** that follow the cursor
- **Custom animated cursor** with lag-spring ring
- **Floating animated shapes** in background
- **Scroll progress bar** at top of page
- **Dark / Light mode** toggle with smooth transition
- **Scroll-triggered reveals** on every section
- **Animated skill bars** triggered on scroll
- **Scanline + noise overlay** for texture depth
- **Fully responsive** — mobile-first

## Setup

```bash
# 1. Clone / create project
npx create-next-app@latest portfolio --typescript --tailwind --app

# 2. Install dependencies
npm install framer-motion

# 3. Replace files
# - Copy portfolio_dmc.jsx  →  app/page.tsx  (rename default export if needed)
# - Copy layout.tsx         →  app/layout.tsx
# - Copy globals.css        →  app/globals.css
# - Copy tailwind.config.js →  tailwind.config.js
# - Copy package.json       →  package.json

# 4. Run
npm run dev
```

## Customize

1. **Contact info** — search for `your.email@example.com`, `+213 XXX XXX XXX`, `@your_handle` and replace with real ones.
2. **Projects** — edit the `PROJECTS` array in `page.tsx`.
3. **Timeline** — edit `TIMELINE` array.
4. **CV download** — put your CV in `/public/cv.pdf` and change `href="#"` on the Download CV button to `href="/cv.pdf"`.

## Deploy (free)

```bash
# Vercel (easiest)
npx vercel

# OR push to GitHub, connect on vercel.com — auto-deploys on every push
```

---
Built for TOUAHRIA Chams Eddine — T.CDE
