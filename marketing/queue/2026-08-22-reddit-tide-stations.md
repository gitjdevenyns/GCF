---
platform: reddit
status: draft
created: 2026-08-22
posted_url: null
subreddit: r/floridafishing
title: "The tide station most of us use for Tampa Bay is the wrong basin, and it costs about an hour"
claims:
  - "Predicted highs for one sample day, south to north: Egmont Key 10:11, Mullet Key 10:23, Tierra Verde 10:39, Point Pinellas 11:37, St. Petersburg 11:59, Gandy Bridge (Old Tampa Bay) 12:58"
  - "The tide takes well over an hour to travel from the bay mouth to the top of the bay"
  - "Old Tampa Bay stations north of the Gandy causeway run roughly an hour later than Tampa Bay proper"
  - "Weedon Island Preserve faces Tampa Bay proper, so it uses St. Petersburg 8726520, not the closer Gandy Bridge station"
  - "Skyway Fishing Pier North uses Mullet Key 8726364; Port Manatee is a similar distance east but sits in a port basin and predicts nearly an hour later"
  - "Pass-a-Grille Jetty uses Tierra Verde 8726428 — the same Pass-a-Grille Channel / Bunces Pass system behind the barrier islands"
  - "25 spots in the guide, backed by 15 NOAA CO-OPS stations, each id verified against the CO-OPS metadata API"
  - "Port Boca Grande 8725577 is the one harmonic reference station in the set; the rest are subordinate"
  - "seasons are researched for 10 of the 25 spots and dayparts for 13 of the 25 — the rest are empty"
  - "the tackle directory (src/data/shops.ts) is empty on purpose"
  - "no account, no sign-in — there is no auth or payment code in the app"
  - "the guide works with no network; all static content is bundled"
  - "the app never sends your coordinates anywhere"
  - "the south Skyway pier was closed beyond its bait shop on 27 Oct 2025 after FDOT structural inspections, and the state announced in March 2026 that it will be replaced rather than repaired"
sources:
  - src/data/locations.ts        # station block comment carries the six sample-day predicted highs verbatim, the "well over an hour" statement, and the per-spot basin rationale for Weedon Island, Skyway North and Pass-a-Grille. STATION_BOCA_GRANDE is commented "The one reference (harmonic) station in the set; the rest are subordinate." Counted: 25 locations, 15 distinct noaa_id values, 0 null. seasons non-empty on 10, dayparts non-empty on 13.
  - src/data/tideGuide.ts        # "The fifteen NOAA CO-OPS stations that back the 25 locations, each verified against the CO-OPS metadata API"
  - src/data/shops.ts            # "export const SHOPS: Shop[] = []" and "Deliberately empty. Populating it means visiting or verifying each business against a checkable source"
  - README.md                    # zero-network guarantee; no auth/payment anywhere in the stack description
  - src/lib/geo.ts               # coordinates never leave the device
  - src/data/locations.ts        # skyway-pier-north accessNotes carries the south-pier closure sentence verbatim, sourced to Florida State Parks
notes:
  - "Subreddit: r/floridafishing over r/SaltwaterFishing. The whole post is
     Tampa Bay basin geography — it is regionally specific enough that
     r/SaltwaterFishing would read it as off-topic filler."
  - "Structure is deliberate: the post is useful and complete without the link.
     Someone can read it, learn the basin thing, never click, and the post was
     still worth their time. That is the only version of this that survives
     r/floridafishing."
  - "Self-disclosure is in the third paragraph, before the first mention of what
     was built — not buried at the bottom."
  - "The 'what it does not have' section is not modesty. It is the part that
     makes the rest believable, and it is also a real request: shop data is the
     one gap the community could actually close."
  - "Do not crosspost this text. Reddit and X get different words (CONTENT_POLICY
     - no identical text blasted across platforms)."
  - "Check r/floridafishing's self-promotion rule and flair options before
     posting. If the sub requires a mod-approved flair or a weekly thread for
     anything with a link, use that route."
  - "FIRST-PERSON FRAMING: this is written in the owner's voice because a Reddit
     self-post has no other honest register. It deliberately contains no
     biographical claim I could not check — no years fished, no boat, no
     backstory. If the owner wants to add one, that is theirs to write; an agent
     inventing it would be the same failure as an invented testimonial."
