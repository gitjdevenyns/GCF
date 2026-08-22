# Access notes & safety — research review, 15 original spots

Researched 22 Aug 2026. **Nothing here is in `locations.ts` yet.** This is a
review file: every proposed string is followed by the source URL and a quote of
what that page actually said.

## How to read this

- **Confidence `high`** — an official body (county, city, state, FDOT, FWC) says
  it, on its own site, in text that was fetched and quoted.
- **Confidence `medium`** — a secondary source (local newspaper, tourist board,
  hiking or angling site) says it and nothing official contradicts it, *or* the
  official source is an FWC boating-guide survey snapshot from 2010/2011.
- **`INSUFFICIENT SOURCES`** — could not be verified. Leave the field empty.
  Empty is not "no hazard here"; it is "not researched yet", exactly as the
  header comment in `locations.ts` already says.
- ⏱ marks a **time-sensitive** claim that must be re-checked immediately before
  publish.

## Three things to know before reading

1. **`floridastateparks.org`, `scgov.net` and `sarasotacountyparks.com` returned
   HTTP 403** to every attempt. Stump Pass and Lemon Bay Park are under-sourced
   as a direct result and need a manual read.
2. **Every `gis.myfwc.com` boating-guide page is a survey snapshot** — Feb 2010
   for Tampa Bay, Aug/Sep 2011 for Charlotte Harbor — and FWC says so on the
   page itself: *"the information provided is current as of the guide's
   publication date. Some of the information may have changed since then."*
   Good for "what facilities exist", weak for "what is open today", and entirely
   pre-Ian/Helene/Milton. Any note derived from one is capped at `medium`, and
   **their "Pier Condition: Good" ratings must never be repeated.**
3. Two FWC pier pages carry a **county field that is simply wrong** (both the
   Palmetto and Bradenton piers are labelled "Pinellas"). Ignore that field.

---

# Licences and permits — the cross-cutting section

This is the high-value, frequently-searched material, and it is cleanly
sourceable. It is also where this research found something better than expected:
**FWC's own guide records, per pier, whether that pier provides a licence.**

### The free resident shoreline licence

<https://myfwc.com/license/recreational/saltwater-fishing/>
> "Saltwater Shoreline-Only Fishing License … Valid for saltwater fishing from
> the shoreline or a structure affixed to shore. Not valid when fishing from a
> vessel, or a shoreline reached by vessel. Not valid if taking or attempting to
> take by swimming or diving."
> "Resident Annual Saltwater Shoreline License: No-Cost"

<https://myfwc.com/license/recreational/saltwater-fishing/shoreline-faqs/>
> "Non-residents are not eligible for this license and must purchase a 3-day,
> 7-day or annual non-resident saltwater fishing license when saltwater fishing
> in Florida unless covered by a charter or pier license."

Prices, same FWC page: "Resident Annual: $17.00 / Resident Five-Year: $79.00 /
Non-Resident Annual: $47.00 / Non-Resident 3-Day: $17.00 / Non-Resident 7-Day:
$30.00".

**The trap worth writing down:** a Florida resident fishing a pier, a seawall or
a preserve shoreline is covered by the free licence. A non-resident is not. And
**arriving by boat voids it** — so anyone paddling to a Lemon Bay or Stump Pass
sandbar needs the full licence, not the shoreline one.

### The pier-licence exemption

<https://myfwc.com/license/recreational/saltwater-fishing/vessel-pier-licenses/>
> "Issued to an owner, operator or custodian of a pier; covers everyone
> saltwater fishing from that pier." (annual fee "$501.50")

<https://myfwc.com/license/recreational/do-i-need-one/>
> "Individuals saltwater fishing from a pier with a valid saltwater pier license."

**And here is the answer for this guide's piers.** FWC publishes no master list,
but its boating-guide record for each pier carries a `Fishing License Provided`
field, and for both piers in this set it reads **No**:

| Pier | FWC page | Field |
|---|---|---|
| Riverside Park / Green Bridge Pier | `…/fishing_piers/riverside_park/mobile_index.html` | "Fishing License Provided No" |
| Palma Sola Causeway | `…/fishing_piers/palma_sola_causeway/mobile_index.html` | "Fishing License Provided No" |

**So: bring your own licence to both.** No pier in the 15 was found to hold a
pier licence. One angling site claims Bridge Street Pier needs none — that is a
single unofficial source and is not enough (see that entry).

### ⚠️ Two permits the guide does not currently mention at all

<https://myfwc.com/license/recreational/saltwater-fishing/>

**Shore-based shark permit — free, mandatory, no exemptions:**
> "As of July 1, 2019, required for anglers 16 and older in addition to a
> saltwater fishing license when taking or attempting to take sharks from shore,
> including jetties, bridges and piers. No permit exemptions, even if exempt
> from fishing license requirements."
> "Annual: $0.00. Available at GoOutdoorsFlorida.com after completing the
> Shore-based Shark Fishing Educational Course."

**Snook permit — $10, required on top of the licence, shoreline included:**
> "Required, in addition to a saltwater fishing license, including shoreline
> fishing, when taking or attempting to take snook." / "Annual: $10.00"

**This matters across the whole guide.** Snook is the headline species at most
of these 15 spots, and the existing Fort De Soto and Skyway entries already
describe sharks as a normal catch. **Recommend a guide-level note, not a
per-spot one.**

### Proposed shared source entries

```ts
{
  id: 'fwc-saltwater-license',
  label: 'Saltwater fishing licenses, shoreline licence and required permits',
  url: 'https://myfwc.com/license/recreational/saltwater-fishing/',
  publisher: 'Florida Fish and Wildlife Conservation Commission',
  note: 'Also the source for the free shore-based shark permit and the $10 snook permit. Verify before treating as legal guidance.',
},
{
  id: 'fwc-license-exemptions',
  label: 'Do I need a fishing license? — exemptions, including licensed piers',
  url: 'https://myfwc.com/license/recreational/do-i-need-one/',
  publisher: 'Florida Fish and Wildlife Conservation Commission',
},
```

---

# 1. `emerson-point` — Emerson Point / Snead Island

**Confidence: high.** ⏱ on the dock — this is the single most actionable warning
in the set.

### `access_notes`

