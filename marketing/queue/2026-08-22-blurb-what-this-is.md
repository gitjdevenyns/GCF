---
platform: blog
kind: evergreen-asset
status: draft
created: 2026-08-22
posted_url: null
usage: "App store / PWA listing description, link-in-bio, site footer, press one-liner"
claims:
  - "25 researched spots between St. Petersburg and Boca Grande Pass"
  - "each spot carries its access, its structure and the tide stage it fishes"
  - "every species a spot names has a researched rig, hook, leader, weight and bait"
  - "11 species have their own page with numbered field marks, ranked decisive or supporting"
  - "6 more species are documented in a Handle With Care section"
  - "live NOAA tide predictions and NWS forecasts, labelled as predictions"
  - "everything else works with no signal — the whole guide is bundled"
  - "it ranks the spots nearest you and shows the reason each one matched"
  - "it never claims you will catch anything; there is no catch data behind it"
  - "your location never leaves your phone"
  - "photo ID returns an estimate"
sources:
  - src/data/locations.ts        # 25 entries counted; northernmost Weedon Island Preserve (region 'St. Petersburg'), southernmost Boca Grande Pass; every entry has access[], structures[] and tide_playbook.best_window; 104 TargetRecipe rows, none missing rig/hook/leader/weight/bait
  - src/data/fish.ts             # 11 entries counted
  - src/data/hazards.ts          # 6 entries counted
  - src/components/species/speciesContent.ts  # field marks for all 11 species, weighted 'decisive' | 'supporting'; "decisive marks settle the identification on their own, supporting marks only ever confirm"
  - src/lib/nearby.ts            # "It does not estimate whether you will catch a fish. There is no catch data in this app to calibrate such a claim against"; every `reason` string is a measured fact or a quotation of researched content
  - src/lib/geo.ts               # "THE COORDINATES NEVER LEAVE THE DEVICE"
  - src/lib/identify.ts          # "The result is an ESTIMATE. That word is load-bearing"; CONFIDENCE_LABEL is words, "Never a percentage — we have no basis for one"
  - README.md                    # zero-network guarantee; NOAA/NWS refreshed every 3 hours; photo never stored
  - src/pages/Tides.tsx          # predictions labelled as predictions
notes:
  - "The full paragraph is the canonical text. The two shorter cuts below are
     truncations of it, not rewrites — they must never gain a claim the long
     version does not make."
  - "The word 'estimate' travels with the photo identifier in every cut that
     mentions it. If a length budget forces the word out, the feature comes out
     with it (see the 90-character cut)."
  - "Do not add 'free'. There is no billing or auth code in the app, so the
     honest and checkable version is 'no account, no sign-in', which is what the
     long paragraph says."
---

## Canonical paragraph (~950 characters)

Gulf Coast Fishing Guide is a researched field guide to saltwater fishing
between St. Petersburg and Boca Grande Pass. Twenty-five spots, each with its
access, its structure, the tide stage it fishes, and — for every species that
spot names — a rig, hook, leader, weight and bait. Eleven species have their own
page with numbered field marks on the photograph, ranked as decisive or merely
supporting, and six more sit in a Handle With Care section because they are the
ones that hurt people. It reads live NOAA tide predictions and NWS forecasts and
labels them as predictions; everything else works with the phone in airplane
mode, because the whole guide is bundled. Point it at where you are standing and
it will rank the nearest spots and show you the reason each one matched — the
distance, the tide stage running now at the named station, the researched hour.
It will not tell you that you are going to catch something, because there is no
catch data behind it to make that mean anything. No account, no sign-in, and
your location never leaves your phone.

---

## 300-character cut (link-in-bio, app store short description)

A researched saltwater field guide for St. Petersburg down to Boca Grande Pass.
25 spots, each with the access, the structure, the tide it fishes and the rig,
hook, leader, weight and bait for every species it names. Works in airplane
mode. Your location never leaves your phone.

---

## 90-character cut (site footer, meta description opener, OG description)

25 researched saltwater spots, St. Petersburg to Boca Grande Pass. Works
offline.

---

## Optional sentence, when the photo identifier is in scope

Add verbatim, never paraphrased, and never without the word estimate:

> Photograph a fish and it will give you a species **estimate** — a prompt to
> look closer, not an answer — and link you to the guide's own page for that
> animal rather than to advice it made up. The photo is resized on your phone
> and is never stored anywhere.
