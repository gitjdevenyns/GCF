---
platform: blog
kind: seo-landing-page-brief
status: draft
created: 2026-08-22
posted_url: null
target_keyword: "tide chart bradenton"
proposed_url: "/GCF/tides/bradenton"
claims:
  - "Five NOAA CO-OPS stations sit inside the Bradenton / Anna Maria footprint: Bradenton, Manatee River 8726247; Desoto Point 8726273; Palma Sola Bay North 8726249; Palma Sola Bay South 8726233; Cortez 8726217"
  - "The guide has 6 spots in the Bradenton region and 4 more in Anna Maria, and they do not all share a station"
  - "Each guide location is assigned the nearest station on the same body of water, because a station across a barrier island can be an hour off"
  - "All five Bradenton-footprint stations currently have live rows in public.tide_latest"
  - "Port Boca Grande 8725577 is the one harmonic reference station in the set; the rest are subordinate"
  - "Predicted heights are astronomical — wind and pressure routinely move the real water level"
  - "Every station id was verified against the CO-OPS metadata API"
  - "The site is a client-rendered SPA with one <title>, one meta description, no sitemap and no robots.txt"
sources:
  - src/data/locations.ts        # the five station constants and their verified NOAA names/ids; "Each location is assigned the nearest station on the same body of water, which matters more than raw distance: a station across a barrier island can be an hour off"; counted 6 region:'Bradenton' + 4 region:'Anna Maria'
  - src/data/tideGuide.ts        # "The fifteen NOAA CO-OPS stations that back the 25 locations, each verified against the CO-OPS metadata API"; the station area labels used as page section headings
  - src/pages/Tides.tsx          # existing /tides page structure; renders TIDE_GUIDE.principles (10 entries); "Predicted heights are astronomical — wind and pressure routinely move the real water level, so trust what you can see over what you read."
  - index.html                   # single <title>Gulf Coast Fishing Guide</title>, one meta description, no canonical, no OG tags
  - src/App.tsx                  # routes: no /tides/:place route exists today
  - public/                      # contains only assets/ and offline.html — no sitemap.xml, no robots.txt
  - https://nwpuausjhqtvwmjprphc.supabase.co/rest/v1/tide_latest   # queried 2026-08-22 with the site's own publishable key: rows present for 8725577, 8725667, 8725747, 8726217, 8726233, 8726247, 8726249, 8726273, 8726282
notes:
  - "This is a brief, not copy. It says what the page must contain and why;
     the fishing sentences on it still have to come out of src/data verbatim."
  - "Nothing here promises a ranking. It describes what would make the page
     deserve one."
---

# Landing page brief — `tide chart bradenton`

## The honest read on this keyword

`tide chart bradenton` is the top national completion for "tide chart", which
means it is also the most defended. The incumbents are tide aggregators with a
station feed and a template, one page per station, thousands of pages. We
cannot out-publish them and should not try.

What they cannot do is answer the question the searcher is *actually* asking.
"Bradenton" is not one tide. There are five NOAA stations inside this footprint,
and an aggregator will hand you whichever one its geocoder picked:

| Station | NOAA id | The water it is actually on |
|---|---|---|
| Bradenton, Manatee River | 8726247 | The Manatee River proper — the Green Bridge / Riverwalk stretch |
| Desoto Point | 8726273 | River mouth, immediately off Emerson Point / Snead Island |
| Palma Sola Bay North | 8726249 | Palma Sola Bay, north end |
| Palma Sola Bay South | 8726233 | Palma Sola Bay, south end |
| Cortez | 8726217 | Cortez / north Sarasota Bay, including Longboat Pass and the AMI bay side |

A page that explains *which of those five is yours, and why* is a different
document from a station table, and it is the only version of this page worth
building. The rule the guide already uses is the differentiator, stated plainly:
each location is assigned the nearest station **on the same body of water**,
because a station across a barrier island can be an hour off.

## What the page must contain

**1. The chart, above the fold, no scrolling and no interstitial.**
Today's highs and lows for **Bradenton, Manatee River 8726247** — the
exact-match station for the query — as times and heights, in station time,
rendered server-side or prerendered into the HTML. If the searcher has to wait
for JavaScript or pick something from a dropdown before they see a number, they
are gone, and so is the ranking. Everything else on this page is below that
table.

**2. "Which Bradenton station is mine?" — the section that earns the link.**
The five-row table above, each row saying what water that station is on, each
row linking to the guide spots that use it. Concretely:

