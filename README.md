# Gulf Coast Fishing Guide (GCF)

Visual, mobile-first Southwest Florida saltwater fishing field guide PWA:
habitats, tide playbooks, 15 fishing locations with per-species tackle
recipes, rig/knot school, safe-handling guidance and photo species ID.
Works offline.

Live site: https://gitjdevenyns.github.io/GCF/

## Stack

- Vite + React + TypeScript, React Router (base path `/GCF/`)
- Leaflet (bundled locally; OSM street + Esri satellite layers)
- vite-plugin-pwa (Workbox `generateSW`): precached app shell, offline SPA
  fallback, network-first for Supabase, no opaque-response caching
- All guide content lives in typed modules under `src/data/` (schema in
  `src/data/types.ts`, per `docs/ARCHITECTURE.md` in the handoff repo)
- Supabase (project `gcf-app`) serves cached NOAA tide predictions and NWS
  forecasts, written every 3 hours by the `refresh-conditions` Edge Function
  and read through the `tide_latest` / `weather_latest` views (anon, read-only)

### Design system

`src/styles/` is a faithful port of the finished design system. `tokens.css`
and `base.css` are the shared foundation; `home.css`, `location.css` and
`pages.css` carry the per-screen components; `app.css` holds app plumbing the
design boards do not cover (desktop nav, focus rings, skeletons, empty/error
states, Leaflet theming). The muted-text and link values are WCAG-AA-corrected
— do not "simplify" `--m` back to `--n60` on light, or `--link` to `--b600` on
dark.

### Live data contract

`src/lib/conditions.ts` fixes the shapes and `useConditions(slug)` fixes the
hook signature. Four statuses — `loading`, `ready`, `error`, `unavailable` —
are all mandatory UI states, so a blank or crashed data card is
unrepresentable. Everything from these sources is a *prediction* (NOAA tides)
or a *forecast* (NWS), never an observation, and the UI must say so. A failed
refresh keeps the last good snapshot on screen and labels it stale.

The guide is complete and useful with **zero network**: all static content is
bundled, and the Supabase SDK is loaded dynamically only when a live read
actually happens.

### Photo ID (`/id`)

Take or upload a photo of a fish and get a species **estimate** back. The photo
is downscaled on the device (`src/lib/image.ts`, 1024px long edge), posted to
the `identify-fish` Edge Function, and never stored anywhere — not in Storage,
not in a table, not alongside the result.

The estimate is framed as an estimate everywhere it appears, which is a safety
requirement rather than modesty: two of the six Handle With Care species look,
to a casual eye, like fish people grab without thinking. So the model is allowed
to answer "I can't tell", an unidentified animal is always flagged as
potentially hazardous, a match deep-links to the guide's own researched content
rather than to model-authored handling advice, and no number on the screen ever
implies a calibrated probability.

It recognises sixteen species in three tiers, matching how much the guide
actually knows about each: the **5 documented target species**, the **6 Handle
With Care species**, and **5 more the location data names as targets** —
sheepshead, pompano, jack, Spanish mackerel and kingfish — which have no species
page but do have a researched rig and bait at each spot that lists them
(`src/data/namedTargets.ts`). A match in that third tier says plainly that there
is no page yet and links the location instead. Anything outside all three is
named honestly with no link at all.

`src/test/identify.data.test.ts` enforces both directions of that catalog: add a
location naming a new species and the build fails until that species is either
given a page or added to the named-target list, so the identifier cannot quietly
fall behind the guide.

`supabase/functions/identify-fish/README.md` documents the model call
(`claude-opus-5` with structured outputs), the measured cost — about **$0.026
per identification** — and the abuse controls, which matter because the site is
public and the API bill is the owner's: a request-size cap plus three rate-limit
windows (6/hour and 20/day per caller, 250/day globally, i.e. ~$6.50/day worst
case) enforced in Postgres *before* the paid call is made. `ANTHROPIC_API_KEY`
is a Supabase Function secret; CI greps `dist/` for it and fails the deploy on a
hit.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173/GCF/
```

Optional `.env.local` (never commit env files):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...   # publishable anon key only
```

## Build & test

```sh
npm run build      # tsc --noEmit + vite build -> dist/
npm test           # vitest: data integrity, content rules, every route, a11y
npm run preview    # serve the production build locally
npm run check:links # probe every external URL in the data (network; not in CI)
```

`check:links` is deliberately outside `npm test` because it hits the network.
Run it before a release: it re-probes every outbound image, video, source and
station URL and retries with a browser User-Agent before calling one broken,
so bot filtering is not mistaken for rot.

Embedded images are checked harder than page links. They are fetched with an
image `Accept` header and a real referer, and only pass if the response is
actually an image — a 403 from hotlink protection, or an HTML error page served
with a 200, renders as a blank slot for a reader and so counts as broken.

### Imagery for places

None of the fifteen locations has a licensed photograph, and none is expected
to: a verifiable, correctly-attributed photo of a minor local fishing spot is
not sourceable, and a mislabelled one is worse than none. Screens that need to
show a place render a **live Esri satellite map of its own coordinates**
instead — Home's "Go here now" card and the location hero band and access
panel. `MapView` takes `interactive={false}` for the backdrop case, which also
drops Leaflet's attribution control, so any caller using it must credit the
tile source in its own visible caption.

### Service worker

`workbox.globIgnores` hands the webmanifest and the three icons to
vite-plugin-pwa alone. If an asset is precached by both the plugin and
`globPatterns`, Workbox aborts the install with
`add-to-cache-list-conflicting-entries` and the app silently ships with **no
offline support**. The Workbox runtime is inlined (`inlineWorkboxRuntime`) so
that failure is loud rather than swallowed by the async module factory. After
changing anything under `VitePWA`, build and confirm Cache Storage actually
populates.

## Deploy model

Pushes to `main` run `.github/workflows/deploy.yml`, which builds and deploys
`dist/` to GitHub Pages via `actions/deploy-pages`.

The workflow is only active once the repository's Pages setting is switched
from "Deploy from a branch" to "GitHub Actions". `dist/404.html` (a copy of
`index.html`) makes deep links like `/GCF/locations/emerson-point` work on
Pages. Supabase env vars are injected from repo Actions secrets/vars when
present; the build does not require them.

## Verified state

Last full verification of this build:

- `npm run build` clean, no warnings; `npm test` 64 passing
- axe-core: no WCAG 2.1 A/AA violations across every route x light/dark x
  mobile/desktop
- Service worker installs, 21 precache entries; Home, a location page, a
  species page, Care and Tides all render offline with the network cut
- No service-role key or unknown token anywhere in `dist/` or in git history
- Supabase RLS confirmed public-read-only against the live project: anon
  SELECT works, anon INSERT and DELETE both return 401

## Content rules

- Palette is fixed: royal blue `#075bd8`, key lime `#8dff00`, black/white
  neutrals (+ red/amber for danger/warning). Tints/shades are documented as
  tokens in `src/styles/tokens.css`; no new hues.
- Verify current FWC regulations before presenting anything as legal guidance;
  keep official guidance, general tactics and local heuristics visually
  distinct.
- Fields the data schema types but v6 never researched (seasons, access
  notes, per-location sources) stay empty until researched — never invent
  fishing content.
