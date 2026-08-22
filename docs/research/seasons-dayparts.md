# `seasons` and `dayparts` research — the 15 undocumented spots

Review file for OPS_BACKLOG item 4. **Nothing here has been written into
`src/data/locations.ts`.** Every proposed string below carries the URL, the
publisher and a verbatim quote of what that source actually said. Where a spot
could not be sourced it says `INSUFFICIENT SOURCES` and proposes nothing —
per the content rule, an honest gap beats a plausible guess.

## How to read this

- `seasons` strings follow the existing format exactly. A leading `Mon–Mon`
  range is parsed by `seasonCoversMonth` in `src/lib/nearby.ts`; a string
  without one (e.g. `'Trout on the grass most of the year'`) deliberately makes
  no month claim and is scored as neither in nor out of season. Both forms are
  already in the shipped data and both are used below.
- `dayparts` is the strict enum `'dawn' | 'day' | 'dusk' | 'night'`.
- Confidence: **high** = two or more independent sources, or one official
  source plus a dated local report; **medium** = one good source, or several
  reports that name the area rather than the spot; **INSUFFICIENT SOURCES** =
  nothing checkable was found.
- En dashes (`–`) throughout, matching the shipped strings.

## Source tiers used

1. **FWC** — `myfwc.com` and the FWC Boating and Angling Guides on
   `gis.myfwc.com`. Used for regulation windows and species-level seasonality.
2. **Official** — Florida State Parks (FDEP), VISIT FLORIDA, county parks,
   chamber-of-commerce tournament calendars.
3. **Established regional** — The Anna Maria Islander (weekly fishing column,
   Capt. Danny Stasny), Anna Maria Island Sun, Florida Sportsman, Coastal
   Angler Magazine (Charlotte Harbor/Sarasota edition), Boca Beacon, Cape Coral
   Breeze, Fishin' Franks Bait & Tackle (Port Charlotte — dated weekly
   place-by-place report archives).
4. Content-farm aggregators (fishingbooker, guidesly, fishbrain, captain­
   experiences, wanderlog, tripadvisor and similar) were **excluded on sight**
   and none of them is cited anywhere below.

### Verification note

Quotes were re-fetched and byte-checked against the live pages for a sample
covering every source family used: Florida State Parks
(`/learn/boca-grande-pass`), islander.org (two articles), fishinfranks.com
(`zz14_placida.htm`) and the FWC Charlotte Harbor sport-fish page. All matched.
Two source families resist automated fetching and are flagged where cited:
`floridastateparks.org/parks-and-trails/*` (Cloudflare 403) and Boca Beacon
(paywalled after the first paragraph).

---

## Cross-cutting sources

These are cited repeatedly below rather than repeated in full each time.

**FWC — Boating and Angling Guide to Tampa Bay, Popular Sport Fish**
<https://gis.myfwc.com/boating_guides/Tampa_Bay/pages/sport_fish.html>

- Snook: *"Canals, tidal creeks, and other deep warm waters in cool months; near tidal passes and mangrove fringe at high tide."*
- Sheepshead: *"Inshore around oyster bars, seawalls, and in tidal creeks; moves nearshore in late winter and early spring for spawning, gathering over rocks, artificial reefs, and around navigation markers."*
- Spotted Seatrout: *"Inshore over grass beds, sand, and sandy/mud bottoms; deeper water during warmest and coolest months."*
- Florida Pompano: *"Inshore and nearshore waters, especially along sandy beaches, along oyster bars, and over grassbeds, often in turbid water."*

**FWC — Boating and Angling Guide to Charlotte Harbor, Popular Sport Fish**
<https://gis.myfwc.com/boating_guides/Charlotte_Harbor/pages/sport_fish.html>

- Red Drum: *"Inshore species until approximately 30 inches in length, where they migrate to join the nearshore population; spawning occurs from August to November in nearshore waters."*
  — this is the only **month-anchored** statement FWC publishes for any of our
  inshore species, and it is what the `Aug–Nov` redfish strings below rest on.
- Sheepshead: same late-winter/early-spring spawning sentence as above.

**FWC — Sheepshead species profile**
<https://myfwc.com/wildlifehabitats/profiles/saltwater/porgy/sheepshead/>
*"Fractional spawners (they only lay a portion of their eggs at a time) in inshore waters, typically in March and April."*

**FWC — Snook recreational regulations**
<https://myfwc.com/fishing/saltwater/recreational/snook/>
Gulf harvest closures: *"December 1 – end of February, and May 1 – August 31"*
(Tampa Bay / Sarasota Bay regions) and *"December 1 – end of February, and May 1 – September 30"* (Charlotte Harbor region, which contains Boca Grande Pass:
*"The northern coastal boundary is located at 27°04.727' North Latitude, near the Venice Municipal Airport, and the region extends south to 26°15.227' North Latitude"*).
**Deliberately not turned into a `seasons` string** — these are *harvest*
windows, not presence windows, and the shipped `seasons` voice is about when
the fish are there. They belong in regulation UI, not here.

---

# Anna Maria / Bradenton Beach

## `bridge-street-pier` — Historic Bridge Street Pier

**Existing targets:** Snook · Mangrove snapper · Spanish mackerel · Ladyfish

```ts
seasons: [
  'Dec–Mar sheepshead on the barnacled pilings',
  'Apr–May Spanish mackerel off the pier',
],
dayparts: ['night'],
```

| String | Source |
| --- | --- |
| `Dec–Mar sheepshead on the barnacled pilings` | The Anna Maria Islander, 9 May 2011 — <https://www.islander.org/2011/05/fishing-05-11-2011/> — *"The Bridge Street pier is a good wintertime spot for sheepshead and flounder."* and *"The Bridge Street pier has a large number of barnacle-encrusted pilings, which in turn attract those black-and-white striped fish we love so much."* |
| ″ (corroboration) | The Anna Maria Islander, 7 Feb 2011 — <https://www.islander.org/2011/02/fishing-02-09-2011/> — *"Ken Davis at Rotten Ralph's on the Historic Bridge Street Pier says sheepshead are starting to show in good numbers."* |
| ″ (corroboration) | The Anna Maria Islander (Capt. Danny Stasny), 20 Feb 2024 — <https://www.islander.org/2024/02/anglers-anticipate-full-moon-arrival-of-sheepshead/> — *"Spots that are good indicators of how many fish are present in our waters include the Rod & Reel Pier, the Anna Maria City Pier and the Historic Bridge Street Pier."* |
| `Apr–May Spanish mackerel off the pier` | The Anna Maria Islander, 9 May 2011 — <https://www.islander.org/2011/05/fishing-05-11-2011/> — *"Spanish mackerel are being caught from the pier."* |
| `dayparts: ['night']` | The Anna Maria Islander, 9 May 2011 — same URL — *"Night fishers are targeting and catching spotted sea trout. Most of the trout are hanging around the lights on the pier feeding on bait."* |

**Confidence: medium.** The sheepshead string is *high* on its own — three
independent Islander items, one of them 2024 — and the night string is directly
quoted. The mackerel string rests on a single May sentence, so `Apr–May` is the
narrowest range the evidence supports; widen it only with another source.

**Decision for the owner:** the best-sourced fact about this pier is
*sheepshead*, which is **not** in its `targets` array. Either add a sheepshead
recipe to the pier (the barnacled-piling quote is the justification) or drop
that string. Do not keep the string while the species has no recipe — the other
piers in the data pair the two.

---

## `longboat-pass` — Longboat Pass

