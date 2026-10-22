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
npm run dev:api   # terminal 1: booking API on :3001 (saves to .data/, or Redis if REDIS_URL is set)
npm run dev       # terminal 2: site on :5173, proxies /api to :3001
```
Then open the local URL Vite prints (usually http://localhost:5173).
Locally the staff key is `dev-staff-key`.

## Lesson booking API
Vercel Functions in `api/`. Bookings are stored in Redis (`REDIS_URL` from Vercel's
Redis integration, or Upstash REST variables).

- `POST /api/lesson-requests` (public): create a request.
  Body: `lessonId`, `name`, `email`, `preferredTime`
  (`weekday-morning` | `weekday-afternoon` | `weekday-evening` | `weekend`), optional `note`.
  Returns 201 with the request and a one-time `manageToken`.
- `GET /api/lesson-requests/{id}` (owner via `X-Manage-Token`, or staff): view one request.
- `DELETE /api/lesson-requests/{id}` (owner or staff): cancel a pending request.
- `GET /api/lesson-requests` (staff, `Authorization: Bearer <MW_STAFF_KEY>`): list all.

Errors: 400 invalid input, 401 missing credentials, 404 not found or not yours,
409 duplicate pending request / already cancelled, 415 not JSON, 422 unknown lesson,
503 storage not configured.

### Vercel setup
1. Project → Storage → add a **Redis** database and connect it to this project.
   That adds `REDIS_URL`. (Upstash's `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` also work.)
2. Project → Settings → Environment Variables → add `MW_STAFF_KEY` (any long random string).
3. Redeploy.

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
- Product and lesson catalog data are hardcoded in `src/data/`. Lesson
  booking requests are stored by the API (see above).
- No images — category/product "images" are colored placeholder blocks.
- No cart or checkout yet. No rate limiting on the booking API.
- Not yet reviewed for accessibility, SEO, or content polish — that's
  planned for later labs.