- **8726247 Bradenton, Manatee River** → Green Bridge, Bradenton Riverwalk
- **8726273 Desoto Point** → Emerson Point / Snead Island
- **8726249 Palma Sola Bay North** → Palma Sola Bay
- **8726233 Palma Sola Bay South** → South Palma Sola Flats
- **8726217 Cortez** → Cortez Bridge, and just over the bridge: Bridge Street /
  Bradenton Beach, Longboat Pass, Coquina Beach

That list is also the internal-linking spine. Ten location pages, each a
genuine destination, each reachable in one click from the term with the most
volume in the whole keyword set.

**3. What the prediction is and is not.**
One short paragraph, using the wording the app already uses: predicted heights
are astronomical, so wind and pressure routinely move the real water level, and
you should trust what you can see over what you read. Also worth one line: of
the fifteen stations behind this guide, Port Boca Grande 8725577 is the one
harmonic reference station and the rest are subordinate. Aggregators do not say
either of these things. Saying them is both true and the reason a person
remembers where they read it.

**4. Why an angler wants the tide at all — briefly, then link out.**
Two or three sentences maximum, then a link up to `/tides`, which already
renders the ten researched tide principles from `src/data/tideGuide.ts` — the
four stages, wind, clarity, temperature, moon/tide range and safety. Do not
restate them here; a thin duplicate of a page we already have is worse than a
link to it, and `/tides` is the parent this URL should sit under anyway.

**5. A "nearest spots" block that is honest about access.**
For each of the six Bradenton-region spots: the name, the access type, the
structures, and the researched best window — quoted from the data, not
rewritten. Cortez Bridge, for example, is `walk-in shore · bridge`, `bridge ·
docks`, prime on the outgoing. That is the content an aggregator structurally
cannot have.

**6. The station's own NOAA page, linked, not scraped.**
Outbound to `tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726247`.
Linking the primary source costs nothing and is the correct signal.

## What the page must NOT contain

- **A "best time to fish Bradenton" score, chart, or star rating.** Every
  competitor has one. We have no catch data, so ours would be invented, and it
  would be the one false note on a page whose whole argument is that we show
  our work.
- **Seasons for the Bradenton spots.** None of the six has researched season
  data. Silence here means the research is not done, and the page must not
  paper over it with something plausible.
- **Bait shop or "where to buy shrimp in Bradenton" content.** `src/data/shops.ts`
  is empty. This keyword neighbours "bait shop near bradenton" and the
  temptation will be strong; that page gets written after the shops are
  verified, not before.
- **A keyword-stuffed footer.** No "bradenton tide chart, tide chart bradenton
  fl, bradenton florida tides" block. The five station names, the six spot
  names and the word Bradenton in the H1 and title are already the whole
  semantic field.

## Blocking technical work — this page cannot rank without it

This is the part to resolve before writing a word of copy.

The site is a client-rendered Vite SPA on GitHub Pages. Every route returns the
same `index.html`, with one `<title>` ("Gulf Coast Fishing Guide"), one generic
meta description, no canonical and no Open Graph tags. Deep links work only via
the `dist/404.html` fallback, which means every URL on the site is served to
crawlers as a soft 404 before JavaScript runs. There is no `sitemap.xml` and no
`robots.txt`. There is also no `/tides/:place` route — `/tides` is a single page
with a spot selector, so there is currently no URL to rank.

Minimum to make this page real, roughly in order:

1. A real `/tides/bradenton` route.
2. Prerendered HTML for it at build time — the tide table and the station
   section present in the served markup, not injected on hydrate. `vite-plugin-ssg`
   or a build-time prerender step over a fixed route list.
3. Per-route `<title>`, meta description, canonical and OG tags.
4. `sitemap.xml` and `robots.txt` in `public/`.
5. A daily rebuild, or a client-side refresh over the prerendered table, so the
   times are today's. A stale tide chart is worse than no tide chart.
6. `LocalBusiness`/`Place` structured data is **not** appropriate here; if any
   schema is used it should be `Dataset` or plain `FAQPage` for the "which
   station is mine" section, and only if that section is genuinely written as
   questions.

## One live-data caveat that affects the build

All five Bradenton-footprint stations currently have live snapshots in
`public.tide_latest` (checked 2026-08-22), so this page can be built against
real data today. Six of the fifteen stations do not — the Tampa Bay and Sarasota
ones added with the northern expansion. If this template is later cloned for
`tide chart st petersburg` or a Fort De Soto page, that gap has to be closed
first, or the cloned page ships with an empty chart.

## Title and H1 to work from

- `<title>`: Bradenton tide chart — which of the five stations is yours
- H1: Bradenton tide chart
- H2s: Today at Bradenton, Manatee River (8726247) · Which Bradenton station is
  yours · What a tide prediction is · Fishing spots on each station · The NOAA
  source

The subtitle does the differentiating; the H1 stays the bare query, because
that is what the person typed.