```ts
access_notes: [
  'Manatee County preserve at 5801 17th Street West, Palmetto, open daily from sunrise to sunset, 365 days a year.',
  'The fishing dock is closed until further notice after hurricane damage — the county alert is still live. There are other docks along the walking trails you can fish from, but no cast netting anywhere in the preserve.',
  'Two paddle launches and no boat ramp: the beach at the west end, straight into the mouth of the Manatee River, and a second launch about six-tenths of a mile in with a wooden dock onto the Blueway Trail through the mangrove tunnels to Terra Ceia Bay.',
  'Restrooms, boardwalks, observation towers and picnic areas are listed, but the nature centre and its restrooms were storm-damaged and portable toilets substituted. The visitor centre opens only when volunteers are available.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Address, phone | mymanatee.org Emerson Point Preserve | "5801 17th Street West Palmetto, FL 34221 (941) 748-4501" |
| Hours | same | "Open daily 365 days a year from sunrise to sunset." |
| ⏱ **Dock closed** | same (page modified 2026-08-20) | **"Dock Closure Alert / Emerson Point Preserve Dock closed until further notice / Due to hurricane damage, the Emerson Point Preserve Dock will remain closed until further notice."** |
| Other docks, no cast netting | same | "There are a number of docks along the walking trails where you can sit and enjoy nature or choose to fish. Please no cast netting." |
| Launch 1 | same | "The launch site is the beach located at the western end of the preserve. The launch at this site provides access to the mouth of the Manatee River and Terra Ceia Bay." |
| Launch 2 | same | "Located approximately 6/10 of a mile from the entrance of Emerson Point. This launch has a wooden dock and the Blueway Trail that meanders through mangrove tunnels until you reach Terra Ceia Bay" |
| No boat ramp | same | "Boat Ramp" is absent from the amenity list, which reads "Boardwalk / Canoe and Kayak Launch / Dock / … / Parking / … / Pier / Pond / Restrooms / …" — **medium**, this is inference from absence |
| Visitor centre | same | "Hours vary by volunteer staff availability. The visitor center is open when volunteers are available." |
| ⏱ Nature centre / restrooms | floridahikes.com (Mar 2025) | "The nature center and restrooms were damaged and remain closed. Portable toilets are now provided."; "Restroom: At the nature center. Portalet at Emerson Point." — **medium**, 17 months old |

⚠️ **Internal conflict on the county's own page.** It carries the dock-closure
alert *and* a general "Fishing Dock Hours — available daily while the park is
open" block. Treat the dock as **closed** and the general block as stale.

⚠️ Entry fee: floridahikes.com says "Fees: Free"; the county page states no fee
anywhere. **Medium** — do not write a dollar figure, and "free" is safe only
because nothing contradicts it.

### `safety`

```ts
safety: [
  'Live oyster on the bar edges the point is built around. Hard-soled boots if you get out of the boat, and keep braid off the shell.',
  'The Blueway Trail runs through mangrove tunnels that are easy to enter on a high tide and hard to leave on a falling one — start with water to spare.',
  'Mosquitoes here can be intense at some times of year, and Milton took much of the canopy down, so there is less shade than there was.',
],
```

| Claim | Source | Status |
|---|---|---|
| Mosquitoes | floridahikes.com — "Prepare for mosquitoes, which can be intense certain times of year." | **medium** |
| Lost canopy | floridahikes.com — "felling tall gumbo-limbos and denuding the tropical canopy. New views have opened up." | **medium** |
| Mangrove-root footing | floridahikes.com — "Pick a path through a tangle of mangrove roots on this wild shoreline" | **medium** |
| Oyster bars, mangrove-tunnel tide | ⚠️ **unsourced** | see below |

⚠️ **The first two proposed lines are inference**, from the preserve's own
structure list (`['grass', 'oyster', 'mangrove']`) and the county's description
of a mangrove-tunnel paddling trail — not from a sourced hazard statement. The
guide already makes exactly these two claims at Weedon Island off a comparable
county description, so there is precedent. **Reviewer's call.** If strict
sourcing is wanted, keep only the mosquito and canopy lines.

⚠️ Oyster bars, tidal current at the river mouth, boat traffic, wading hazards
and lifeguard status: **not documented by any source reached.**

### `sources`

```ts
{
  id: 'manatee-emerson-point',
  label: 'Emerson Point Preserve — hours, launches, dock closure',
  url: 'https://www.mymanatee.org/connect/locations/location-details/emerson-point-preserve',
  publisher: 'Manatee County Government',
  note: 'Time-sensitive: carries a live alert that the fishing dock is closed until further notice after hurricane damage.',
},
{
  id: 'floridahikes-emerson-point',
  label: 'Emerson Point Preserve — post-Milton conditions and facilities',
  url: 'https://floridahikes.com/emerson-point-preserve/',
  publisher: 'Florida Hikes',
  note: 'Secondary source, March 2025. Basis for the nature-centre closure and the mosquito and canopy notes.',
},
```

---

# 2. `palma-sola-bay` — Palma Sola Bay

**Confidence: high** on county hours, **medium** on pier and ramp detail (FWC
survey, Feb 2010). There are **three separate county records** at this causeway
— park, boat ramp, and a fishing pier — governed differently.

### `access_notes`

```ts
access_notes: [
  'Palma Sola Causeway Park, 9500 Manatee Avenue West on SR 64 between Bradenton and Anna Maria Island. The park is open sunrise to sunset unless posted otherwise.',
  'The boat ramp is governed separately — the county lists its ramps as 24-hour, and the only posted restriction here is no overnight parking, under Ordinance 23-121.',
  'The ramp is free: one lane, paved, with docks, about twenty parking spaces, wheelchair accessible, and no restrooms at the ramp itself.',
  'A short county fishing pier sits further along the causeway at 9450 Manatee Ave W — dawn to dusk, no fee, restrooms, fresh water and monofilament recycling, but no bait, no fish-cleaning table and not wheelchair accessible.',
  'The pier does not provide a fishing licence — bring your own.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Park hours, address | mymanatee.org Palma Sola Causeway Park | "Sunrise to Sunset, unless otherwise posted or allowed by special permit"; "9500 Manatee Avenue West Bradenton, FL 34209 (941)742-5923" |
| Ramp restriction | mymanatee.org Palma Sola Causeway Boat Ramp | "No Overnight Parking / Ordinance 23-121" |
| Ramps are 24-hour | mymanatee.org, Find a Boat Ramp | "Hours Available: 24-hours / Eligibility: Everyone"; names "the Palma Sola Causeway" among popular sites |
| Ramp detail | FWC Tampa Bay guide, palma_sola_bay | "9100 Manatee Ave W"; "Ramps/Lanes: 1/1"; "Ramp Fee: No"; "Docks: Yes"; "Parking: 20"; "Restrooms: No"; "Handicap Accessible: Yes"; "Hours: 24 hours" |
| Pier detail | FWC Tampa Bay guide, palma_sola_causeway | "9450 Manatee Ave W (SR-64, Palma Sola Causeway)"; "Entracnce Fee No"; **"Fishing License Provided No"**; "Bait and Tackle No"; "Restrooms Yes"; "Handicap Accessible No"; "Monofilament Recycling Yes"; "Fresh Water Yes"; "Fish Cleaning Table No"; "Hours Dawn to dusk" |

⚠️ **Hours conflict resolved, not hidden.** The *park* is sunrise-to-sunset; the
*ramp* is 24-hour; the *pier* is dawn-to-dusk. The proposed note says so
explicitly rather than picking one. Do not collapse them.

⚠️ FWC's own vintage warning applies: *"This ramp was visited prior to the
creation of the Boating and Angling Guide to Tampa Bay … Some of the information
may have changed since then."* The pier's post-hurricane condition is **not
verified**.

⚠️ There is also a canoe-only hand launch on the causeway — the "Winston Tract
Kayak Launch Site", "Canoe Launch Only" — but the only source is
goboatingflorida.com, dated 2013. **Medium, and probably not worth publishing.**

### `safety`

```ts
safety: [
  'No lifeguard. Manatee County guards only Coquina Beach and Manatee Public Beach.',
  'The ramp has a history of sanding in — the county closed it for six months in 2019 after an inspection found shallow conditions at the end of the ramp that made launching and landing difficult at low tide.',
],
```

| Claim | Source | Status |
|---|---|---|
| No lifeguard | mymanatee.org, Amenities on the Water — lists "Lifeguarded Beach" only at "Coquina Beach" and "Manatee Public Beach" | **medium-high** — inference from an official absence |
| Shoaling | Manatee County news, Dec 2018 (Internet Archive) — "a recent County inspection revealed an increased accumulation of sand causing shallow conditions within and at the end of the boat ramp making launching and landing difficult, especially during low tides." | **high** that it was said, but it is 2018 and the repair was completed — publish as a tendency, not a current condition |

⚠️ Everything else — oyster bars, current, traffic on the SR 64 shoulder,
riprap, shade — is **`INSUFFICIENT SOURCES`.**

⚠️ **No parking fee is stated on any county page**, and whether the lot fills is
undocumented. Do not write either.

⚠️ Neither the park nor the ramp page carries a closure alert as of 2026-08-20 —
weak positive evidence both are open, given that Emerson Point's page *does*
carry one.

### `sources`

```ts
{
  id: 'manatee-palma-sola-causeway',
  label: 'Palma Sola Causeway Park — hours and facilities',
  url: 'https://www.mymanatee.org/connect/locations/location-details/palma-sola-causeway-park',
  publisher: 'Manatee County Government',
},
{
  id: 'manatee-palma-sola-ramp',
  label: 'Palma Sola Causeway boat ramp — no overnight parking (Ordinance 23-121)',
  url: 'https://www.mymanatee.org/connect/locations/location-details/palma-sola-causeway-boat-ramp',
  publisher: 'Manatee County Government',
},
{
  id: 'fwc-palma-sola-pier',
  label: 'Palma Sola Causeway fishing pier — facilities, hours, licence status',
  url: 'https://gis.myfwc.com/boating_guides/tampa_bay/pages/fishing_piers/palma_sola_causeway/mobile_index.html',
  publisher: 'FWC — Boating and Angling Guide to Tampa Bay',
  note: 'Facility survey dated February 2010; FWC warns the data may have changed. Records "Fishing License Provided: No".',
},
```

---

# 3. `green-bridge` — Green Bridge

**Confidence: medium-high, and better than expected — the pier appears to be
OPEN.** But this entry has a **coordinate error** and a **long-term structural
question**. See NEEDS URGENT REVIEW.

### The coordinate problem — fix this first

`locations.ts` has `lat: 27.5003, lng: -82.5705`, which is the **south**
(Bradenton) bank, effectively on top of `bradenton-riverwalk`. The public
fishing pier is the surviving span of the 1927 bridge on the **north**
(Palmetto) bank, in Riverside Park at Riverside Dr & 9th Ave W — roughly
27.514, -82.574.

> "Part of the original Green Bridge on the north side of the river has been
> converted into a fishing pier." — Wikipedia, Green Bridge (Manatee River)

> "RIVERSIDE PARK/GREEN BRIDGE PIER / Address Riverside Dr. and 9th Ave. W /
> City, Zip Palmetto, 34221" — FWC Tampa Bay guide

> "Riverside Park East / Green Bridge / View / Riverside Park West (with boat
> ramp) / Green Bridge / View"
> — <https://www.palmettofl.org/193/Community-Parks-and-Facilities>

**Correct the coordinates before writing any access note**, or the map hero and
the "Go here now" card point at the wrong bank of the river.

### ⏱ Is it open? Yes, as best anyone can verify

Manatee County announced completion of the rail repairs on **21 May 2026**:

> "🚧 Green Bridge Fishing Pier 🚧 Manatee County completed the rail repair work
> on the Green Bridge Fishing Pier with minimal impact to pedestrians. Thank you
> for your patience!"
> — Manatee County Government official Facebook account

The work itself ran from 13 April 2026:

> "Repairs to the Green Bridge Fishing Pier are scheduled to begin April 13,
> with construction expected to continue through the end of the month."
> "visitors should anticipate intermittent disruptions, including two to three
> days of full closures."
> — <https://www.pulseofmanatee.com/p/green-bridge-fishing-pier-repairs>

No closure notice appears on the City of Palmetto's live news feed.

### `access_notes`

