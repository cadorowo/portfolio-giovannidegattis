<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio Design & Media Rules

## Project Images
- **Aspect Ratio**: All photos and image previews inside project pages (`pagesContent.ts` / project detail views) **MUST ALWAYS** use a **4:3** aspect ratio (`aspect-ratio: 4 / 3`).
- **Image Processing**: Ensure source images are converted to WebP with proper EXIF orientation applied (`ImageOps.exif_transpose`), cropped or framed to 4:3 (e.g., 2000×1500), and optimized (WebP q=90).
- **Consistency**:
  - Home Grid Cards: Use each selected poster/video's real aspect ratio in a restrained masonry layout so the cards interlock without aggressive cropping. Keep the rounded card shape; do not force all cards to 1:1.
  - Project Detail Hero Posters: 4:3 squircle (`aspect-ratio: 4 / 3`).
  - Project Body Images: 4:3 (`aspect-ratio: 4 / 3`).
