# Giovanni De Gattis — Portfolio

Personal portfolio of Giovanni De Gattis, a communication designer working across visual identity, digital products, and systems. The site brings together selected projects, case studies, and interactive experiments, showing work that connects design and technology.

## Built with

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Run locally

Requires Node.js 24 or later and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run lint       # Lint the project
npm run typecheck  # Check TypeScript
npm run build      # Create a production build
npm run check      # Run lint, typecheck, and build
```

## Project structure

- `src/app/` — routes, layouts, and the contributions API
- `src/components/site/` — reusable portfolio components
- `src/data/cards.ts` — projects shown on the home page
- `src/data/pagesContent.ts` — case-study content
- `public/images/` — project images and media