**Existing targets:** Snook · Tarpon · Mangrove snapper · Spanish mackerel · Jack crevalle

```ts
seasons: [
  'Spanish mackerel through the pass spring and fall',
  'May–Jun tarpon schools through the pass',
  'Sep–Oct snook on the pass edges and the beach',
  'Jan–Feb pompano and whiting through the pass',
],
dayparts: ['day', 'dusk'],
```

| String | Source |
| --- | --- |
| `Spanish mackerel through the pass spring and fall` (spring half) | The Anna Maria Islander, 24 Apr 2012 — <https://www.islander.org/2012/04/fishing-04-25-2012/> — *"Capt. Mark Johnston of Just Reel fishing charters is fishing in and around Longboat Pass catching numerous Spanish mackerel."* |
| ″ (fall half) | The Anna Maria Islander, 2 Oct 2012 — <https://www.islander.org/2012/10/fishing-10-03-2012/> — *"Gross is getting good action on Spanish mackerel by fishing nearshore structure in the Gulf of Mexico and around Longboat Pass."* |
| `May–Jun tarpon schools through the pass` | The Anna Maria Islander, 26 May 2015 — <https://www.islander.org/2015/05/fishing-05-27-2015/> — *"You also can spot schools in Longboat Pass, at Bean Point and the southwest pass and shipping channel at Egmont Key."* |
| ″ (Jun, area-level) | The Anna Maria Islander (Stasny), 7 Jun 2022 — <https://www.islander.org/2022/06/pelagic-bottom-backwater-fishing-fires-up-tarpon-sizzle/> — *"Tarpon are making a showing in the passes of Longboat Key and Anna Maria's Bean Point during swift outgoing tides in the afternoons and evenings."* **Caveat:** says "passes of Longboat Key", which covers both Longboat Pass and New Pass. |
| `Sep–Oct snook on the pass edges and the beach` | The Anna Maria Islander, 2 Sep 2014 — <https://www.islander.org/2014/09/fishing-09-03-2014/> — *"Beach fishers targeting snook are finding keeper-size fish during outgoing tides around Bean Point and Longboat Pass."* |
| ″ (Oct) | The Anna Maria Islander, 18 Oct 2011 — <https://www.islander.org/2011/10/fishing-10-19-2011/> — *"He suggests trying around Longboat Pass and using pinfish for bait."* |
| `Jan–Feb pompano and whiting through the pass` | The Anna Maria Islander (Stasny), 24 Jan 2017 — <https://www.islander.org/2017/01/spring-fishing-in-january-produces-abundant-hook-ups/> — *"Fishing Longboat Pass between Anna Maria Island and Longboat Key and New Pass at the south end of Longboat Key can be most effective."* (pompano) |
| ″ | The Anna Maria Islander (Stasny), 19 Jan 2021 — <https://www.islander.org/2021/01/wisely-choose-fishing-days-spots-for-pompano-rewards/> — *"Fishing around either the passes of Bean Point or Longboat Pass is a good start. On this bite, you may hook into some black drum and whiting."* |
| `dayparts: ['day', 'dusk']` | The Anna Maria Islander (Stasny), 7 Jun 2022 — same URL as above — *"during swift outgoing tides in the afternoons and evenings."* |

**Confidence: high** for the mackerel and snook strings (two independent dated
reports each, naming the pass). **Medium** for tarpon (one verbatim naming
Longboat Pass, one that says "passes of Longboat Key") and for pompano (both
reports are January, so `Jan–Feb` already extends one month past the evidence —
trim to `Jan` only if you want to be strict).

**Note:** the jack-crevalle target has one un-dated but very specific source —
Anna Maria Island Sun, "Reel Time", Rusty Chinnis, 29 May 2022,
<https://amisun.com/reel-time-jack-crevalle-pit-bulls-of-the-sea/> — *"Years ago, I encountered big jacks schooled under the Longboat Pass Bridge."* No month
is given, so no string is proposed for it.

---

## `coquina-beach` — Coquina Beach

**Existing targets:** Snook · Pompano · Spanish mackerel · (`dayparts` already `['dawn','dusk']`)

```ts
seasons: [
  'Jan–Mar pompano and whiting in the trough',
  'Aug–Oct snook in the surf',
],
```

| String | Source |
| --- | --- |
| `Jan–Mar pompano and whiting in the trough` | The Anna Maria Islander, 7 Feb 2012 — <https://www.islander.org/2012/02/fishing-02-08-2012/> — *"Jonny Keyes at Island Discount Tackle is hearing of good beach action occurring at both Coquina Beach and Bean Point. Fishers using live shrimp are catching flounder in the 14-inch range. Whiting are feeding on live shrimp in these same areas. Pompano are being reported, although catches are sporadic."* |
| `Aug–Oct snook in the surf` | The Anna Maria Islander (Stasny), 10 Sep 2018 — <https://www.islander.org/2018/09/head-north-to-tampa-bay-for-clean-water-good-fishing/> — *"i'm also hearing about snook in the surf at coquina and Whitney beaches."* (lower-casing is an OCR artifact on the archive page; quoted as rendered) |

**Confidence: medium.** Coquina Beach is named in only two usable dated
reports. Both proposed ranges are one month wider on each side than the single
month actually evidenced (Feb, Sep). If you want strictly-evidenced ranges,
narrow to `Feb–Mar` and `Sep–Oct`. **No mackerel string is proposed** — nothing
acceptable ties Spanish mackerel to this beach specifically, only to the pass
half a mile south.

---

## `bean-point` — Bean Point

**Existing targets:** Snook · Tarpon · Pompano

```ts
seasons: [
  'May–Jun tarpon in the pass and over the sandbar',
  'Jan–Feb pompano and whiting in the surf off the point',
  'Sep–Oct snook off the point on the outgoing',
],
dayparts: ['dawn', 'dusk'],
```

| String | Source |
| --- | --- |
| `May–Jun tarpon in the pass and over the sandbar` | The Anna Maria Islander, 26 May 2015 — <https://www.islander.org/2015/05/fishing-05-27-2015/> — *"Most mornings start up around Bean Point when fish can be found in the pass or over the sandbar to the south. Offerings of live pass crabs or threadfin herring are attracting interest from silver kings in these areas."* |
| ″ | The Anna Maria Islander (Stasny), 28 May 2024 — <https://www.islander.org/2024/05/plenty-to-target-while-awaiting-swarms-of-tarpon/> — *"Most action on silver kings is occurring in the passes around Bean Point and Egmont Key by casting live crabs as bait during afternoon tides."* |
| ″ (Jun) | The Anna Maria Islander (Stasny), 4 Jun 2019 — <https://www.islander.org/2019/06/fishers-swarm-ami-waters-hoping-for-king-hookup/> — *"Fishing the Gulf beaches of Anna Maria Island and Longboat Key, as well as the pass at Bean Point and the gap between the north end of AMI and Egmont Key, provides great action for those who like pulling on big fish."* |
| ″ (Jun) | The Anna Maria Islander (Stasny), 7 Jun 2022 — <https://www.islander.org/2022/06/pelagic-bottom-backwater-fishing-fires-up-tarpon-sizzle/> — *"Tarpon are making a showing in the passes of Longboat Key and Anna Maria's Bean Point during swift outgoing tides in the afternoons and evenings."* |
| `Jan–Feb pompano and whiting in the surf off the point` | The Anna Maria Islander (Stasny), 19 Jan 2021 — <https://www.islander.org/2021/01/wisely-choose-fishing-days-spots-for-pompano-rewards/> — *"Casting small jigs tipped with shrimp into the surf is an effective way to hook into some pompano. Fishing around either the passes of Bean Point or Longboat Pass is a good start."* |
| ″ (Feb) | The Anna Maria Islander, 7 Feb 2012 — <https://www.islander.org/2012/02/fishing-02-08-2012/> — *"good beach action occurring at both Coquina Beach and Bean Point … Whiting are feeding on live shrimp in these same areas."* |
| `Sep–Oct snook off the point on the outgoing` | The Anna Maria Islander, 2 Sep 2014 — <https://www.islander.org/2014/09/fishing-09-03-2014/> — *"Beach fishers targeting snook are finding keeper-size fish during outgoing tides around Bean Point and Longboat Pass."* |
| `dayparts: ['dawn','dusk']` (dawn) | Islander 26 May 2015 — *"Most mornings start up around Bean Point."* |
| ″ (dusk) | Islander 7 Jun 2022 — *"during swift outgoing tides in the afternoons and evenings."* |