```ts
access_notes: [
  'The pier is the surviving span of the 1927 bridge, on the Palmetto side of the river in Riverside Park at Riverside Drive and 9th Ave W — not the Bradenton bank.',
  'Free, with no entrance fee, and listed as open 24 hours; the boat ramp in the same park is listed 7 am to 11 pm, so if you are relying on that parking, treat the shorter window as the real one.',
  'Restrooms, fresh water, a fish-cleaning table, monofilament recycling and a picnic area on site, and the pier is wheelchair accessible. No bait shop, and the pier does not provide a fishing licence.',
  'The City of Palmetto rents the pier out for tournaments and festivals at $200 a day, so it can be closed to casual anglers without warning. Manatee County repaired the rails in April 2026 and is separately evaluating demolition and replacement.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Location, fee, facilities, ADA, hours | FWC Tampa Bay guide, riverside_park pier | "Entracnce Fee No"; **"Fishing License Provided No"**; "Bait and Tackle No"; "Restrooms Yes"; "Handicap Accessible Yes"; "Picnic Area Yes"; "Monofilament Recycling Yes"; "Fresh Water Yes"; "Fish Cleaning Table Yes"; "Hours 24 hours"; "City of Palmetto Parks and Recreation, 941-723-4580" |
| Ramp hours conflict | FWC Tampa Bay guide, riverside_park ramp | "Ramps/Lanes 1/2"; "Ramp Fee No"; "Parking 25 spaces"; "Restrooms Yes"; "Handicap Accessible Yes"; "Hours 7AM to 11PM" |
| ⏱ Rental | palmettofl.org/198/Facilities-Rental-Fees | "Green Bridge Fishing Pier - $200 Full Day/ $100 Half Day"; "A SPECIAL FUNCTION PERMIT AND ADDITIONAL SECURITY DEPOSIT ALSO MAY BE REQUIRED" |
| ⏱ Repairs complete | Manatee County Facebook, 21 May 2026 | quoted above |

⚠️ **Do not repeat FWC's "Pier Condition Good".** That is a Feb 2010 survey
rating and it is contradicted by the condition findings below.

⚠️ **Managing-entity ambiguity.** FWC and the City of Palmetto both attribute
the pier to the City; Manatee County performed and announced the 2026 repairs
and is the body costing replacement. Both are worth a phone call. City of
Palmetto Parks & Rec: 941-723-4580.

### `safety`

```ts
safety: [
  'A 1920s structure roughly two thousand feet long and thirty-four feet wide, with no shade for its length. Manatee County has inspected it, costed demolition and replacement, and is not planning to keep patching it — take every barricade and closure sign here literally.',
],
```

| Claim | Source | Status |
|---|---|---|
| Condition, dimensions, replacement | Citizen Portal summary of a March 2025 Manatee County meeting | "County staff described the pier as unsafe in its current condition and said inspections after recent storms identified structural and electrical deterioration."; "dates to the 1920s and has extensive concrete deterioration"; "the existing pier is about 2,100 feet long and 34 feet wide"; "officials said the structure cannot be sustained indefinitely with piecemeal repairs" | ⚠️ **LOW-MEDIUM — see below** |

⚠️⚠️ **Source-quality warning that must not be lost.** The Citizen Portal page
carries its own disclaimer, verbatim: *"AI-Generated Content: All content on
this page was generated by AI to highlight key points from the meeting."*

**Do not publish "county staff called it unsafe" as a county statement.** Either
confirm it against a primary Manatee County record or a mainstream news report,
or soften the proposed safety line to describe only what is independently
sourced: an old structure that the county is repairing piecemeal and evaluating
for replacement. Everything else about this spot — river current, boat traffic,
riprap, lifeguards — is `INSUFFICIENT SOURCES`.

### `sources`

```ts
{
  id: 'fwc-green-bridge-pier',
  label: 'Riverside Park / Green Bridge Pier — facilities, hours, licence status',
  url: 'https://gis.myfwc.com/boating_guides/tampa_bay/pages/fishing_piers/riverside_park/mobile_index.html',
  publisher: 'FWC — Boating and Angling Guide to Tampa Bay',
  note: 'Facility survey dated February 2010. Locates the pier on the Palmetto (north) bank and records "Fishing License Provided: No". Its condition rating is stale — do not cite it.',
},
{
  id: 'palmetto-facility-rentals',
  label: 'City of Palmetto facility rental fees — the pier can be booked for events',
  url: 'https://www.palmettofl.org/198/Facilities-Rental-Fees',
  publisher: 'City of Palmetto',
},
{
  id: 'green-bridge-repairs-2026',
  label: 'Green Bridge Fishing Pier rail repairs, April 2026',
  url: 'https://www.pulseofmanatee.com/p/green-bridge-fishing-pier-repairs',
  publisher: 'Pulse of Manatee (6 April 2026)',
  note: 'Manatee County announced completion on 21 May 2026. Time-sensitive.',
},
```

---

# 4. `bradenton-riverwalk` — Bradenton Riverwalk

**Confidence: high.** The City of Bradenton publishes exactly what is needed,
and one detail here is genuinely distinctive.

### `access_notes`

```ts
access_notes: [
  'The Riverwalk is the only City of Bradenton park open 24 hours a day — every other city park closes at 9 pm. That makes it the guide\'s most straightforward night-fishing shoreline.',
  'A 2.03-mile riverfront strip between the Green Bridge and the DeSoto Bridge, along Barcarrota Blvd, Waterfront Drive and Riverside Drive. There is a dock at 452 3rd Ave W, inside Rossi Park.',
  'Downtown parking is free until further notice, including the 500-space City Centre garage on 3rd Avenue West between 10th and 12th Streets, plus the Judicial Center garage, the County Administration Building and the Post Office lot.',
  'The city says plainly that most anglers need a licence and points you at FWC — no pier licence covers this shoreline. Alcohol is prohibited; leashed dogs are fine.',
],
```

| Claim | Source | What it said |
|---|---|---|
| **24 hours** | cityofbradenton.com/parksrec | "All parks are open from 7:00 a.m. to 9:00 p.m.; Riverwalk is open 24 hours a day." |
| Extent, location, fishing | cityofbradenton.com/parks | "The Bradenton Riverwalk is a 2.03-mile stretch of land lying between the Green and DeSoto bridges along the banks of the Manatee River."; "Visitors can enjoy a safe walking path along the river, fishing, beach volleyball, a skateboard park…"; "Barcarrota Blvd/Waterfront Dr/Riverside Dr" |
| Dock | mymanatee.org, Bradenton Riverwalk Pier | "452 3rd Ave W / Bradenton, FL 34205"; "the dock is located within a 2.03-mile stretch of land, offering a scenic waterfront within Rossi Park" |
| ⏱ Free parking | cityofbradenton.com/parking | "Parking in the City Centre Parking Facility is free until further notice!"; "located at 3rd Avenue West between 10th and 12th Streets… The 500-space garage"; "Public Parking is also available at the County Administration Building, located at 414 10th St. West and at the Post Office parking lot" |
| Licence | cityofbradenton.com/parksrec | "The majority of citizens do need a fishing license, although there are several exceptions. Please call the Florida Fish and Wildlife Conservation Commission at 1-888-347-4356" |
| Alcohol, dogs | same | "Alcohol is prohibited in City parks unless there is an approved special event."; "Dogs are allowed in all parks, but owners must follow City ordinances regarding leashes" |

⏱ **"Free until further notice" is an explicit fee-change flag.** Re-check
before publish and before every release.

⚠️ The county's Riverwalk Pier page publishes **no hours, fee, restroom or
accessibility data**. Restroom locations, ADA specifics and any kayak launch on
the Riverwalk itself are `INSUFFICIENT SOURCES`. The city's own "features and
FAQ" link for the Riverwalk is broken in the page source.

### `safety`

`INSUFFICIENT SOURCES`. No source describes river current, boat traffic, riprap,
railing condition or shade along the Riverwalk. Leave empty.

### `sources`

```ts
{
  id: 'bradenton-parks-rec',
  label: 'City of Bradenton parks — hours, alcohol and dog rules, fishing licences',
  url: 'https://cityofbradenton.com/parksrec',
  publisher: 'City of Bradenton',
  note: 'Source for the Riverwalk being the only city park open 24 hours.',
},
{
  id: 'bradenton-parking',
  label: 'Downtown Bradenton public parking',
  url: 'https://cityofbradenton.com/parking',
  publisher: 'City of Bradenton',
  note: 'Time-sensitive: City Centre garage is "free until further notice".',
},
{
  id: 'manatee-riverwalk-pier',
  label: 'Bradenton Riverwalk Pier — location',
  url: 'https://www.mymanatee.org/connect/locations/location-details/bradenton-riverwalk-pier',
  publisher: 'Manatee County Government',
},
```

---

# 5. `bridge-street-pier` — Bridge Street / Bradenton Beach

**Confidence: high** on facilities and parking, **`INSUFFICIENT SOURCES`** on
hours and on the licence question. ⏱ on repairs.

### `access_notes`

```ts
access_notes: [
  'The Historic Bradenton Beach City Pier, at the end of Bridge Street on the Sarasota Bay side. Walking on is free; the city publishes no opening or closing time, so read the signs at the head of the pier.',
  'Public restrooms, a restaurant and a retail shop on the pier, plus a public day dock and a dinghy dock. The Richard P. Suhre Pavilion at the bay end is the only shade on the deck.',
  'City parking lots on the island are free and close at 9 pm; overnight parking is prohibited. The main lot is off 1st Street North just east of the Circle K, and the free island trolley runs every 20 minutes from 6 am to 10.30 pm.',
  'Hurricane repairs to decking, pilings, handrails and the floating docks were still under way in 2026 under an agreement running to 30 September — expect sections to be fenced.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Name, fishing, restrooms, shop, day dock | cityofbradentonbeach.com/179/City-Pier | "The City Pier features tremendous views and great fishing."; "Features include a restaurant, public restrooms, retail shop, and a floating day dock." |
| Shade | same | "On the bay end of the pier, the Richard P Suhre Pavilion offers a shady spot to fish or just enjoy a beautiful unobstructed view of Sarasota Bay and it's coastline." |
| Day dock / dinghy dock | same | "The Day Dock is a public dock open to boaters on a first come first serve basis… An temporary anchorage area is also available on the south side of the Pier for vessels that are too big for the Day Dock facility's with an available dinghy dock." |
| Lot location, overnight ban | cityofbradentonbeach.com/180/Parking | "The main parking lot is located off of 1st Street North just east of the Circle K."; "Overnight parking is prohibited" |
| Free lots, 9 pm close | same | returned as a bullet list rather than quoted text — **medium**, verify |
| Trolley | same | "free trolleys turn around every 20 minutes from 6 a.m. until 10:30 p.m., 7 days a week transporting visitors to locations anywhere on Anna Maria Island." |
| ⏱ Repairs | pulseofmanatee.com, 29 Mar 2026 | "Hurricane-related repairs include replacing decking, pilings, and handrails, as well as repairing the dinghy dock and addressing damage to floating docks on the south side of the pier."; "extends the agreement's termination date to Sept. 30 to allow time for project completion."; "Some of the repair work has already been completed, while additional improvements remain underway." |

### The bait shop — do not publish

The city page says:
> "Live bait, supplies and tackle will be available when the new bait shop
> opens this summer."

The page does not date "this summer". **Do not claim bait is available.**

### The licence question — do not publish

One angling site states the pier requires no licence:
> "Open · Free … No license required."
> — <https://sarasota.fish/resources/guides/fishing-piers-and-bridges/>

That implies an FWC pier licence, but no official source confirms one, and this
pier is not in the FWC boating guide's pier list (so there is no
`Fishing License Provided` field to check, as there is for Green Bridge and
Palma Sola). **`INSUFFICIENT SOURCES`.** If anything is written, write "ask on
the pier whether its licence covers you".

### `safety`

```ts
safety: [
  'The pier has a working public day dock and dinghy dock, and boats come alongside all day. Cast clear of the docking area rather than over it.',
],
```

Everything else — no lifeguard, stingrays, riprap — is `INSUFFICIENT SOURCES`.

### `sources`

```ts
{
  id: 'bradenton-beach-city-pier',
  label: 'Historic Bradenton Beach City Pier — facilities and access',
  url: 'http://www.cityofbradentonbeach.com/179/City-Pier',
  publisher: 'City of Bradenton Beach',
},
{
  id: 'bradenton-beach-parking',
  label: 'Bradenton Beach parking and island trolley',
  url: 'https://www.cityofbradentonbeach.com/180/Parking',
  publisher: 'City of Bradenton Beach',
},
{
  id: 'bridge-street-pier-repairs',
  label: 'Bradenton Beach extends hurricane pier-repair agreement to 30 September',
  url: 'https://www.pulseofmanatee.com/p/bradenton-beach-approves-updated',
  publisher: 'Pulse of Manatee (29 March 2026)',
  note: 'Time-sensitive: partial pier closures possible while work continues.',
},
```

