# Shops — Sarasota / Englewood / Placida / Boca Grande

Research output, **not yet integrated**. Region 3 of 4. Reviewer decides what
reaches `src/data/shops.ts`.

Researched serially (no sub-agents) via direct WebFetch against business
sites, OSM Overpass, US Census geocoder, and FWC boating guides — session
WebSearch budget was already exhausted. Budget: 40 web fetches total, max 4
businesses chased per area. Written incrementally, section by section.

## QUESTIONS FOR THE OWNER

1. **Miller's Marina, Boca Grande** — this is the marina I'd expect to be the
   answer for bait/tackle right at Boca Grande Pass (historic, tarpon-season
   fixture), but **millersmarina.com is a parked GoDaddy placeholder page**,
   not a live business site (footer reads "Copyright © 1999-2026 GoDaddy,
   LLC" — the standard parked-domain signature). I could not confirm from
   any other source within budget whether Miller's Marina is (a) still
   operating without a website, (b) operating under a different web
   presence/name, or (c) actually closed. **Is it still open, and if so does
   it sell bait?** This matters a lot — right now Boca Grande Pass, one of
   the most famous fishing spots in the state, has **zero confirmed bait
   source** in this file.
2. **CB's Saltwater Outfitters (Sarasota)** — their own site publishes
   "1249 Stickney Point Rd," but the US Census geocoder only matched "1249
   **Old** Stickney Point Rd" (a parallel street a block over). Same
   business, just imprecise self-published address, or a genuine
   discrepancy worth a phone check before publishing the pin?

## Area 1 — Sarasota (New Pass / Ken Thompson Park, South Lido Park / Big Sarasota Pass)

### CONFIRMED OPEN

**1. New Pass Grill & Bait Shop** — right at Ken Thompson Park / New Pass · HIGH
1505 Ken Thompson Pkwy, Sarasota FL 34236 · Bait shop 941-388-1618 (grill
941-388-3050, charters/Capt. Matt 941-952-8792) · newpassgrill.com ·
**27.3318, -82.5808** (US Census exact match) · kind: bait / tackle / grill /
charter booking ·
carries: **live bait**, "full tackle wall", ice, pole rentals (first-party;
species not itemized) · hours: **daily 7am–6pm, bait shop opens 6am**
(first-party) · Recency: footer © 2025.

**2. Economy Tackle / Dolphin Paddlesports** — long-running Sarasota tackle
shop, now co-branded with a paddlesports outfitter · HIGH
6018 S Tamiami Trail, Sarasota FL 34231 · 941-922-9671 ·
economytackle.com (⚠️ now **redirects** to floridakayak.com — same business,
combined site, not a dead-domain trap, see below) · **27.2667, -82.5285**
(US Census exact match) · kind: tackle / bait / kayak & paddleboard outfitter ·
carries: **live bait — shrimp and worms** (first-party), plus "largest
selection of salt and fresh water, fly and spinning tackle in Sarasota" ·
hours: **Mon–Sat 8am–6pm, Sun 9am–3pm** (first-party) · Recency: © 2026
footer, blog posts dated Aug 2026 — strong recency signal. In business since
1948 per their own site. South of New Pass/South Lido, on the mainland;
closer to Big Sarasota Pass side of the trip than to New Pass.

**3. CB's Saltwater Outfitters** · MEDIUM — hours unverified
1249 Old Stickney Point Rd, Sarasota FL 34242 (site publishes "1249 Stickney
Point Rd, Siesta Key, FL 34242" — Census matched it to "Old Stickney Point
Rd", a block off the numbered highway; **flag for the reviewer**) ·
941-349-4400 · cbsoutfitters.com · **27.2524, -82.5337** (US Census exact
match on the "Old Stickney Point Rd" form) · kind: tackle / bait / marina
services · carries: self-described "largest on the water Bait & Tackle Shop
in Sarasota" and "A COMPLETE BAIT & TACKLE SHOP" (first-party) — **species not
itemized on the pages fetched** · hours: **null**, not published on the
homepage or /contact · Recency: footer "© 2026", displays a 2025 TripAdvisor
Travelers' Choice badge. Near the south bridge to Siesta Key, a plausible
Big Sarasota Pass staging point but several miles from South Lido Park itself.

### OPEN BUT NOT A BAIT/TACKLE SOURCE

- **Ingman Marine at Cannons Marina**, 6040 Gulf of Mexico Dr, Longboat Key FL
  34228 · 941-383-1311 · cannonsmarina.com → redirects within the same
  operator's site · © 2025 footer, open. Boat dealership (new/used boats,
  Yamaha outboards, rentals, brokerage) directly on New Pass. **No bait or
  tackle sale stated anywhere.** Do not list as a bait source.

### BOAT RAMPS

- **Ken Thompson Park boat ramp**, Ken Thompson Pkwy, City Island, Sarasota —
  **27.3326, -82.5758** *(OSM way tagged leisure=slipway; coordinate is
  geometry-derived, not an address centroid)*. Lanes, fee, and open/closed
  status **not verified** — Sarasota County's own park pages (scgov.net)
  returned HTTP 403 to WebFetch and no alternate source was chased within
  budget. Same island as New Pass Grill & Bait Shop, ~200m away.
- **South Lido Park** — could not confirm from any source fetched whether it
  has a trailer boat ramp or is beach/kayak-launch only. **Do not assert
  either way**; treat as unverified.

### COULD NOT VERIFY — unchased leads

- No dedicated bait/tackle shop found within South Lido Park itself; nearest
  confirmed live bait to that specific spot is CB's Saltwater Outfitters
  (several miles south) or New Pass Grill (across the bay to the north).
  Worth a phone-directory pass if budget allows.

## Area 2 — Englewood (Englewood Beach, Stump Pass, Lemon Bay)

**Method note:** OSM Overpass returned zero shop=bait/tackle and zero
leisure=marina nodes in a bbox covering all of Englewood/Manasota
Key/Lemon Bay — this rural stretch is simply not well-tagged in OSM.
DuckDuckGo and Yelp both blocked WebFetch (CAPTCHA / 403); Google's SERP
returned almost no usable content. Coverage here relies on direct fetches
of guessed/known domains and is thinner than Area 1.

### ⚠️ TRAPS FOUND

- **englewoodbaitandtackle.com** — the domain now 302-redirects to an
  **Afternic "domain for sale" page**. Either the business closed and the
  domain lapsed, or this name was never a live business with its own site.
  **Do not list a business under this name without independent confirmation
  it ever existed at a specific address.**
- **eldredsmarina.com** — fetched three ways (plain, `http://`, and via a
  read-proxy). Every attempt returned an essentially content-free page; the
  proxied fetch showed a **GoDaddy "Copyright © 1999-2026 GoDaddy, LLC"**
  footer, the signature of a **parked/placeholder GoDaddy page**, not a live
  business site. Address/phone for "Eldred's Marina" **could not be
  confirmed from any source reached**. Do not list without a working
  first-party source or phone confirmation.

### CONFIRMED OPEN (regional, not on-the-water at Englewood itself)

**1. Fishin' Frank's Bait & Tackle** · HIGH on identity/hours, but **not
Englewood proper**
4200 Unit P Tamiami Trail, Port Charlotte FL 33952 · 941-625-3888 ·
fishinfranks.com · **coordinate not geocoded (budget)** ·
kind: tackle / bait — large-format store ·
carries — live: shrimp, crabs, fish, worms, minnows, night crawlers,
shiners. frozen: shrimp, mullet, sardines, crabs, ballyhoo, sand fleas,
clams, shiners, jacks, ladyfish, bonita, finger mullet, greenbacks, cigar
minnows (first-party, extensive list) ·
hours: **Mon–Thu 6am–6:30pm, Fri–Sat 6am–7pm, Sun 6am–6pm** (first-party) ·
Recency: no copyright date found on the page, but content reads current.
⚠️ **This is a Port Charlotte address, roughly 8–9 miles from Englewood
Beach/Lemon Bay by road** — the largest, best-documented bait/tackle stock
found for this whole area, but a real drive from the pass itself. Flag for
the reviewer to decide if it belongs in this region's guide at all, or as
a "stock up before you go" note.

### MARINA — bait/tackle not confirmed

**2. Stump Pass Marina** (Suntex-operated) · confirmed real, VERIFY on bait
260 Maryland Ave, Englewood FL 34224 · 941-697-2206 ·
stumppassmarina.com · **coordinate not geocoded (budget)** ·
kind: marina (dry storage, fuel dock, ship store, Lighthouse Grill and Tiki
Bar on site) · carries: **site states "fuel dock, ship store, dry
storage" but never states bait or tackle anywhere in the page or nav
fetched** — do not claim bait · hours: null · Recency: 2026 (image
timestamps in source). Directly on Stump Pass, the closest marina found to
the target inlet.

### COULD NOT VERIFY / TODO — not chased (budget)

- No dedicated live-bait shop confirmed **on Manasota Key or right at
  Englewood Beach/Stump Pass itself** — everything findable within budget
  was either a Port Charlotte drive (Fishin' Frank's) or a marina with an
  unconfirmed ship-store stock (Stump Pass Marina).
- Chamber of Commerce directory (business.englewoodchamber.com) returned
  **zero results** for a "bait" keyword search — either their directory is
  incomplete or no member is categorized that way. Not conclusive.
- Worth a follow-up call to Stump Pass Marina's ship store (941-697-2206) to
  ask directly whether they carry live or frozen bait — this would resolve
  the biggest gap in this area.
- Names not chased at all due to budget: any shop directly on Englewood
  Beach Rd / Beach Rd on Manasota Key, and any bait source at the north end
  of Lemon Bay (Cedar Point / Englewood mainland).

## Area 3 — Placida (Gasparilla Sound)

**Budget note:** the 40-fetch cap was reached partway through this area.
Only one business was fully chased; the rest is TODO. This is the expected,
documented outcome per the task's hard rules, not a skipped step.

### CONFIRMED OPEN

**1. Gasparilla Marina** — self-described "Placida's largest deep water
marina" · HIGH on identity, coordinate UNVERIFIED
15001 Gasparilla Rd, Placida FL 33946 · 800-541-4441 (main), 941-697-2280
(alt), 941-698-1750 (service dept) · gasparillamarina.com ·
**lat/lng: no match** — US Census geocoder returned zero matches for this
address; **not geocoded, pull from Google Maps/OSM before publishing** ·
kind: marina / bait / tackle / fuel ·
carries: **frozen squid, rigged sardines, mullet, chum blocks** (first-party)
plus sportfishing apparel, sunglasses, ice, beverages, snacks. **No live
bait stated** — do not claim live bait · hours: **null**, not published on
the pages fetched · Recency: footer "© 2026" (site itself flags this may be
a template auto-year, treat as weak signal, not a hard date).

### COULD NOT VERIFY / TODO — not chased (budget)

- No other Placida-specific bait/tackle business was reached. Candidates
  worth a follow-up pass: any shop near the Boca Grande Causeway toll plaza
  on the Placida side, and any fish camp directly on Gasparilla Sound.
- Gasparilla Marina's exact hours and whether it has a walk-in ship-store
  counter (vs. dockside fuel/bait only) — unconfirmed.
- No boat ramp was chased for this area at all.

## Area 4 — Boca Grande (Boca Grande Pass)

**Budget note:** the 40-fetch cap was reached in this area; only one lead
was chased and it resolved to a trap (below), not a confirmed listing. This
is the expected, documented outcome per the task's hard rules — see the
open question above about Miller's Marina.

### ⚠️ TRAP FOUND

- **millersmarina.com** — resolves to a **parked GoDaddy placeholder page**
  ("Copyright © 1999-2026 GoDaddy, LLC", generic privacy-policy boilerplate,
  no business content). This is the domain I'd expect for Miller's Marina,
  a marina long associated with Boca Grande Pass tarpon fishing. **Could not
  confirm whether the business itself is still open, closed, or just
  running without this domain.** See QUESTIONS FOR THE OWNER at the top of
  this file. **Do not list Miller's Marina from memory or from this domain
  — it is not a valid source.**

### CONFIRMED OPEN

*(none — budget exhausted before a working source was reached)*

### COULD NOT VERIFY / TODO — not chased (budget)

- **Miller's Marina** — status unknown, see trap above and the open
  question. This is the single highest-priority follow-up in the whole
  file: Boca Grande Pass is one of the most heavily fished spots on this
  entire coast and currently has **no confirmed bait/tackle source**.
- **Whidden's Marina** — historically a boatyard/marina on Boca Grande,
  not chased at all; unknown whether it sells bait or is purely repair/dry
  storage.
- Any shop on Park Avenue / the historic Boca Grande village commercial
  strip, and any bait dock at the south end near the Gasparilla Island
  lighthouse — not chased.
- No boat ramp was chased for this area at all.

## Gaps — summary for the guide

- **Boca Grande Pass has no confirmed bait source in this file.** The one
  strong candidate (Miller's Marina) sits behind a dead/parked domain and
  could not be verified any other way within budget. Anyone fishing the
  Pass should **buy bait before driving out to the island** until this is
  resolved — this is itself useful guide content, matching the "buy before
  you drive in" pattern already used for Weedon Island in the St. Pete file.
- **Placida** has exactly one verified marina (Gasparilla Marina, frozen
  bait only, no live bait stated) and nothing else chased — treat this area
  as thin.
- **Englewood/Stump Pass/Lemon Bay** has no confirmed on-the-water live-bait
  shop; the best-stocked option found (Fishin' Frank's) is a Port Charlotte
  drive, not an Englewood-side pass shop. Two dead/parked domains
  (englewoodbaitandtackle.com, eldredsmarina.com) suggest there may once
  have been more options here that no longer operate under those names.
- **Sarasota** is the best-covered area in this file — 3 confirmed
  businesses with first-party bait claims and current recency signals.