**Confidence: high** — the best-sourced of the fifteen after Boca Grande Pass.
Five separate Islander columns across 2012–2024 name Bean Point by name.

**Daypart note:** the sources literally say *mornings*, *afternoon tides* and
*afternoons and evenings*, i.e. dawn + day + dusk. `['dawn','dusk']` is the
recommendation because a three-value array makes the daypart bonus in
`nearby.ts` almost permanent; add `'day'` if you disagree — the quote for it
(Islander, 28 May 2024) is as good as the other two.

---

## `cortez-bridge` — Cortez Bridge

**Existing targets:** Snook · Mangrove snapper · Trout · Sheepshead · Black drum

```ts
seasons: [
  'Trout on the Anna Maria Sound and Sarasota Bay grass most of the year',
  'Mar–Apr mangrove snapper on the bridge pilings',
],
dayparts: [],   // INSUFFICIENT SOURCES
```

| String | Source |
| --- | --- |
| `Trout on the … grass most of the year` | The Anna Maria Islander, 31 Aug 2011 — <https://www.islander.org/2011/08/fishing-08-31-2011/> — *"Capt. Mark Johnston of Just Reel fishing charters is fishing Cortez and Sarasota bays for good numbers of spotted sea trout."* |
| ″ | The Anna Maria Islander (Stasny), 6 Mar 2018 — <https://www.islander.org/2018/03/march-welcomes-clear-waters-great-fishing/> — *"Sarasota Bay — south of Tampa Bay and Anna Maria Sound — starts south of the Cortez bridge and is host to a bevy of world-class trout fishing spots."* |
| ″ (species-level) | FWC Tampa Bay sport fish — seatrout *"Inshore over grass beds … deeper water during warmest and coolest months."* |
| `Mar–Apr mangrove snapper on the bridge pilings` | The Anna Maria Islander, 14 Mar 2011 — <https://www.islander.org/2011/03/fishing-03-16-2011/> — *"mangrove snapper have been caught off of the Cortez Bridge."* |

**Confidence: medium**, and this is the weakest of the Anna Maria spots. The
trout string deliberately carries **no month prefix**, because the two sources
support presence, not a window. The snapper string rests on one 2011 sentence.

**`dayparts`: INSUFFICIENT SOURCES.** Nothing acceptable ties the Cortez Bridge
to dawn / day / dusk / night or to a tide stage. Every islander.org hit for
"Cortez Bridge" plus night/tide/outgoing returned bridge-*replacement* news
coverage, not fishing. Leave `dayparts` empty rather than assuming that a
bridge means night — the guide's own `green-bridge` entry earns `['night']`
from a lit-structure source, and this one has no equivalent.

**Also found but not proposed** (species not in `targets`, or area rather than
bridge): Spanish mackerel around the bridge, 4 Apr 2011,
<https://www.islander.org/2011/04/fishing-04-06-2011/> — *"Spanish mackerel are being caught near the tackle shop from around the Cortez Bridge."*; redfish
around Cortez, 28 Feb 2012, <https://www.islander.org/2012/02/fishing-02-29-2012/>.

---

# Englewood / Placida / Boca Grande

The Charlotte Harbor cluster is carried by **Fishin' Franks Bait & Tackle**
(Port Charlotte), which publishes dated weekly reports place-by-place and keeps
them in per-location archive pages. The URL is stable; the date belongs to the
individual entry inside the page. Spelling in the pre-2022 entries is rough and
is quoted verbatim, typos included. Second source is **Coastal Angler Magazine
(Charlotte Harbor/Sarasota edition)** — monthly forecasts by Capt. Mike Manis
and surf columns by Joe Sheaffer.

## `stump-pass` — Stump Pass

**Existing targets:** Snook · Redfish · Tarpon · Ladyfish · Pompano

```ts
seasons: [
  'May–Sep snook in the pass and along the beach',
  'Aug–Nov redfish schooling on the flats inside the pass',
  'Jan–Mar pompano and whiting in the pass and the surf',
  'Jun–Jul tarpon off the beaches outside the pass',
],
dayparts: ['dawn', 'dusk'],
```

| String | Source |
| --- | --- |
| `May–Sep snook in the pass and along the beach` | Fishin' Franks, entry 05/11/18 — <https://www.fishinfranks.com/zz23_the_passes.htm> — *"Stump pass- lots of Snook and whiting and lizard fish"* |
| ″ (Jun) | Fishin' Franks, entry 06/24/15 — same URL — *"There is also Good fishing for Snook and Spanish mackerel in stump pass, And Red fish pass."* |
| ″ (Jul) | Fishin' Franks, entry 07/28/15 — same URL — *"Whiting and Snook in stump pass."* |
| ″ (Aug) | Fishin' Franks, entry 08/12/15 — same URL — *"Stump pass is a good mixe of Snook and Red fish, some Jacks and blue runners"* |
| ″ (Sep) | Fishin' Franks, entry 09/15/18 — same URL — *"Stump- good and there is Snook and some bait fish Red fish at first light."* |
| ″ (beach, Jun) | Coastal Angler Magazine (Joe Sheaffer), 30 Jun 2024 — <https://coastalanglermag.com/clumps/> — *"Recently when I was fishing along Stump Pass Beach in Englewood, I caught many snook holding around these grass clumps."* |
| `Aug–Nov redfish schooling on the flats inside the pass` | FWC Charlotte Harbor sport fish — *"spawning occurs from August to November in nearshore waters."* |
| ″ | Coastal Angler Magazine (Capt. Mike Manis), 1 Oct 2018 — <https://coastalanglermag.com/october-transitions/> — *"I have always liked the flats adjacent to Stump Pass in Lemon Bay."* |
| ″ | Fishin' Franks, entry 09/15/18 — *"Red fish at first light."* |
| `Jan–Mar pompano and whiting in the pass and the surf` | Fishin' Franks, entry 01/13/16 — <https://www.fishinfranks.com/zz23_the_passes.htm> — *"Stump pass has some whting , pompano and sheep head."* |
| ″ (Feb) | Fishin' Franks, entry 02/24/2024 — <https://www.fishinfranks.com/zz25_walkin_the_beaches.htm> — *"Pompano, whiting, small black drum and trout at Manasota Key (Blind Pass and Stump Pass)."* |
| ″ (Mar) | Fishin' Franks, entry 03/09/2024 — same URL — *"Englewood Beach, Stump Pass and Boca Grande all have bluefish, juvenile black drum, whiting, pompano and a few flounder."* |
| ″ (Feb, surf) | Coastal Angler Magazine (Joe Sheaffer), 28 Feb 2023 — <https://coastalanglermag.com/surf-squeeze/> — *"I hooked up with 5 Pompano (landed 3), I caught a few large Ladyfish and a Flounder."* |
| `Jun–Jul tarpon off the beaches outside the pass` | Coastal Angler Magazine (Capt. Mike Manis), 1 Jun 2020 — <https://coastalanglermag.com/sight-fishing/> — *"Of course, it's prime tarpon season and groups of fish can be found anywhere off the beaches from Redfish Pass at Captiva Island to Stump Pass outside Lemon Bay."* |
| ″ | Fishin' Franks, entry 06/17/17 — <https://www.fishinfranks.com/zz23_the_passes.htm> — *"Stump pass possible Tarpon, Gasprilla , Boca, and Captiva first thing at Dawns crack."* |
| `dayparts: ['dawn','dusk']` (dawn) | Fishin' Franks entries 09/15/18 (*"Red fish at first light"*) and 06/17/17 (*"first thing at Dawns crack"*) |
| ″ (dusk) | Fishin' Franks, entry 06/03/2023 — <https://www.fishinfranks.com/zz25_walkin_the_beaches.htm> — *"Boca Grande, Englewood and Stump Pass beaches all have snook in the evening."* |