---

# 6. `longboat-pass` — Longboat Pass

**Confidence: high** on the Longboat Key side and the FDOT status;
**`INSUFFICIENT SOURCES`** on the thing anglers most want to know — the bridge
catwalk.

### `access_notes`

```ts
access_notes: [
  'Shore access on the Anna Maria side is through the two Coquina Bayside boat ramps on Gulf Drive South; both are posted no overnight parking under Ordinance 23-121.',
  'On the Longboat Key side, the public access at 100 North Shore Road has about thirty parking spaces on site.',
  'Longboat Key closes every public beach and bay access from 11 pm to 5 am, so the south side of the pass is not a legal night-fishing spot.',
  'FDOT has no construction project on this bridge, but its replacement study was due to finish in mid-2026 — the bridge you fish today may not be the bridge that is here in a decade.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Coquina Bayside ramps | mymanatee.org, Coquina Bayside North / South | "Gulf Drive S, Bradenton Beach, FL 34217"; "1465 Gulf Dr S"; hours field "No Overnight Parking"; "Ordinance 23-121" |
| North Shore Road parking | longboatkey.org/331/Beaches | table row "100 North Shore Road \| Parking available on site \| ~30" |
| 11 pm – 5 am closure | same | "All persons and vehicles are prohibited from being present on any public beach or bay access or the public beach from 11 pm to 5 am, unless otherwise marked by signage." |
| ⏱ No construction | swflroads.com/projects/Road/SR789/Construction | "There are no projects to show at this time." |
| ⏱ PD&E study | swflroads.com/project/436676-1 | "The study will evaluate alternatives to replace the existing SR 789 Bridge over Longboat Pass."; "Est. Completion of Current Phase: Mid 2026" |

### The catwalk — `INSUFFICIENT SOURCES`

No FDOT, FWC or county page names a fishing catwalk on the Longboat Pass Bridge,
states whether fishing from it is permitted, or reports its condition. **Do not
write anything about the catwalk in either direction.** A forum post mentions
signs telling people to stay off the rock jetty; that is not publishable.

### `safety`

```ts
safety: [
  'There are no lifeguards anywhere on Longboat Key.',
],
```

Source: <https://www.longboatkey.org/331/Beaches> — "The beaches of Longboat Key
are not monitored by lifeguards." **Confidence: high.**

⚠️ **Everything else is `INSUFFICIENT SOURCES`** — and that is uncomfortable,
because this is a hard-running pass with two boat ramps discharging into it and
a rock jetty. The obvious lines (strong tide, boat traffic, slippery rock) are
true of every pass in the guide and are already written at Pass-a-Grille and
Bunces Pass off *sourced* descriptions. Here there is no source. Either leave
`safety` at the lifeguard line, or find an official description of Longboat Pass
manually.

### `sources`

```ts
{
  id: 'longboat-key-beaches',
  label: 'Longboat Key public beach and bay accesses — parking, hours, no lifeguards',
  url: 'https://www.longboatkey.org/331/Beaches',
  publisher: 'Town of Longboat Key',
},
{
  id: 'manatee-coquina-bayside-north',
  label: 'Coquina Bayside North boat ramp',
  url: 'https://www.mymanatee.org/connect/locations/location-details/coquina-bayside-north-boat-ramp',
  publisher: 'Manatee County Government',
},
{
  id: 'fdot-sr789-pde',
  label: 'SR 789 bridge over Longboat Pass — replacement PD&E study',
  url: 'https://www.swflroads.com/project/436676-1',
  publisher: 'Florida Department of Transportation, District One',
  note: 'Study only; no construction project as of August 2026.',
},
```

---

# 7. `coquina-beach` — Coquina Beach

**Confidence: high.** The best-sourced spot in the set. ⏱ **major** — see
NEEDS URGENT REVIEW.

### `access_notes`

```ts
access_notes: [
  'Manatee County beach park at 2650 Gulf Drive, Bradenton Beach, open sunrise to sunset unless posted otherwise.',
  'Parking is free and there is a lot of it, but the island lots close at 9 pm and overnight parking is prohibited. A free island trolley serves the park.',
  'Restrooms, showers, changing cabanas, concessions and a gift shop on site. Three beach wheelchairs and a walker are lent free at the concession stand, first come first served.',
  'Lifeguards are on duty 9 am to 5 pm, and to 7 pm between Memorial Day and Labor Day — outside those hours nobody is watching the water.',
  'Sea turtle nesting runs 1 May to 31 October: no lights on the beach after dark and all furniture off the sand at dusk. Alcohol, glass, pets, drones and fireworks are prohibited year-round.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Address, hours | mymanatee.org Coquina Beach | "2650 Gulf Drive / Bradenton Beach, FL 34217"; "Sunrise to Sunset, unless otherwise posted or allowed by special permit" |
| Amenities | same | list includes "beach wheelchairs, benches, bike racks, changing cabanas, concessions, gift shop, grills, lifeguard station, parking, restrooms, sand volleyball courts, shower stations, trolley stop" |
| Beach wheelchairs | same | "Wheelchairs are \"rented\" at the concession stand at no charge."; "Three Wheelchairs and One Walker" |
| Lifeguard hours | same | "9 a.m. - 5 p.m. Labor Day thru Memorial Day and 9 a.m. - 7 p.m. Memorial Day through Labor Day" |
| Lifeguarded at all | mymanatee.org, Find a Lifeguarded Beach | "Coquina Beach, Cortez Beach, and Manatee Public Beach are the only beaches in Manatee County that provide beachgoers with professional lifeguard and medical rescue services." |
| Big lots | cityofbradentonbeach.com/189/Beaches | "acres of parking found at the Coquina Park at the south end of the island" |
| Free / 9 pm / overnight | cityofbradentonbeach.com/180/Parking | "Overnight parking is prohibited" quoted; "all parking areas are free" and "lots close at 9 p.m." returned as paraphrase — **medium** |
| Turtle season, prohibitions | mymanatee.org Coquina Beach | 1 May–31 Oct, no lights after sunset, furniture removed at dusk; alcohol, glass, pets, drones, fireworks prohibited |

⚠️ **Do not write "lifeguards 365 days a year".** The county page carries that
sentence but it names **Manatee Public Beach**, not Coquina — the page reuses a
boilerplate block. The safe claim is the hours only.

⚠️ **"Lot fills by 8am" is not sourceable.** Every claim of that kind traces to
tourism blogs. Leave it out.

⚠️ **Paid parking is not in effect** at Coquina as of this research, but is
under active county study. Do not publish a fee.

### `safety`

```ts
safety: [
  'Lifeguards cover 9 am to 5 pm, and to 7 pm in summer. Dawn and dusk — the two best windows here — are unguarded.',
  'Read the flags before you wade: two red is closed water, one red is high hazard or strong current, purple is dangerous marine life.',
  'If a rip takes you, do not swim against it. Swim parallel to the beach until you are out of it, then in.',
  'Two county boat ramps discharge into Longboat Pass immediately south of the beach — expect traffic close in at the south end.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Flag system | mymanatee.org, Find a Lifeguarded Beach | "Two red flags - Water Closed to Public"; "One red flag - High Hazard, High Surf and/or Strong Currents"; "Purple Flag - Dangerous Marine Life" |
| Rip currents | same | "Rip currents are responsible for the majority of drowning deaths in Florida."; "Do not try to swim against the current"; "Swim parallel to the shore until you are out of the current, then swim directly toward shore." |
| Ramps | mymanatee.org Coquina Bayside North/South | addresses on Gulf Drive S, immediately south of the beach |

---

# 8. `bean-point` — Bean Point

**Confidence: high** on the city rules and on "no lifeguard";
**`INSUFFICIENT SOURCES`** on parking locations and hours. ⏱ on the parking
study.

**The City of Anna Maria publishes nothing named Bean Point.** Its home page,
Visitors page, Beach Regulations page, Things to Do page and City Alerts were
all fetched; none names it. Everything below is city-wide rule that applies at
the point.

### `access_notes`

```ts
access_notes: [
  'The north tip of Anna Maria Island, reached on foot from the residential streets off North Shore Drive. There is no parking lot at the point and the city publishes no list of access points.',
  'Anna Maria enforces parking hard: all tyres off the pavement, nothing within 30 feet of a stop sign or 20 feet of an intersection, nothing on a sidewalk or blocking a drive. Park with the flow of traffic and read every sign.',
  'No restrooms at the point. The nearest are at Anna Maria Bayfront Park, 310 North Bay Boulevard, open sunrise to sunset with restrooms and showers.',
  'No dogs, no glass, no alcohol, no fires and no anchoring a boat to the beach. During turtle season, 1 May to 31 October, any light that reaches the beach is prohibited — which rules out the way most people fish a beach at night.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Parking enforcement | cityofannamaria.com/182/Parking-Enforcement | "Parking Laws are strictly enforced in Anna Maria."; violation list "Parking with tires on the pavement", "Parked within 30' of a stop sign", "Parked within 20' of the intersection", "Parking on or over a sidewalk", "Blocking drive" |
| Park with traffic | cityofannamaria.com/207/Visitors | "Park with the flow of traffic." |
| Beach rules | cityofannamaria.com/226/Beach-Regulations | prohibited: "Alcoholic Beverages", "Glass containers of any kind", "Pets of any species of animal", "Grills or fires of any kind", "Anchoring vessels to the beach", "Motorized vehicles, including golf carts", "Bicycles" |
| Turtle-season lighting | cityofannamaria.com/207/Visitors | "Artificial lighting which directly/indirectly illuminates the beach is prohibited." (1 May – 31 Oct) |
| Nearest restrooms | mymanatee.org, Anna Maria Bayfront Park | "310 North Bay Boulevard Anna Maria, FL 34216"; "Sunrise to Sunset, unless otherwise posted or allowed by special permit"; amenities include "Restrooms", "Shower Stations"; "No lifeguard on duty" |

### `safety`

```ts
safety: [
  'No lifeguard. Manatee County guards only Coquina, Cortez and Manatee Public beaches — Bean Point is not one of them.',
],
```

Source: mymanatee.org "Find a Lifeguarded Beach" — "Coquina Beach, Cortez Beach,
and Manatee Public Beach are the only beaches in Manatee County that provide
beachgoers with professional lifeguard and medical rescue services."
**Confidence: high**, and unusually this is a *positive* source for a negative
claim, which is worth having.

⚠️ Bean Point sits where Tampa Bay meets the Gulf and everything about that —
current, drop-off, boat traffic — is `INSUFFICIENT SOURCES`. No official page
describes the water. This is the biggest unfilled safety gap in the set, because
it is genuinely the most exposed shore spot of the fifteen.

### ⏱ Parking policy is in flux

- City alert, 14 Aug 2026: a public meeting on the **City of Anna Maria Parking
  Study** was set for 31 August 2026.
  <https://www.cityofannamaria.com/CivicAlerts.aspx?AID=34>
- AMI Sun, 18 Aug 2026: "no final decisions have been made to implement the
  proposed parking program"; the study "proposes designating 1,119 paid parking
  spaces"; a "$4.50-per-hour parking rate" was suggested, with a launch proposed
  "in March".
  <https://amisun.com/anna-maria-parking-study-recommends-permit-and-paid-parking/>

**Nothing is adopted.** Do not publish a rate. But this note goes stale fast and
must be re-checked before any release after early 2027.

### `sources`

```ts
{
  id: 'anna-maria-parking-enforcement',
  label: 'Anna Maria parking enforcement — what gets you a citation',
  url: 'https://www.cityofannamaria.com/182/Parking-Enforcement',
  publisher: 'City of Anna Maria',
},
{
  id: 'anna-maria-beach-regulations',
  label: 'Anna Maria beach regulations and turtle-season lighting',
  url: 'https://www.cityofannamaria.com/226/Beach-Regulations',
  publisher: 'City of Anna Maria',
},
{
  id: 'manatee-lifeguarded-beaches',
  label: 'Manatee County lifeguarded beaches, flag system and rip-current guidance',
  url: 'https://www.mymanatee.org/services-and-amenities/service-listing/service-details/find-a-lifeguarded-beach',
  publisher: 'Manatee County Government',
},
```

---

# 9. `cortez-bridge` — Cortez Bridge

## ⚠️ This is the entry the brief flagged, and the finding is real.

**Status: the replacement project entered construction in September 2026 — this
month.** The existing 1956 drawbridge stays open to traffic and pedestrians
until Phase 2, but there is heavy marine construction in the water beside it for
roughly the next three years.

**Confidence: high** on the project; **`INSUFFICIENT SOURCES`** on what happens
to fishing access, which is exactly the thing a reader needs.

### `access_notes`

```ts
access_notes: [
  'FDOT began construction of the replacement bridge in September 2026 — a 1,200-day project. The existing bridge stays open to traffic and pedestrians through Phase 1; the old drawbridge is demolished in Phase 2, with the second traffic shift expected mid-2028.',
  'Traffic is shifted slightly south at both approaches while crews build the north half of the new bridge, and the work is being done from barges and temporary trestles in the water either side of the span.',
  'FDOT has published nothing about fishing access from the bridge during construction. Assume the sidewalk, the shoulders and any informal pull-off you used before may be closed at short notice, and check FL511 or the project page on the day.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Limits, cost, duration | swflroads.com/project/430204-2 (FDOT) | "from SR 789 (Gulf Drive) to 123rd Street West, a distance of about 0.9 mile"; "Approximately $123 million"; "Approximately 1,200 days" |
| Phase 1 / Phase 2 | same | "Traffic will be shifted slightly south at both bridge approaches during Phase 1"; "Phase 1 Traffic Shift: Anticipated by the end of this year"; "Phase 2 Traffic Shift: Anticipated in mid-2028"; Phase 2 is "Demolition of the existing bridge" |
| Marine construction | same | "Construction will be performed using barges and temporary trestles in both phases" |
| September start | yourobserver.com, 13 Aug 2026 | "Construction of the 65-foot-clearance bridge is expected to begin with phase 1 in September." |
| Access maintained | pulseofmanatee.com | "phased approach is intended to maintain access between Cortez and Bradenton Beach throughout construction" |

### What could NOT be sourced, and was not written

- Whether fishing from the Cortez Bridge sidewalk is permitted at all, before or
  during construction. No FDOT, FWC, Manatee County or City of Bradenton Beach
  page addresses it.
- Any FDOT statement on angler access, sidewalk closures during Phase 1, or loss
  of shore access.
- A search snippet referenced "a loss of two informal fishing locations given the
  height of new bridges". **The underlying document could not be retrieved and
  the claim has not been used.**

### `safety`

```ts
safety: [
  'This is now an active construction site. Barges, temporary trestles and work boats operate in the channel either side of the bridge for the life of the project — do not fish, drift or anchor into the work zone.',
  'The 1956 drawbridge is scheduled for demolition in Phase 2. Treat every barricade, cone and closure sign here as current, because the layout changes as the job moves.',
],
```

Both derive from the FDOT project page quoted above. **Confidence: high** for
the construction facts; the advice framing is editorial but not a factual claim.

### `sources`

```ts
{
  id: 'fdot-cortez-bridge',
  label: 'Cortez Bridge (SR 684) replacement — phases, schedule and construction method',
  url: 'https://www.swflroads.com/project/430204-2',
  publisher: 'Florida Department of Transportation, District One',
  note: 'Time-sensitive. Construction began September 2026; ~1,200 days; existing bridge demolished in Phase 2 from mid-2028.',
},
{
  id: 'observer-cortez-start',
  label: 'Cortez Bridge replacement to start soon',
  url: 'https://www.yourobserver.com/news/2026/aug/13/cortez-bridge-replacement-soon/',
  publisher: 'Your Observer (13 August 2026)',
},
```

⚠️ **Also relevant to `bridge-street-pier`, `coquina-beach` and `longboat-pass`**
— the Cortez Bridge is the main mainland road access to Bradenton Beach. Traffic
impacts run from late 2026 into 2029.

---

# 10. `south-palma-sola-flats` — South Palma Sola Flats

**Confidence: high** on the two preserves; **`INSUFFICIENT SOURCES`** on the
flats themselves.

The nearest public land to `27.4798, -82.6758` is two Manatee County preserves
on Manatee Ave W. **Neither has a boat ramp or a kayak launch.** The nearest
launch of any kind is the Palma Sola Causeway ramp, roughly 1.5–2 miles north.

### `access_notes`

```ts
access_notes: [
  'The nearest public access is two Manatee County preserves on Manatee Ave W — Perico Preserve at 11700 and Neal Preserve at 12301. Both open daily, sunrise to sunset, 365 days a year, and both list fishing access.',
  'Neither preserve has a boat ramp or a kayak launch. If you need to launch, the Palma Sola Causeway ramp is a mile and a half north.',
  'Perico has an observation dock, a bird blind, boardwalks and a picnic shelter, but no restrooms. Neal has boardwalks, a 20-foot observation tower and a 0.3-mile shell trail loop, and one portable restroom in the car park.',
  'Neal parks on the south side of Manatee Avenue with overflow parking on the north side of the Anna Maria Island Bridge — crossing SR 64 on foot to fish is not a good plan.',
  'Perico is a designated bird sanctuary: no dogs except service dogs, bikes on designated trails only. Neal allows no pets at all and no bikes on the trails.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Perico address, hours | mymanatee.org Perico Preserve | "11700 Manatee Ave W, Bradenton, FL 34209 (941) 748-4501"; "Open daily 365 days a year from sunrise to sunset." |
| Perico amenities | same | "Benches / Boardwalk / Fishing Access / Interpretive signage / Outlooks and Observation Towers / Picnic areas / Picnic Shelter / Picnic Tables / Pond / Walking Trail / Wildlife viewing areas"; "Observation Dock" — no restrooms listed (**medium**, inference from absence) |
| Perico bird sanctuary rules | same | "we ask that visitors leave their furry friends, with the exception of service dogs, at home when visiting Perico… Similarly, bikes will only be allowed on designated trails within the preserve." |
| Neal address, hours | mymanatee.org Neal Preserve | "12301 Manatee Ave W, Bradenton, FL 34209"; "Open daily 365 days a year from sunrise to sunset." |
| Neal parking, restroom | same | "Located on the south side of Manatee Avenue, overflow parking is available on the north side of the Anna Maria Island Bridge. There is one portable restroom in the parking area." |
| Neal features | same | "a 20 foot tall observation tower, 0.3 mile shell trail loop, and boardwalks that wind through the coastal environment" |
| Neal rules | same | "pets are not allowed at Neal Preserve and bicycles are not allowed on trails and should be parked at racks provided"; "collecting is not allowed in this 'open air museum.'" |

⚠️ **The overflow-parking hazard is inference.** The county says overflow parking
is across Manatee Avenue; it does **not** say crossing SR 64 is dangerous. The
proposed fourth note draws that conclusion. Defensible, but it is editorial —
reviewer's call.

⚠️ Entrance fees: no county page states one for either preserve.
`INSUFFICIENT SOURCES` for a positive "free" claim.

⚠️ Neither page carries a closure alert as of 2026-08-20 — weak positive
evidence both are open.

### `safety`

`INSUFFICIENT SOURCES`.

⚠️ **This is the most uncomfortable gap in the whole review.** The spot is typed
`access: ['kayak', 'wade']` on a shallow south-bay flat, which is precisely where
oyster-bar cuts and tide cut-off happen — and **no official source describes the
water at all.** The guide already writes "shuffle your feet, rays bury on the
sand between the grass" at South Lido off a sourced description of the same
habitat; a reviewer may judge that transferable. It is not sourced *here*.

### `sources`

```ts
{
  id: 'manatee-perico-preserve',
  label: 'Perico Preserve — hours, fishing access, bird-sanctuary rules',
  url: 'https://www.mymanatee.org/connect/locations/location-details/perico-preserve',
  publisher: 'Manatee County Government',
},
{
  id: 'manatee-neal-preserve',
  label: 'Neal Preserve — hours, parking, facilities and restrictions',
  url: 'https://www.mymanatee.org/connect/locations/location-details/neal-preserve',
  publisher: 'Manatee County Government',
},
```

---

# 11. `stump-pass` — Stump Pass

**Confidence: medium throughout** — `floridastateparks.org` returned HTTP 403 to
every attempt, so there is **no official source** for hours, fee or current
status. ⏱ heavily. See NEEDS URGENT REVIEW.

### `access_notes`

```ts
access_notes: [
  'Stump Pass Beach State Park at the south end of Manasota Key, 900 Gulf Blvd, Englewood. Reported open 8 am to sundown daily — not sunrise.',
  'Three-dollar-per-vehicle entry. The old pay station is gone; payment is made online by card at a posted sign, so bring a phone.',
  'The permanent restroom pavilion is still out of service after the 2024 hurricanes; temporary restrooms sit near the gate, on what used to be parking.',
  'Parking is the constraint — roughly thirty to fifty spaces, down from about eighty, and it fills early.',
  'Leashed dogs on the trail, but not on the beach.',
],
```

| Claim | Source | What it said |
|---|---|---|
| ⏱ Reopened Sep 2025 | floridarambler.com | "Almost a year later, Stump Pass Beach State Park reopened Sept. 19, 2025." |
| Hours 8 am | yoursun.com, 15 Sep 2025 | "8 a.m. to sundown every day of the year" — corroborated by floridahikes.com "Open 8 AM until sunset daily." Florida Rambler says "sunrise to sunset"; two of three say 8 am |
| $3 fee | yoursun.com | "$3 per vehicle entry fee" — corroborated by floridarambler.com "still $3 per car" and floridahikes.com "$3 per vehicle" |
| Pay online | yoursun.com | pay station gone; visitors pay online by credit card at a posted sign |
| ⏱ Restrooms | yoursun.com | "Temporary restrooms are in place near the gate." — corroborated by floridarambler.com "there are temporary restrooms" |
| Parking | yoursun.com | "once about 80 spaces" reduced to "room for about 50"; floridarambler.com says 30–40 |
| Dogs | floridahikes.com | "Leashed pets welcome but not on beach." |
| Address | floridahikes.com | "900 Gulf Blvd, Englewood"; "941-964-0375" |

### `safety`

```ts
safety: [
  'Hurricane Milton cut a new pass straight through the peninsula along the nature trail. The old walk out to the tip of Stump Pass no longer exists as one continuous beach — do not plan on it.',
  'A pass mouth with hard structure either side is where rip currents form. There are no lifeguards here.',
],
```

| Claim | Source | What it said |
|---|---|---|
| ⏱ New pass | floridahikes.com | "Hurricane Milton tore a new pass through the peninsula along the Nature Trail." — corroborated by floridarambler.com: "creating a new pass through what was the extended undeveloped beach"; "Milton Pass… has made it shorter" (beach "used to be 1.3 miles") |
| Rips at structures | weather.gov/safety/ripcurrent-science (NWS) | rip currents are "frequently found next to both natural and man-made hard structures such as headlands, groins, jetties, and piers"; channel rips "may reach speeds up to 8 feet per second!" |
| No lifeguards | englewoodtouristinfo.com | "Lifeguards: None" — **medium**, tourism site, not official |

⚠️ The NWS quote is *generic* rip-current science, not a Stump Pass advisory. It
is defensible as a general hazard statement but must not be framed as "the NWS
warns about Stump Pass".

⚠️ Any existing description of "the 1.3-mile trail to the tip" is now wrong.

### `sources`

```ts
{
  id: 'yoursun-stump-pass-reopen',
  label: 'Stump Pass Beach State Park reopens — hours, fee, temporary restrooms',
  url: 'https://www.yoursun.com/charlotte/news/stump-pass-beach-state-park-reopens/article_f91fac75-0a7d-491d-b4ec-62c551d8d752.html',
  publisher: 'Sun Newspapers (15 September 2025)',
  note: 'Used because floridastateparks.org could not be fetched. Verify against the state park page before publish.',
},
{
  id: 'floridahikes-stump-pass',
  label: 'Stump Pass Beach State Park — trail, new Milton cut, dogs',
  url: 'https://floridahikes.com/stump-pass-beach-state-park/',
  publisher: 'Florida Hikes',
},
{
  id: 'nws-rip-currents',
  label: 'Rip current science — where rips form and how fast they run',
  url: 'https://www.weather.gov/safety/ripcurrent-science',
  publisher: 'NOAA National Weather Service',
},
```

---

# 12. `englewood-beach` — Englewood Beach

**Confidence: high** — Charlotte County publishes real, current, quotable detail.
The one gap is lifeguards.

### `access_notes`

```ts
access_notes: [
  'Englewood Beach at Chadwick Park, 2100 N. Beach Road on Manasota Key. Open 6 am to 9 pm; the county boat ramps and fishing piers keep separate 24-hour access.',
  'Parking is paid — 75 cents an hour, by the ParkMobile app or bought in advance. Passes run $26.75 for three months, $37.45 for six and $53.50 for the year.',
  'Parking is free at any Charlotte County beach, ramp or pier for a vehicle displaying a state handicap plate or placard, provided the permit holder is present.',
  'Restrooms, showers and water stations on site. Beach wheelchairs are self-service seven days a week from 7.30 am and must be back by 3.30 pm — so an evening session cannot use one.',
  'There is no boat ramp or kayak launch at the beach itself; the nearest county launches are Ainger Creek Park and Placida Park.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Hours | charlottecountyfl.gov …/parks/beaches.stml | "6 a.m. to 9 p.m." — corroborated by the parking page: "Englewood Beach and Port Charlotte Beach: 6 a.m. to 9 p.m. Boat Ramps and Fishing Piers: 24 hours a day, seven days a week" |
| Address | same | "2100 N. Beach Road Englewood" |
| 75c/hr | …/parks/all-parks/englewood-beach-at-chadwick-park.stml | "75 cents per hour" — corroborated: "The cost is $0.75 per hour." |
| Passes | …/parks/parking.stml | Annual $53.50 / 6 Month $37.45 / 3 Month $26.75 |
| ParkMobile | same | "Beach and boat ramp parking can be paid at the beach with your smartphone or in advance by tablet, computer or smartphone." |
| Handicap free | same | "If you have a State issued handicap permit (plate or placard), you may park for free at any Charlotte County operated beach, park, boat ramp or fishing pier, provided the person issued the permit is present." |
| Beach wheelchairs | …/englewood-beach-at-chadwick-park.stml | "Beach wheelchairs are available 7 days a week on a help yourself basis starting at 7:30 a.m. and must be returned by 3:30 p.m." |
| Amenities | same | "showers, water stations, volleyball courts, basketball court"; "Restroom/Portable Toilet"; "Playground" |
| No ramp here | …/parks/amenities/fishing.stml | Englewood-area ramps listed are Ainger Creek Park, Placida Park, Butterford Waterway Park, Lemon Bay Sunrise Rotary Park, South Gulf Cove Park — Englewood Beach is not among them |

⏱ **A free park-and-ride shuttle runs from Tringali Park, 10 am–4 pm Mon–Sat**
("Charlotte County Transit is providing a free park and ride service to the beach
from Tringali Park from 10 a.m.-4 p.m., Monday-Saturday.") — worth a line, but
confirm it is still running.

⏱ **The southern lot entrance reopened 2 April 2025** ("The southern entrance to
Englewood Beach parking lot has reopened as of April 2, 2025") — post-storm item,
now resolved.

### The pier — do not promise it

Charlotte County's fishing page lists **only Centennial Fishing Pier** as open,
and notes multiple piers were hurricane-damaged with 12–24 month permitting
before repairs begin. **Verify the Englewood Beach pier specifically before any
note mentions it.**

### `safety`

```ts
safety: [
  'Charlotte County publishes no lifeguard information for this beach. Do not assume anyone is watching the water.',
],
```

⚠️ This is deliberately hedged. The county's Englewood Beach page was searched
for "lifeguard", "swim at your own risk", "water safety", "rip current" and "red
tide" — **all five terms are absent.** So "there are no lifeguards" is *not*
sourced; "the county says nothing either way" is. Everything else — rips, sharks,
shade — is `INSUFFICIENT SOURCES`.

### `sources`

```ts
{
  id: 'charlotte-englewood-beach',
  label: 'Englewood Beach at Chadwick Park — parking, amenities, beach wheelchairs',
  url: 'https://www.charlottecountyfl.gov/departments/community-services/parks/all-parks/englewood-beach-at-chadwick-park.stml',
  publisher: 'Charlotte County, Florida',
},
{
  id: 'charlotte-parks-parking',
  label: 'Charlotte County park parking — rates, passes and the handicap exemption',
  url: 'https://www.charlottecountyfl.gov/departments/community-services/parks/parking.stml',
  publisher: 'Charlotte County, Florida',
},
{
  id: 'charlotte-fishing-amenities',
  label: 'Charlotte County fishing piers, boat ramps and kayak launches',
  url: 'https://www.charlottecountyfl.gov/departments/community-services/parks/amenities/fishing.stml',
  publisher: 'Charlotte County, Florida',
  note: 'Time-sensitive: lists only Centennial Fishing Pier as open; others closed for hurricane restoration.',
},
```

---

# 13. `lemon-bay-mangroves` — Lemon Bay Mangroves

**Confidence: medium**, and ⏱ **critical**. See NEEDS URGENT REVIEW.

### `access_notes`

```ts
access_notes: [
  'The bay is reached from public launches rather than from one named site. Indian Mound Park, 210 Winson Ave, Englewood, is the closest — a Sarasota County ramp with docks and restrooms, open 6 am to midnight.',
  'Ainger Creek Park, 2011 Placida Road, is the Charlotte County launch at the south end, with a single-lane ramp, a canoe and kayak launch, restrooms and 24-hour ramp access; parking there is the county 75-cents-an-hour charge.',
  'The fishing piers at Ainger Creek Park are closed.',
  'Lemon Bay Park and Environmental Center, 570 Bay Park Blvd, has a hand launch behind the environmental centre, but it was still closed from Hurricane Helene damage when last reported — call Sarasota County Parks before you drive out.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Indian Mound | FWC Charlotte Harbor guide, indian_mound | "210 Winson Ave."; "6AM to Midnight"; Ramp Fee "No"; "1/4"; Docks "Yes"; Restrooms "Yes"; Handicap Accessible "Yes"; "Sarasota County Parks and Recreation" |
| Ainger Creek address, amenities | charlottecountyfl.gov …/ainger-creek-park.stml | "2011 Placida Road, Englewood, FL 34224"; amenities "Boat Ramp", "Canoeing, Kayaking & Paddling", "Fishing", "Restroom/Portable Toilet" |
| ⏱ **Ainger piers closed** | same | **"The fishing piers at Ainger Creek Park are closed."** |
| Ainger ramp fee/hours | FWC Charlotte Harbor guide, ainger_creek | "1/1"; "Hourly parking fee required. A yearly parking pass is available."; "24 hours"; Restrooms "Yes"; Handicap Accessible "Yes" |
| Lemon Bay Park address, launch | visitsarasota.com | "570 Bay Park Blvd, Englewood, FL 34223"; "a 210-acre nature-based park… with 1.7 miles of shoreline on the beautiful Lemon Bay Aquatic Preserve"; "a canoe/kayak launch"; "restrooms" |
| ⏱ **Lemon Bay Park closed** | floridahikes.com | **"Mar 2025 update. The park remains closed due to damage from Hurricane Helene."** |

⚠️ Indian Mound's "no fee" and hours come from an FWC survey **dated August
2011** — pre-Ian, pre-Helene, pre-Milton, and 15 years before the county's
current parking regime. **Treat "free" as unverified and do not write it.**

### `safety`

`INSUFFICIENT SOURCES`. No official source names oyster bars, wading hazards or
boat traffic in Lemon Bay. Leave empty.

### `sources`

```ts
{
  id: 'charlotte-ainger-creek',
  label: 'Ainger Creek Park — ramp, kayak launch, and the closed fishing piers',
  url: 'https://www.charlottecountyfl.gov/departments/community-services/parks/all-parks/ainger-creek-park.stml',
  publisher: 'Charlotte County, Florida',
  note: 'Time-sensitive: the county states the park’s fishing piers are closed.',
},
{
  id: 'fwc-indian-mound-ramp',
  label: 'Indian Mound Park boat ramp — hours, lanes and facilities',
  url: 'https://gis.myfwc.com/boating_guides/Charlotte_Harbor/pages/boat_ramps/indian_mound/index.html',
  publisher: 'FWC — Boating and Angling Guide to Charlotte Harbor',
  note: 'Facility survey dated August 2011.',
},
{
  id: 'visitsarasota-lemon-bay-park',
  label: 'Lemon Bay Park and Environmental Center — shoreline, launch and facilities',
  url: 'https://www.visitsarasota.com/beaches-parks/lemon-bay-park-and-environmental-center',
  publisher: 'Visit Sarasota County',
  note: 'Sarasota County’s own park pages could not be fetched (HTTP 403).',
},
```

---

# 14. `placida-gasparilla-sound` — Placida / Gasparilla Sound

**Confidence: high** on the county facts, **medium** on ramp congestion. ⏱ on
the 2027 construction.

### `access_notes`

```ts
access_notes: [
  'Placida Park, 6499 Boca Grande Causeway, is the public launch onto Gasparilla Sound — three launch lanes with boarding piers and around seventy-nine trailer spaces. Park hours are 6 am to 9 pm; the ramp itself is 24 hours.',
  'No launch fee, but every vehicle pays to park between 6 am and 10 pm at the county rate of 75 cents an hour. A yearly parking pass is available, and a state handicap permit parks free.',
  'Restrooms on site; no bait or tackle at the ramp.',
  'Expect a queue. Anglers report waits of about half an hour on busy days, and longer for bigger boats at weekends.',
  'The Placida Rotary Centennial Park fishing pier, an old railroad trestle at CR 775 and Fishery Rd, is free and open 24 hours, but sits about a third of a mile from its parking and the walkway is awkward when wet.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Address, amenities | charlottecountyfl.gov …/placida-park.stml | "6499 Boca Grande Causeway, Placida, FL 33946"; "Boat Ramp"; "Canoeing, Kayaking & Paddling"; "Restroom/Portable Toilet" |
| Hours | charlottecountyfl.gov park-hours PDF | "Placida Park 6499 Boca Grande Causeway Placida 33946 6 a.m. to 9 p.m. 24 Hours" — corroborated: "Boat Ramps and Fishing Piers: 24 hours a day, seven days a week" |
| Ramp fee vs parking fee | FWC Charlotte Harbor guide, Placida_Park | ramp fee "No"; "All vehicles must pay to park between 6AM to 10PM. A yearly parking pass is available."; "1/3" lanes |
| 75c/hr, handicap free | charlottecountyfl.gov …/parks/parking.stml | "The cost is $0.75 per hour."; handicap-permit exemption quoted under Englewood Beach |
| Lanes, trailer spaces, waits | bocabeacon.com, 1 Feb 2024 | "three launch lanes, three boarding piers and 79 boat trailer parking spaces"; users report ~30-minute waits on busy days, over an hour at weekends for larger boats; "Bigger boats – anything over 12 feet – almost always have to wait." — **medium** |
| Placida pier | FWC Charlotte Harbor guide, Placida | "Placida Rotary Centennial Park", "CR 775 and Fishery Rd."; Hours "24 hours"; Entrance Fee "No"; Restrooms "Yes"; "The walkway from Fishery Rd. to the path leading to the pier may provide some difficulty to those with disabilities, especially when wet."; pier ~0.3 mi from parking |

⏱ **Placida West Boat Ramp Expansion — construction 24 Feb 2027 to 19 May 2028.**
<https://www.charlottecountyfl.gov/projects/placida-west-boat-ramp-expansion.stml>
Scope: "2-lane boat ramp, kayak launch, additional parking for both vehicles and
boat trailers, asphalt ADA parking, and a restroom facility"; master plan reaches
"6 launch lanes with boarding piers". **The county page does not say whether the
existing ramp closes during construction — treat access from Feb 2027 as
unknown.**

⚠️ **Pier status caveat, again:** the county's fishing page lists only Centennial
Fishing Pier as open. Verify the Placida pier before publishing the last access
note.

⚠️ Eldred's Marina, the classic private launch for the Pass, is listed by FWC
("6301 Boca Grande Causeway"; 24 hours; "Pay at marina office"; "2/2"; Bait
"Yes"; Handicap Accessible "No") but that is an **August 2011** survey of a
private business. Do not publish its details.

### `safety`

`INSUFFICIENT SOURCES` for the sound itself — no official source names oyster
bars, shoaling or boat traffic in Gasparilla Sound. The one publishable line is
the ramp:

```ts
safety: [
  'A busy three-lane ramp with a real queue at weekends. If you fish near it, stay clear of reversing trailers — that end is a working launch, not a fishing platform.',
],
```

(Phrasing mirrors the existing New Pass / Ken Thompson note; the congestion fact
is **medium**, from the Boca Beacon article.)

### `sources`

```ts
{
  id: 'charlotte-placida-park',
  label: 'Placida Park — boat ramp, paddling access and facilities',
  url: 'https://www.charlottecountyfl.gov/departments/community-services/parks/all-parks/placida-park.stml',
  publisher: 'Charlotte County, Florida',
},
{
  id: 'charlotte-placida-west-expansion',
  label: 'Placida West boat ramp expansion — scope and schedule',
  url: 'https://www.charlottecountyfl.gov/projects/placida-west-boat-ramp-expansion.stml',
  publisher: 'Charlotte County, Florida',
  note: 'Time-sensitive: construction scheduled 24 Feb 2027 – 19 May 2028; effect on the existing ramp not stated.',
},
{
  id: 'fwc-placida-pier',
  label: 'Placida Rotary Centennial Park fishing pier — access and walkway warning',
  url: 'https://gis.myfwc.com/boating_guides/Charlotte_Harbor/pages/fishing_piers/Placida/index.html',
  publisher: 'FWC — Boating and Angling Guide to Charlotte Harbor',
  note: 'Facility survey dated September 2011.',
},
```

---

# 15. `boca-grande-pass` — Boca Grande Pass

**Confidence: high** on the regulations — which are the most valuable thing here
and are cleanly sourced from FWC. **Medium** on the hazards.

## The regulations are the story

This is the one spot in the guide with **gear rules specific to the place**, and
getting them in is worth more than any access note.

### `access_notes`

```ts
access_notes: [
  'Boat access only. The pass runs between Gasparilla Island and Cayo Costa; the nearest public launch is Placida Park on the mainland side of the causeway.',
  'FWC defines the Boca Grande Pass boundary by six named points, and the gear rules below apply inside it — not to Charlotte Harbor generally.',
  'Getting a vehicle onto Gasparilla Island costs a bridge toll, and parking on the island’s main roads is prohibited.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Boundary | myfwc.com …/tarpon/ | six points listed under "Map of Boca Grande Pass Boundaries": "Charlotte Harbor Channel LB6 (26 degrees, 42.299 minutes north; 82 degrees, 16.551 minutes west)", "Concrete Pier", "Phosphate Dock", "Intracoastal Waterway", "Flashing Green #75", "QR Test Buoy" |
| ⏱ Toll and parking | bocabeacon.com | "The island itself costs $6 to enter via the Gasparilla Island Bridge Authority"; "Parking is illegal on the main roads, Gasparilla Road and Gulf Boulevard." — **medium**, and see the flag below |

⏱ **A new Lee County parking ordinance passed 5 August 2025 and was not yet
being enforced** as of the Boca Beacon article: "It is not yet being enforced, as
there a complicated array of parking stickers, signage and rules to be sorted out
and implemented". **Do not publish the $6 toll figure or any parking rule without
re-checking.**

### `safety`

```ts
safety: [
  'Inside the pass, fishing with a weight that hangs lower than the hook is prohibited year-round, for any species. Prohibited jigs must be stowed and not readily accessible — natural bait is exempt.',
  'In April, May and June no vessel may deploy more than three lines at once, and breakaway gear may not be used, fished with or placed in the water.',
  'Tarpon is catch-and-release only. Anything over 40 inches stays in the water unless you are chasing a record with a tarpon tag. Snagging and snatch hooking are prohibited.',
  'Sharks work the pass around hooked tarpon. Stay in the boat.',
  'One of the deepest natural passes in Florida, with hard tide, shifting shoals and heavy boat traffic through the April-to-June peak — the same months the extra gear restrictions apply.',
],
```

| Claim | Source | What it said |
|---|---|---|
| Weighted-jig ban | myfwc.com …/tarpon/ | "Fishing with gear that has a weight attached to a hook, artificial fly or lure in such a way that the weight hangs lower than the hook when the line or leader is suspended vertically from the rod is prohibited when fishing for any species year-round within Boca Grande Pass." |
| Stowage, bait exemption | same | prohibited jigs must be stored "not readily accessible"; equipment "must be stowed" and cannot be attached to any rod or line; natural bait is exempt |
| Apr–Jun rules | same, and …/tarpon/faqs/ | "no more than three fishing lines may be deployed from a vessel at any one time"; "no person shall use, fish with, or place in the water any breakaway gear" |
| Tarpon C&R, 40in, tag | same | "Tarpon is a catch-and-release only fishery."; "Tarpon over 40 inches MUST remain in the water unless in pursuit of a state or world record using a tarpon tag." |
| Snagging | same, and FAQs | "Snagging, snatch hooking, spearing and the use of a multiple hook in conjunction with live or dead natural bait is prohibited"; "Snagging is defined as catching or attempting to catch tarpon that have not been attracted or enticed to strike an angler's gear." |
| Sharks | visitflorida.com | "Sharks are very prevalent around these fish," and anglers should "stay in the boat." — **medium** |
| Depth | visitflorida.com | "Its Lighthouse Hole reaches depths of 80 feet."; "one of Florida's deepest natural passes" — **medium** |
| Peak season / traffic | visitflorida.com | "Peak tarpon season begins in March and extends into late summer"; "It is a popular fish, and a lot of people are targeting it." — **medium** |

⚠️ **FWC does not publish a plain-language definition of "breakaway gear"** on
either the regulations page or the FAQ. The FAQ refers questions to the Division
of Marine Fisheries Management (850-487-0554). The underlying rule, 68B-32.006,
could not be retrieved from flrules.org. **Quote FWC's prohibition wording
verbatim and link the page; do not paraphrase what breakaway gear is.**

⚠️ The "up to 5 knots" tidal-current figure that circulates for this pass traces
to a marine-services blog, not an official source. **Not used.**

### `sources`

```ts
{
  id: 'fwc-tarpon',
  label: 'Tarpon regulations, including the Boca Grande Pass gear rules and boundary',
  url: 'https://myfwc.com/fishing/saltwater/recreational/tarpon/',
  publisher: 'Florida Fish and Wildlife Conservation Commission',
  note: 'Verify before treating as legal guidance. Weighted-jig ban is year-round; the three-line limit and breakaway-gear ban apply April–June.',
},
{
  id: 'fwc-tarpon-faqs',
  label: 'Tarpon regulation FAQs — snagging, breakaway gear, seasonal rules',
  url: 'https://myfwc.com/fishing/saltwater/recreational/tarpon/faqs/',
  publisher: 'Florida Fish and Wildlife Conservation Commission',
},
```

---

# Summary table

| Slug | `access_notes` | `safety` | Overall | ⏱ |
|---|---|---|---|---|
| `emerson-point` | high | medium | **high** | **fishing dock closed until further notice**; nature centre closed |
| `palma-sola-bay` | high / medium | medium | **high** | FWC data from 2010; three different published hours |
| `green-bridge` | medium-high | low-medium | **medium** | **wrong coordinates**; repairs done May 2026; replacement in planning |
| `bradenton-riverwalk` | high | INSUFFICIENT | **high** | free parking "until further notice" |
| `bridge-street-pier` | high | high (thin) | **high** | repairs to 30 Sep; bait shop unconfirmed; licence unconfirmed |
| `longboat-pass` | high | high (one line) | **medium** | catwalk unknown; PD&E study concluding |
| `coquina-beach` | high | high | **high** | renourishment Nov 2026–Apr 2027; lot partly restored |
| `bean-point` | high (rules only) | high (one line) | **medium** | parking study, possible paid parking Mar 2027 |
| `cortez-bridge` | high | high | **high** | **construction started this month** |
| `south-palma-sola-flats` | high | INSUFFICIENT | **medium** | no ramp or kayak launch at either preserve |
| `stump-pass` | medium | medium | **medium** | state park site blocked; new Milton pass; temp restrooms |
| `englewood-beach` | high | hedged | **high** | pier status; shuttle |
| `lemon-bay-mangroves` | medium | INSUFFICIENT | **medium** | **Lemon Bay Park last reported closed**; Ainger piers closed |
| `placida-gasparilla-sound` | high / medium | medium | **high** | ramp expansion Feb 2027; pier status |
| `boca-grande-pass` | medium | high (regs) | **high** | Lee County parking ordinance |

Counts: **8 high**, **7 medium**, **0 wholly `INSUFFICIENT SOURCES`**.
`safety` is `INSUFFICIENT SOURCES` at three spots: `bradenton-riverwalk`,
`south-palma-sola-flats`, `lemon-bay-mangroves`.

---

# NEEDS URGENT REVIEW

Anything below suggests a spot is currently closed, unsafe, or about to change
under a reader's feet. **None of these should go live without a same-week
re-check.**

### 1. `emerson-point` — the fishing dock is closed, right now

Manatee County's own page, modified 20 August 2026, carries a live alert:

> "Emerson Point Preserve Dock closed until further notice / Due to hurricane
> damage, the Emerson Point Preserve Dock will remain closed until further
> notice."

This is the most actionable warning in the set: an official, current, dated
closure of the named fishing structure at a spot the guide lists. The same page
also still carries a stale "Fishing Dock Hours" block — do not be misled by it.

### 2. `cortez-bridge` — construction started this month

FDOT's replacement project entered construction in **September 2026**, a
1,200-day job, with barges and temporary trestles working in the channel either
side of the span and the existing 1956 drawbridge scheduled for demolition from
mid-2028. The bridge stays open to traffic and pedestrians for now.

**FDOT publishes nothing about fishing access.** The guide types this spot
`access: ['shore', 'bridge']` and describes fishing the pilings and the dock
line. That description may be wrong for the next three years. **Consider whether
the spot should carry a standing warning rather than a normal access note.**

### 3. `lemon-bay-mangroves` — a park last reported closed

Lemon Bay Park and Environmental Center — the named launch for the north end of
this water — was reported **still closed from Hurricane Helene damage as of March
2025**. Sarasota County's own pages returned HTTP 403 and could not be checked.
**2026 status is unknown.** Highest risk in the set of sending someone to a
locked gate. Call Sarasota County Parks, 941-861-7275.

Separately, Charlotte County states plainly: **"The fishing piers at Ainger Creek
Park are closed."**

### 4. `green-bridge` — open now, but on borrowed time, and mapped to the wrong bank

Good news first: **Manatee County announced on 21 May 2026 that the rail repairs
were complete**, and no closure notice appears on the City of Palmetto's feed. It
appears open.

Two problems remain:

- **The coordinates in `locations.ts` point at the wrong bank of the river.** Fix
  before publishing any access note.
- The county is costing demolition (>$7M) and replacement ($10–17M) for this
  1920s structure. The much-quoted "unsafe in its current condition" line comes
  from a page that **self-declares as AI-generated meeting summary** — it is not
  publishable as a county statement without independent confirmation.

Also: the City of Palmetto **rents the pier out** at $200 a day for tournaments
and festivals, so it can be closed to casual anglers with no notice.

### 5. `coquina-beach` — segment closures from November 2026

Manatee County has approved $6.18 million of TDT funding for beach renourishment:
**"Construction is currently scheduled for November 2026 through March/April
2027,"** covering "shoreline areas at Cortez Beach and Coquina Beach". Expect
dredge pipe, heavy equipment and rolling closures across the whole coming winter
season. The county article does not itself spell out segment closures — that
framing is secondary — but the works window is official.

Also unresolved: the parking lot was only **partially** reopened after Helene and
Milton (~120 spaces plus ADA, north of the bus loop, as of January 2025), and no
later official confirmation of full restoration was found.

### 6. `stump-pass` — the beach itself has changed shape

**Hurricane Milton cut a new pass through the peninsula along the nature trail.**
The former 1.3-mile walk to the tip no longer exists as one continuous beach. Any
content describing that walk is now wrong. The park reopened 19 September 2025,
but the permanent restroom pavilion is still out, parking is cut to roughly 30–50
spaces, and the pay station has been replaced by online payment. **No official
state-parks source could be reached** — every claim rests on news and hiking
sites.

### 7. Charlotte County fishing piers, generally

Charlotte County's own fishing page lists **only Centennial Fishing Pier as
open**, and notes multiple piers were hurricane-damaged with 12–24 months of
permitting before repairs even begin. This touches `englewood-beach`,
`lemon-bay-mangroves` and `placida-gasparilla-sound`. **Do not publish a note
promising pier access at any of them without checking that pier by name.**

### 8. Three live fee/parking policies that could invalidate published notes

- **Anna Maria** (`bean-point`): a parking study proposing 1,119 paid spaces at a
  suggested $4.50/hr, launch proposed for March. **Nothing adopted**; public
  meeting was 31 August 2026.
- **Gasparilla Island** (`boca-grande-pass`): a Lee County parking ordinance
  passed 5 August 2025 and **not yet being enforced** as of the source article.
  Enforcement status in 2026 unknown.
- **Bradenton** (`bradenton-riverwalk`): the City Centre garage is free "until
  further notice" — the city's own wording flags the change.

### 9. `bridge-street-pier` — repair work possibly still fenced

Hurricane repairs to decking, pilings, handrails and the floating docks were
extended to **30 September** to allow completion. Sections may be barricaded.

---

# What could not be sourced at all

Recorded so the next pass does not repeat the work:

- **Stump Pass** official hours, fee and current status —
  `floridastateparks.org` returns HTTP 403.
- **Lemon Bay Park** current status — `scgov.net` and `sarasotacountyparks.com`
  return HTTP 403.
- **Longboat Pass Bridge catwalk** — existence, condition, whether fishing is
  permitted. Nothing in FDOT, FWC or county sources.
- **Whether Bridge Street Pier holds an FWC saltwater pier licence.** It is not
  in the FWC boating guide's pier list, so there is no `Fishing License Provided`
  field to check. (Green Bridge and Palma Sola both record **No**.)
- **"Breakaway gear"** — no plain-language FWC definition; rule 68B-32.006 could
  not be retrieved from flrules.org.
- **Bean Point** official access points, parking locations and beach hours — the
  City of Anna Maria publishes nothing under that name.
- **Restrooms, ADA detail and any kayak launch on the Riverwalk itself** — the
  county's Riverwalk Pier page publishes none of it, and the city's own Riverwalk
  "features and FAQ" link is broken in the page source.
- **Water hazards generally.** Pass hazards at `longboat-pass`; wading hazards at
  `south-palma-sola-flats` and `palma-sola-bay`; oyster bars in Lemon Bay and
  Gasparilla Sound; current and boat traffic in the Manatee River at
  `green-bridge` and `bradenton-riverwalk`. **No official source describes the
  water at any of them.** This, not access, is the real remaining gap.