---

**The tide station most of us use for Tampa Bay is the wrong basin, and it costs about an hour**

This is the least obvious thing I know about fishing this coast, so I will lead
with it rather than bury it.

When you look up a tide for a spot, the instinct is to pick the nearest station
on the map. On this coast that instinct is wrong often enough to matter,
because the tide does not arrive everywhere at once — it takes well over an
hour to travel from the mouth of Tampa Bay to the top of it. Predicted highs
for one sample day, south to north:

- Egmont Key — 10:11
- Mullet Key — 10:23
- Tierra Verde — 10:39
- Point Pinellas — 11:37
- St. Petersburg — 11:59
- Gandy Bridge (Old Tampa Bay) — 12:58

Nearly three hours end to end. So the question is never "which station is
closest", it is "which station is on the same water I am standing on". A
station a mile away across a causeway or a barrier island can be an hour off,
and a station five miles away on the same open water will be close to right.

Three cases where that flips the answer:

- **Weedon Island.** The Gandy Bridge station is closer in a straight line, but
  it sits inside Old Tampa Bay, which runs about an hour behind the main bay.
  Weedon faces Tampa Bay proper, so St. Petersburg (8726520) is the honest
  station even though it is further away.
- **Skyway pier, north side.** Mullet Key (8726364) is the nearest station on
  the same open channel water. Port Manatee is a similar distance east, but it
  sits in a port basin and predicts nearly an hour later.
- **Pass-a-Grille jetty.** Tierra Verde (8726428), because that station is in
  the same Pass-a-Grille Channel / Bunces Pass system behind the barrier
  islands, rather than out on the Gulf side.

One more thing worth knowing if you are chasing precision: across this whole
footprint, Port Boca Grande (8725577) is the one reference (harmonic) station.
Every other station in the set is a subordinate one.

---

**Disclosure before I go further: the rest of this post is about something I
built, so treat it accordingly.**

I have been putting the local stuff I actually use into a web guide — 25 spots
from St. Petersburg down to Boca Grande Pass, each one matched to a NOAA
station by the same-basin rule above rather than by distance. Fifteen stations
back the 25 spots, and every station id was checked against the CO-OPS metadata
API — name, state and coordinates — rather than typed in from a search result.
It is a website, no app store, no account, no sign-in. Everything static is
bundled, so once the page has loaded it keeps working with no signal — which
matters more than it sounds like it should, given where most of these spots
are.

Each spot page gives you the structure, the tide stage it fishes, and per
species a rig, hook, leader, weight and bait. Where the app suggests a spot near
you, it tells you the specific reason — the distance, whether the stage running
now at the named station is the stage that spot fishes, whether the hour matches
a researched daypart. It is a plain rule set, not a black box and not a
prediction. It does not tell you that you will catch anything, and it will
never show you a percentage, because there is no catch data behind it to make
such a number mean anything.

**What it does not have, which is most of the point:**

- **Seasons for every spot.** Ten of the 25 have researched season notes.
  Dayparts, thirteen. The other spots are blank, and blank means "nobody has
  done that research yet" — not "nothing here in August". I would rather the
  gap be visible than filled in with something plausible.
- **A tackle shop directory.** The file exists and is empty on purpose. Getting
  a shop's hours or phone number wrong sends someone across the county to a
  closed door, so nothing goes in until it is verified against something
  checkable. This is the gap I would most like help with — if you know a shop
  around Cortez, Placida or Fort De Soto and where its hours are actually
  published, that is genuinely useful to me.
- **Photos of the spots.** There is no licensed photograph of a minor local
  fishing spot that can be verified to actually show that spot, and a
  mislabelled one is worse than none, so the spot pages render live satellite
  imagery of the real coordinates instead.
- **Regulations.** It points at FWC and does not restate a single number. Slot
  and bag limits change, and a stale number in an app is a citation.

If the station thing above was useful and none of the rest is, that is a fine
outcome — the basin rule works whatever you look your tides up in.

Guide, if you want it: https://gitjdevenyns.github.io/GCF/

(Housekeeping for anyone who fishes the Skyway: this is the **north** pier. The
south pier was closed beyond its bait shop on 27 Oct 2025 after FDOT structural
inspections, and the state announced in March 2026 that it will be replaced
rather than repaired.)