**Confidence: high** for snook, redfish and pompano — five, three and four
dated entries respectively, all naming Stump Pass. **Medium** for tarpon (the
Coastal Angler sentence is a beach-run statement that names Stump Pass as an
endpoint, not a Stump Pass report).

**Daypart caveat — read before shipping.** There is real night evidence:
Fishin' Franks, entry 03/24/16, <https://www.fishinfranks.com/zz17_lemon_bay.htm>
— *"after dark the giant Snook are moving in to the pass"*. It is **not** in the
proposal because Stump Pass Beach State Park is day-use only: Florida State
Parks lists *"Hours 8 a.m. until sundown, 365 days a year"* (site blocks
automated fetching; read via an Internet Archive snapshot of
<https://www.floridastateparks.org/parks-and-trails/stump-pass-beach-state-park>,
and corroborated by Coastal Angler, 30 Jun 2026,
<https://coastalanglermag.com/back-to-stump-pass-beach/> — *"FYI, the park opens at 8:00 am, closes at 8:30 pm."*). Shipping `'night'` for a shore spot inside a
park that closes at sundown would send a reader somewhere they cannot legally
be. If a boat/kayak entry is added later, revisit.

Official species list, no seasonality (useful for `access_notes`, not here):
Florida State Parks — *"Fishing is popular around Stump Pass and on the nearby grass flats. Catches can yield flounder, snook, trout, redfish, snapper, whiting, sheepshead and tarpon."*

---

## `englewood-beach` — Englewood Beach / Chadwick Park

**Existing targets:** Snook · Pompano · Spanish mackerel · (`dayparts` already `['dawn','dusk']`)

```ts
seasons: [
  'Dec–Mar pompano and whiting in the trough',
  'Jun–Sep snook in the surf',
  'Spanish mackerel along the beach spring and fall',
],
```

| String | Source |
| --- | --- |
| `Dec–Mar pompano and whiting in the trough` (Dec) | Fishin' Franks, entry 12/07/2024 — <https://www.fishinfranks.com/zz25_walkin_the_beaches.htm> — *"Whiting and pompano off Manasota Key."* |
| ″ (Feb) | Fishin' Franks, entry 02/17/2024 — same URL — *"Caspersen Beach, Manasota Key, Englewood Beach, Blind Pass and Stump Pass have a good potential for whiting, small black drum, short redfish, a few pompano, and sheepshead."* |
| ″ (Mar) | Fishin' Franks, entry 03/09/2024 — same URL — *"Englewood Beach, Stump Pass and Boca Grande all have bluefish, juvenile black drum, whiting, pompano and a few flounder."* |
| `Jun–Sep snook in the surf` (Jun) | Fishin' Franks, entry 06/03/2023 — same URL — *"Boca Grande, Englewood and Stump Pass beaches all have snook in the evening."* |
| ″ (Aug) | Fishin' Franks, entry 08/18/18 — same URL — *"engle wood and stump whiting and some Snook, Pompano and the bait is coming back to the beach."* |
| `Spanish mackerel along the beach spring and fall` (Apr) | Fishin' Franks, entry 04/06/2024 — same URL — *"Some big giant bluefish from Venice, Englewood, and Boca Grande. Whiting and a few Spanish mackerel might be anywhere. Some snook showing up near the passes."* |
| ″ (Nov) | Fishin' Franks, entry 11/23/17 — same URL — *"Flounder off Englewood and there is Snook and Lizard fish Some Jacks and Spanish."* |

**Confidence: high** for pompano/whiting (three dated entries across Dec, Feb,
Mar). **Medium** for snook (Jun and Aug) and for mackerel — note the mackerel
string carries **no month prefix** on purpose, matching
`st-pete-pier`'s *"Spanish mackerel and jacks on bait pushes spring and fall"*,
because the two entries are April and November and a single `Mon–Mon` range
cannot express a two-peak season without also claiming the summer.

**Operational note for `access_notes`, not `seasons`:** Charlotte County lists
"Englewood Beach at Chadwick Park — Beach/Bay Inland Waters" among fishing
piers **closed for restoration** after hurricane damage —
<https://www.charlottecountyfl.gov/departments/community-services/parks/amenities/fishing.stml>.

---

## `lemon-bay-mangroves` — Lemon Bay mangrove shorelines

**Existing targets:** Redfish · Snook · Mangrove snapper

```ts
seasons: [
  'Redfish under the docks and along the mangroves most of the year',
  'Aug–Nov redfish schooling on the flats',
  'Apr–Sep snook along the mangrove edges and the dock lines',
],
dayparts: ['dawn'],
```

| String | Source |
| --- | --- |
| `Redfish … most of the year` (Feb) | Fishin' Franks, entry 02/10/2024 — <https://www.fishinfranks.com/zz17_lemon_bay.htm> — *"A lot of trout here also, especially around Stump Pass and Indian Mound Park. Sheepshead around the docks. Some redfish around the mangroves."* |
| ″ (Apr) | Fishin' Franks, entry 04/27/2024 — same URL — *"A few redfish and some small trout in the Stump Pass area. They are on the grass and under the bushes. Big snook are under the docks on the mainland side."* |
| ″ (Aug) | Fishin' Franks, entry 08/29/2022 — same URL — *"Redfish schools are around docks and on the flats."* |
| ″ (Nov) | Fishin' Franks, entry 11/18/2023 — same URL — *"A lot of small snook scattered around the area, plus a handful of trout and a couple redfish."* |
| `Aug–Nov redfish schooling on the flats` | FWC Charlotte Harbor sport fish — *"spawning occurs from August to November in nearshore waters."* |
| ″ | Fishin' Franks, entry 09/09/2023 — same URL — *"A couple schools of redfish, but they've broken up into smaller groups. One is in the Miserable Mile and one is somewhere near Indian Mound Park."* |
| ″ | Coastal Angler Magazine (Capt. Mike Manis), 1 Sep 2017 — <https://coastalanglermag.com/september-opportunities/> — *"To the north, the grass flats on either side of the intracoastal inside Stump Pass in Lemon Bay are always worth a look."* |
| `Apr–Sep snook along the mangrove edges and the dock lines` (Apr) | Fishin' Franks, entry 04/05/2025 — same URL — *"Lots of little snook and redfish under the docks."* |
| ″ (May) | Fishin' Franks, entry 05/10/2025 — same URL — *"Some mangrove snapper around docks and even some of the potholes. Trout, snook and a couple redfish have also been around the flats and docks."* |
| ″ (Jul) | Fishin' Franks, entry 07/01/2023 — same URL — *"Quite a few snook and trout in the bay."* |
| ″ (Sep) | Fishin' Franks, entry 09/09/2023 — same URL — *"A few smaller snook under the docks."* |
| `dayparts: ['dawn']` | Coastal Angler Magazine (Capt. Mike Manis), 2 Jul 2020 — <https://coastalanglermag.com/early-bird/> — *"In the heat, spotted seatrout will be lethargic but can provide an early bite. The best bet should be some of the deeper holes in Lemon Bay and Pine Island Sound."* |

**Confidence: high** for redfish (four dated entries plus the FWC spawning
window) and snook (four dated entries across Apr–Sep).

**Mangrove snapper: not proposed.** Only one entry names snapper here
(05/10/2025). One report is not a season.

**Why `dayparts` is only `['dawn']`.** There *is* strong night evidence in
Lemon Bay — *"The Tom Adams Bridge has had snook and night, or trout and sheepshead during the day"* (Fishin' Franks, entry 04/12/2025, same URL) and
*"Some snook at night and early in the morning"* (entry 07/02/2022,
<https://www.fishinfranks.com/zz20_englewood_pier.htm>). But all of it is about
the **Tom Adams Bridge and the Ainger Pier**, which are lit structures, not the
mangrove shorelines this entry describes. Extending a bridge-light night bite
to a paddled mangrove edge would be inventing content. If a Tom Adams Bridge
spot is ever added, that evidence belongs to it.

---

## `placida-gasparilla-sound` — Placida / Gasparilla Sound

**Existing targets:** Redfish · Snook · Trout · Sheepshead

```ts
seasons: [
  'Nov–Mar sheepshead on the trestle, the docks and the oyster bars',
  'Aug–Nov redfish schooling on the sound flats',
  'May–Jun snook staging through the sound for the beaches',
  'Trout on the sound grass most of the year',
],
dayparts: ['dawn', 'dusk', 'night'],
```

| String | Source |
| --- | --- |
| `Nov–Mar sheepshead …` (Nov) | Fishin' Franks, entry 11/25/2023 — <https://www.fishinfranks.com/zz14_placida.htm> — *"Lots of sheepshead stacking up."* |
| ″ (Dec) | Fishin' Franks, entry 12/02/2023 — same URL — *"But the big story is sheepshead around all the area docks, trestle and older wooden structure."* |
| ″ (Jan) | Fishin' Franks, entry 01/21/2023 — same URL — *"The trestle is loaded with sheepshead, plus a few mangrove snapper and pompano."* |
| ″ (Feb) | Fishin' Franks, entry 02/17/2024 — <https://www.fishinfranks.com/zz13_gasprill_tailing.htm> — *"The oyster bar near Sandfly and the bushes going up into Whidden and Catfish creeks have been holding sheepshead."* |
| ″ (Feb) | Coastal Angler Magazine (Capt. Mike Manis), 1 Feb 2018 — <https://coastalanglermag.com/someone-hit-light-switch/> — *"Sheepshead are under the Boca Grande and Placida trestles in good numbers."* |
| ″ (Mar) | Coastal Angler Magazine (Capt. Mike Manis), 1 Mar 2021 — <https://coastalanglermag.com/spring-ahead/> — *"The sheepshead bite is still going strong. Dock, pier, and trestle structures are best. From land, it's hard to beat the Placida trestle."* |
| ″ (end of the run) | Fishin' Franks, entry 04/05/2025 — <https://www.fishinfranks.com/zz14_placida.htm> — *"Spanish mackerel, some sharks. Sheepshead are thinning out."* — this is why the range stops at March. |
| ″ (species-level) | FWC Charlotte Harbor sport fish, sheepshead — late winter / early spring spawning aggregation |
| `Aug–Nov redfish schooling on the sound flats` | FWC Charlotte Harbor sport fish — *"spawning occurs from August to November in nearshore waters."* |
| ″ (Oct) | Coastal Angler Magazine (Capt. Mike Manis), 1 Oct 2017 — <https://coastalanglermag.com/can-feel-difference/> — *"On the other side of the causeway, over in Gasparilla Sound, all the flats from outside Gasparilla Marina down past the Whiddens area and out towards Devilfish Key at the edge of the harbor, have potential."* |
| ″ (Nov) | Fishin' Franks, entry 11/23/2024 — <https://www.fishinfranks.com/zz13_gasprill_tailing.htm> — *"Lots of redfish and small snook around the bushes, especially in Catfish Creek."* |
| `May–Jun snook staging through the sound for the beaches` (May) | Fishin' Franks, entry 05/25/2024 — same URL — *"Snook and redfish around the mangroves, especially in Catfish Creek."* |
| ″ (Jun) | Fishin' Franks, entry 06/01/2024 — same URL — *"One of the better areas for larger snook as they head toward the beaches."* |
| ″ (May, structure) | Fishin' Franks, entry 05/31/2025 — <https://www.fishinfranks.com/zz14_placida.htm> — *"Lots of snook around the docks and bridges too (watch for dolphins)."* |
| `Trout on the sound grass most of the year` (Dec) | Fishin' Franks, entry 12/21/2024 — same URL — *"Trout are on the nearby grassflats."* |
| ″ (Nov) | Coastal Angler Magazine (Capt. Mike Manis), 31 Oct 2020 — <https://coastalanglermag.com/changing-times/> — *"In Gasparilla Sound, the thick turtle grass flats off the Three Sisters Islands outside Boca Grande can hold good numbers of trout."* |
| ″ (Feb) | Fishin' Franks, entry 02/24/2024 — <https://www.fishinfranks.com/zz13_gasprill_tailing.htm> — *"The trout are biting in 4 to 8 feet early and a bit shallower later in the day."* |
| ″ (Jul) | Coastal Angler Magazine (Capt. Mike Manis), 31 Jul 2022 — <https://coastalanglermag.com/options-2/> — *"Look for an early trout bite on the system that runs from Cape Haze Point down to Cayo Pelau outside Gasparilla Sound."* |
| `dayparts` — night | Fishin' Franks, entry 12/21/2024 — <https://www.fishinfranks.com/zz14_placida.htm> — *"The Coral Creek Pier has been producing some good snook (mostly at night) and quality sheepshead (all during the day)."* |
| ″ — night | Fishin' Franks, entry 06/24/2023 — same URL — *"A lot of snook at night or early in the morning, plus a few during the day."* |
| ″ — dawn | same entry as above (*"or early in the morning"*), and entry 02/24/2024 (*"biting in 4 to 8 feet early"*) |
| ″ — dusk | Fishin' Franks, entry 07/02/2022 — same URL — *"Tarpon moving thru regularly, but feeding best from 5 pm thru the night."* |
| ″ — dusk | Fishin' Franks, entry 05/11/2024 — same URL — *"Some tarpon in the evenings, in the pass and at the bridges."* |

**Confidence: high.** Sheepshead in particular has six independent items across
two publishers and five different years, and an end-of-run entry that fixes
where the range stops.

**Daypart note:** `'day'` is also directly sourced — *"quality sheepshead (all during the day)"* — and sheepshead is a target here. It is left out only to keep
the array from covering the whole clock; add it if you would rather the data be
literal than discriminating.

---

## `boca-grande-pass` — Boca Grande Pass

**Existing targets:** Tarpon · Snook · Jack crevalle

```ts
seasons: [
  'Apr–Jun tarpon through the pass',
  'Apr–Jun snook moving out through the pass',
],
dayparts: ['dusk', 'night'],
```

| String | Source |
| --- | --- |
| `Apr–Jun tarpon through the pass` | **Florida State Parks (FDEP)** — <https://www.floridastateparks.org/learn/boca-grande-pass> — *"The Boca Grande Pass, just off the southern tip of Gasparilla Island State Park, is world-famous for sportfishing, particularly tarpon."* and *"From May to June, the pass is filled with anglers out to catch their prize fish."* (re-fetched and byte-verified) |
| ″ | **FWC** — <https://myfwc.com/fishing/saltwater/recreational/tarpon/> — *"During the months of April, May and June, no more than three fishing lines may be deployed from a vessel at any one time AND no person shall use, fish with, or place in the water any breakaway gear."* FWC drawing a special-rule window around exactly April–June is the strongest available official statement of when the fishery happens. |
| ″ | **FWC** — <https://gis.myfwc.com/boating_guides/Charlotte_Harbor/pages/fishing.html> — Boca Grande Pass is *"well known for its tarpon fishing."* |
| ″ (Apr edge) | Florida Sportsman (Jeff Weakley), 21 May 2025 — <https://www.floridasportsman.com/editorial/tarpon-fishing-boca-grande/524518> — *"Beginning in early April, 'tarpon fishing' for many means one thing: Boca Grande Pass."* |
| ″ (May–Jun peak) | Coastal Angler Magazine (Capt. Terry Fisher), 30 Apr 2024 — <https://coastalanglermag.com/boca-grande-tarpon-and-beyond/> — *"The months of May and June bring the most spectacular, natural displays of fish migration to SW Florida, especially in Boca Grande Pass."* |
| ″ (tournament dates as hard evidence) | Boca Grande Area Chamber of Commerce — Ladies Day Tarpon Tournament <https://bocagrandechamber.com/ladies-day-tarpon-tournament/> (May 8) and World's Richest Tarpon Tournament <https://bocagrandechamber.com/worlds-richest-tarpon-tournament/> (*"May 20 & 21 2027"*). A town does not schedule its richest tournament outside its peak. |
| `Apr–Jun snook moving out through the pass` | Florida State Parks — same URL — *"Sport anglers from around the world come to fish for tarpon, snook and goliath grouper."* (species, no months) |
| ″ (months) | Coastal Angler Magazine (Capt. Terry Fisher), 1 Jan 2018 — <https://coastalanglermag.com/annual-swfl-inshore-fishing-guide-species/>, entry headed "SNOOK (April-June)" — *"warmer waters move these fish from the rivers and creeks out through the passes and just off the beaches."* |
| `dayparts` — night | **VISIT FLORIDA** (Dalia Colón) — <https://www.visitflorida.com/travel-ideas/articles/adventure-tarpon-fishing-boca-grande-pass/> — *"Tarpon remain active after dark, so night fishing is also popular."* |
| ″ — dusk | Fishin' Franks, entry 07/02/2022 — <https://www.fishinfranks.com/zz14_placida.htm> — *"Tarpon moving thru regularly, but feeding best from 5 pm thru the night."* |
| ″ — supporting (tide, not daypart) | Cape Coral Breeze (Capt. George Tunison), 10 May 2024 — <https://www.capecoralbreeze.com/sports/sports-columns/2024/05/10/fishing-its-may-tarpon-season-is-on-in-boca-grande-pass/> — *"the fish are typically most active during a moving or changing tide, especially around new or full moon phases, resulting in fast moving \"hill tides\" which flushes out a smorgasbord of tide-trapped crabs, shrimp and fish from Charlotte Harbor for the pass fish to feast on."* |

**Confidence: high** for tarpon — official (Florida State Parks, FWC, VISIT
FLORIDA), regional press (Florida Sportsman, Coastal Angler, Cape Coral Breeze,
Boca Beacon) and the Chamber's own tournament calendar all agree, and this is
the one spot in the guide where that is true. **Medium** for snook: Florida
State Parks names the species at the Pass but gives no months; the months come
from a region-level Coastal Angler species guide.

**`Jack crevalle`: INSUFFICIENT SOURCES.** Nothing acceptable states a jack
crevalle season *for Boca Grande Pass*. Boca Beacon returns zero hits for
"crevalle"; FWC's Tampa Bay guide says only *"Common to both inshore waters and the open sea."* The nearest usable item is region-level — Coastal Angler,
1 Jan 2018, entry headed "JACK CREVALLE (January-March)" — which describes
creeks, canals and rivers, i.e. the opposite of a deep pass. No string proposed.

### FWC gear rules — verified, and they belong in `safety` / `access_notes`

Not `seasons`, but the brief asked for them and they are the single most
consequential fact about fishing this spot. Both verified on
<https://myfwc.com/fishing/saltwater/recreational/tarpon/> and corroborated on
<https://myfwc.com/fishing/saltwater/recreational/tarpon/faqs/>:

1. **Year round, all species, inside the Pass:** *"Fishing with gear that has a weight attached to a hook, artificial fly or lure in such a way that the weight hangs lower than the hook when the line or leader is suspended vertically from the rod is prohibited when fishing for any species year-round within Boca Grande Pass. If this gear is on board a fishing vessel while inside the boundaries of the Pass, it cannot be attached to any rod, line or leader and must be stowed."* — and *"Live or dead natural bait is not considered to be a weight."*
2. **April, May and June only:** *"During the months of April, May and June, no more than three fishing lines may be deployed from a vessel at any one time AND no person shall use, fish with, or place in the water any breakaway gear."*
3. **Tarpon are catch-and-release:** *"Tarpon is a catch-and-release only fishery"* and *"Tarpon over 40 inches MUST remain in the water."*
4. The Pass boundary the rules apply inside is defined by six points on the FWC
   page (Charlotte Harbor Channel LB6, Concrete Pier, Phosphate Dock,
   Intracoastal Waterway, Flashing Green #75, QR Test Buoy). Bonefish & Tarpon
   Trust documents the 2016 western-boundary move —
   <https://www.bonefishtarpontrust.org/blog/2016-04-06-boca-grande-pass-gear-restriction-boundary-shifts/>.
5. **Gap to flag:** FWC never defines *"breakaway gear"* on either page. If the
   guide explains the term it has to come from the rule text in the Florida
   Administrative Code (68B-46), not from these pages.

---

# Bradenton / Manatee River

The weakest cluster of the four. The Manatee River spots have no equivalent of
Fishin' Franks or the Islander's pass-by-pass reporting, and two of the five
could not be sourced at all.

## `emerson-point` — Emerson Point Preserve / Snead Island

**Existing targets:** Redfish · Trout · Snook · Black drum

```ts
seasons: [
  'Jun–Aug snook, redfish and trout staging off the point as the river freshens',
  'Trout on the flats around the point most of the year',
],
dayparts: [],   // INSUFFICIENT SOURCES
```

| String | Source |
| --- | --- |
| `Jun–Aug snook, redfish and trout staging off the point …` | The Anna Maria Islander (Capt. Danny Stasny), 2 Jun 2026 — <https://www.islander.org/2026/06/rainy-season-begins-with-inshore-migration-of-snook-reds-trout/> — *"Areas like Terra Ceia Bay, Emerson Point and De Soto Point are where fish will be staging, yielding large concentrations of the flats fish that we all like to target."* (re-fetched and byte-verified; the same column: *"Swift outgoing tides are probably best as ambush predators like snook and trout stage around points, oyster bars and mangroves waiting for a meal to drift by them."*) |
| `Trout on the flats around the point most of the year` | The Anna Maria Islander (Stasny), 18 Oct 2022 — <https://www.islander.org/2022/10/local-waters-may-be-brown-and-murky-but-fishing-is-red-hot/> — *"I see them daily when fishing the flats around Emerson Point and the De Soto National Memorial. Juvenile tarpon are a possibility in these areas. And there's nothing better than hooking into a 15- to 20-pound tarpon while trout fishing on the flats."* |

**Confidence: medium.** Only **June** is directly evidenced for the staging
string; `Jun–Aug` extends it on the strength of the source's own "beginning of
the rainy season" framing, which is a judgement call. Narrow it to `Jun–Jul` if
you want the range never to exceed the evidence.

**Read this before shipping either string.** The same columnist wrote, on
15 Apr 2025, <https://www.islander.org/2025/04/plenty-of-fish-to-be-found-among-healthy-grass-flats/> — *"I'm avoiding areas in the mouth of the Manatee River due to the lack of seagrasses, especially along the northern shoreline from Emerson Point eastward to the Pilsbury docks."* That is a working guide saying he
stopped fishing part of this spot. It does not contradict the June 2026 column
(different water, a year later), but a guide that tells people to go here owes
them that context — it probably belongs in `safety` or `access_notes`.

**`dayparts`: INSUFFICIENT SOURCES.** No source gives a dawn/day/dusk/night
bite pattern for Emerson Point. Note for whoever fills `access_notes`: Manatee
County lists the preserve as *"Open daily 365 days a year from sunrise to sunset"*
(<https://www.mymanatee.org/connect/locations/location-details/emerson-point-preserve>),
which rules `'night'` out on access grounds whatever a future source says. The
same page: *"There are a number of docks along the walking trails where you can sit and enjoy nature or choose to fish. Please no cast netting."*

---

## `palma-sola-bay` — Palma Sola Bay

**Existing targets:** Trout · Redfish · Snook

```ts
seasons: [
  'Dec–Mar trout in the back reaches of the bay',
  'Aug–Sep snook and trout around the dock and bridge lights',
  'Redfish along the shorelines and docks most of the year',
],
dayparts: ['dawn', 'night'],
```

| String | Source |
| --- | --- |
| `Dec–Mar trout in the back reaches of the bay` | The Islander (Capt. Mike Heistand), 2 Mar 2005 — <https://www.islander.org/3-2-05/fishing.php> — *"At Perico Island Bait and Tackle, reports are coming in on good-size trout from Palma Sola Bay, sheepshead around the bridges and piers and lots of redfish on the higher tides from the shorelines in the bays."* (same column: *"the larger females starting to hit the hook better as the winter weather continues"*) |
| ″ | The Anna Maria Islander (Stasny), 1 Feb 2022 — <https://www.islander.org/2022/02/winter-settles-in-pick-days-location-for-fishing-success/> — *"If it's not, you can migrate into the canals to dock fish or into the back reaches of the bays — Terra Ceia, Palma Sola or Sarasota."* |
| `Aug–Sep snook and trout around the dock and bridge lights` | Anna Maria Island Sun, "Reel Time" (Rusty Chinnis), 23 Aug 2021 — <https://amisun.com/reel-time-dog-days/> — *"Dog days is a common term among fishermen signifying the long hot days of August and September when fish can be hard to find and catch."* and *"The myriad dock and bridge lights that illuminate local waterways hold concentrations of fish including snook, trout, mangrove snapper, redfish, bluefish and tarpon."* and *"Lights in Anna Maria Sound, Palma Sola and Sarasota Bay host the same opportunities for fish ranging from just a few pounds to over 100 pounds."* (all three re-fetched and byte-verified) |
| `Redfish along the shorelines and docks most of the year` | Islander, 2 Mar 2005 — same URL — *"Zach Zacharias on the Dee-Jay II out of Annie's Bait & Tackle in Cortez said he's catching cobia off the beaches, trout to 24 inches in the backwater and reds near the docks in Palma Sola Bay."* |
| ″ | The Anna Maria Islander, 15 Sep 2010 — <https://www.islander.org/2010/09/area-anglers-see-schools-of-red/> — *"There was even a report of a 45-inch redfish caught last week in Palma Sola Bay."* and *"Fishers have reported a lot of speckled trout being caught in the local waters of Palma Sola and Sarasota Bay."* |
| `dayparts: ['dawn','night']` | Anna Maria Island Sun, 23 Aug 2021 — same URL — *"One of the prime times to fish during the 'dog days' is at night or in the early morning hours before the sun climbs high in the sky."* and *"When the rising sun lightens the horizon, anglers can move to the flats to target redfish, snook and trout."* |

**Confidence: medium.** The `dayparts` pair is the best-sourced thing about this
spot — one substantial column that names Palma Sola and gives both night and
first-light explicitly. The season strings are thinner: two of the three lean on
a 2005 column, which is old enough that it describes a different seagrass era.

**Regulation flag — do not ship without re-checking.** The Islander reported on
12 Oct 2021, <https://www.islander.org/2021/10/fwc-opens-snook-redfish-trout-for-harvest-in-tampa-bay/> — *"Sarasota Bay, Palma Sola Bay and all waters south of Manatee Avenue remain catch-and-release only."* If that is still in force it is
a material fact about this spot and belongs in the location page. It is a
2021-era post-red-tide rule and **must be verified against current FWC
regulations** before appearing anywhere in the guide.

---

## `green-bridge` — Green Bridge Fishing Pier

**Existing targets:** Snook · Mangrove snapper · Sheepshead · Ladyfish · Black drum · (`dayparts` already `['night']`)

```ts
seasons: [
  'Mar–Nov snook from the bridge down to the river mouth',
  'Dec–Mar sheepshead on the bridge pilings',
],
```

| String | Source |
| --- | --- |
| `Mar–Nov snook from the bridge down to the river mouth` | Captain Ryan Taylor LLC (Bradenton guide service) — <https://captainryantaylor.com/manatee-river-fishing-2> — *"From early spring to late fall fishing from the Green Bridge to the mouth of the river, an area called the bulkhead is a terrific mixed bag fishing. There are docks, grass flats, creeks, and bayous which provide great fishing on both sides of the river. With all the various structure types, snook, redfish, and trout all call this area home."* |
| ″ (why the range ends) | same URL — *"As winter gets colder the snook, redfish, and trout move up river to escape the cold water temps."* |
| ″ (corroboration, river not pier) | Bradenton Herald (Tiffany Tompkins), 12 Oct 2025 — <https://www.bradenton.com/sports/outdoors/fishing-boating/article312455804.html> — a tournament-winning 41-inch snook taken in the Manatee River: *"The second bait and second snook of the morning ended up being the biggest of the tournament."* |
| `Dec–Mar sheepshead on the bridge pilings` | Anna Maria Island Sun, "Reel Time" (Rusty Chinnis), 7 Feb 2022 — <https://amisun.com/reel-time-the-bridges-of-manatee-county/> — *"This winter has been, thankfully, a bit cooler than past years, and fishing for sheepshead, a perennial winter favorite, has been strong around local bridges."* and *"Winter and early spring are particularly good times to find action around the local bridges."* |
| ″ (species-level) | FWC Tampa Bay sport fish — sheepshead move nearshore in late winter and early spring to spawn |

**Confidence: medium.** The snook string rests on one undated guide-service
page, but it is a Bradenton operator writing specifically about the Green
Bridge–to–river-mouth stretch, and it gives both ends of the window. The
sheepshead string is a **synthesis**: the AMI Sun column says *"local bridges"*,
not the Green Bridge, and FWC supplies the spawning timing. It is honest but it
is not a report from this bridge — mark it down if you want only direct
evidence.

**Gap:** nothing found ties the Green Bridge to a night-lights bite *by name*,
even though `dayparts: ['night']` is already shipped for it. That existing value
is not contradicted by anything here, but it is also not corroborated.

---

## `bradenton-riverwalk` — Bradenton Riverwalk

**Existing targets:** Snook · Mangrove snapper · Jack · Sheepshead

```ts
seasons: [],    // INSUFFICIENT SOURCES
dayparts: [],   // INSUFFICIENT SOURCES
```

**INSUFFICIENT SOURCES — nothing proposed.**

Manatee County's own page for the pier
(<https://www.mymanatee.org/connect/locations/location-details/bradenton-riverwalk-pier>)
describes only *"Located in Downtown Bradenton, the dock is located within a 2.03-mile stretch of land, offering a scenic waterfront within Rossi Park"* — no
species, no seasons, no hours, no lighting. islander.org and amisun.com return
Riverwalk only in ferry-landing and event contexts, never in the fishing column.
Every fishing-specific result for "Bradenton Riverwalk" was a content farm and
was discarded.

This spot keeps both fields empty and the location page keeps saying "not
documented yet", which is the correct answer. To close it, someone needs to
either ask the City of Bradenton for its own pier description or find the
Bradenton Herald outdoors column naming the Riverwalk.

---

## `south-palma-sola-flats` — South Palma Sola Flats

**Existing targets:** Trout · Redfish · Snook

```ts
seasons: [
  'Aug–Sep redfish, snook and trout on the flats',
],
dayparts: ['dawn'],
```

| String | Source |
| --- | --- |
| `Aug–Sep redfish, snook and trout on the flats` and `dayparts: ['dawn']` | Anna Maria Island Sun, "Reel Time" (Rusty Chinnis), 23 Aug 2021 — <https://amisun.com/reel-time-dog-days/> — *"When the rising sun lightens the horizon, anglers can move to the flats to target redfish, snook and trout. In the hottest months, from August through September, most of the early morning tides are from one to one and a half feet, so anglers will seldom see pushes or tails."* — the same column names Palma Sola as one of the systems it is describing. |
| Wade access confirmed (not a season claim) | The Anna Maria Islander (Robert Anderson), 23 Jan 2024 — <https://www.islander.org/2024/01/concerns-linger-over-contamination-in-palma-sola-bay/> — *"People can be seen wading and fishing in the waters of Palma Sola Bay on the south side of the Palma Sola Causeway."* |

**Confidence: medium — bay-level evidence only.** No source I could find
separates the south flats from Palma Sola Bay as a whole; every one of them
treats the bay as a single waterbody. The quote above is a genuine flats-and-
first-light statement for exactly this spot's three target species in a column
that names Palma Sola, which is why something is proposed rather than nothing —
but the reader should know the source did not say "south end". If you would
rather hold the line at spot-specific evidence, mark this
`INSUFFICIENT SOURCES` and leave both fields empty.

**Also flag:** the January 2024 Islander piece above is about **contamination
concerns in Palma Sola Bay** and a Manatee County Department of Health warning.
Whatever happens to `seasons` here, that story is worth chasing for `safety` on
both Palma Sola entries.

---

# Summary

| slug | `seasons` proposed | `dayparts` proposed | confidence |
| --- | ---: | ---: | --- |
| `emerson-point` | 2 | 0 | medium (seasons) · **INSUFFICIENT SOURCES** (dayparts) |
| `palma-sola-bay` | 3 | 2 | medium |
| `green-bridge` | 2 | — already `['night']` | medium |
| `bradenton-riverwalk` | 0 | 0 | **INSUFFICIENT SOURCES** |
| `bridge-street-pier` | 2 | 1 | medium (sheepshead string alone is high) |
| `longboat-pass` | 4 | 2 | high (mackerel, snook) · medium (tarpon, pompano) |
| `coquina-beach` | 2 | — already `['dawn','dusk']` | medium |
| `bean-point` | 3 | 2 | **high** |
| `cortez-bridge` | 2 | 0 | medium (seasons) · **INSUFFICIENT SOURCES** (dayparts) |
| `south-palma-sola-flats` | 1 | 1 | medium — bay-level evidence only |
| `stump-pass` | 4 | 2 | **high** (tarpon string medium) |
| `englewood-beach` | 3 | — already `['dawn','dusk']` | high (pompano) · medium (snook, mackerel) |
| `lemon-bay-mangroves` | 3 | 1 | **high** |
| `placida-gasparilla-sound` | 4 | 3 | **high** |
| `boca-grande-pass` | 2 | 2 | **high** (tarpon) · medium (snook) |

**Totals:** 37 `seasons` strings proposed across 14 of 15 spots; 12 `dayparts`
values across 9 of the 12 spots that needed them. Two fields are returned
empty on purpose — `bradenton-riverwalk` entirely, and `dayparts` for
`emerson-point` and `cortez-bridge`.

## What is worth another pass

1. **`bradenton-riverwalk`** is the only complete miss. A phone call to the City
   of Bradenton, or the Bradenton Herald's outdoors archive, would probably
   close it.
2. **Boca Beacon is paywalled** past the first paragraph. A subscription would
   likely turn the Boca Grande Pass entry from good to definitive, and the same
   columnists cover Placida and Gasparilla Sound.
3. **`yoursun.com` / WATERLINE** (the Charlotte Sun's fishing section) rate-
   limited every attempt this session. It is the obvious second source for the
   whole Englewood–Placida cluster.
4. **`cortez-bridge` dayparts** and **`green-bridge` night corroboration** are
   both one good local column away from being answerable.
5. Two regulation items surfaced that are **not** `seasons` work but matter more
   than `seasons` does: the possible catch-and-release-only status of Palma Sola
   Bay, and the FWC Boca Grande Pass gear rules. Both are written up above.

## Format check

All 37 proposed strings were run through a replica of `seasonCoversMonth`
(`src/lib/nearby.ts`). 30 carry a leading `Mon–Mon` range and every one resolves
to the months intended, including the four that wrap the new year
(`Dec–Mar` ×4, `Nov–Mar` ×1). The remaining 7 deliberately carry no range and
are correctly read as making no month claim:

- `Spanish mackerel through the pass spring and fall` (`longboat-pass`)
- `Trout on the Anna Maria Sound and Sarasota Bay grass most of the year` (`cortez-bridge`)
- `Spanish mackerel along the beach spring and fall` (`englewood-beach`)
- `Redfish under the docks and along the mangroves most of the year` (`lemon-bay-mangroves`)
- `Trout on the sound grass most of the year` (`placida-gasparilla-sound`)
- `Trout on the flats around the point most of the year` (`emerson-point`)
- `Redfish along the shorelines and docks most of the year` (`palma-sola-bay`)

Every `dayparts` value proposed is inside the `'dawn' | 'day' | 'dusk' | 'night'`
enum. No application code was modified by this research pass.
