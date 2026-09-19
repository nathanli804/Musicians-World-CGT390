# Musicians World

Fictional case-study web app for CGT 390, modeled loosely on Guitar Center's
structure (browse, filter, product detail). All content, branding, and
product data are made up for this assignment.

## Pages
- `/` — Home, with a hero and featured category tiles
- `/browse` — Product grid with working filters (category + price range)
- `/product/:id` — Product detail page
- `/lessons` — Static list of fictional lesson offerings

## Run locally
```
npm install
npm run dev
```
Then open the local URL Vite prints (usually http://localhost:5173).

## Build
```
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" → import the repo. Framework preset:
   Vite. Default build command (`npm run build`) and output directory
   (`dist`) both work as-is.
3. `vercel.json` in this repo adds the SPA rewrite rule so `/browse`,
   `/product/:id`, and `/lessons` don't 404 on a hard refresh in
   production.

## Known limitations (baseline stage)
- No backend/persistence — product and lesson data are hardcoded in
  `src/data/`.
- No images — category/product "images" are colored placeholder blocks.
- No cart, checkout, or lesson booking flow yet — filtering is the only
  interactive feature at this stage.
- Not yet reviewed for accessibility, SEO, or content polish — that's
  planned for later labs.
