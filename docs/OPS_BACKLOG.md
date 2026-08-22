# Ops backlog

Work queue for the `ops-lead` agent, highest value first. Take one, finish it,
log it in `OPS_LOG.md`. Everything here is scoped from real findings — nothing
is speculative.

## 1. Widen the tide forecast window  ·  one line  ·  unblocks everything below

`supabase/functions/refresh-conditions/index.ts` requests
`begin_date=stationDate(1)&range=96`. Two of those four days are spent on the
past, so forward coverage is only ~40 hours. Verified live: data ran
2026-08-20 → 2026-08-23 with "now" at 2026-08-22.

Raise `range` (CO-OPS allows far longer for predictions) to get 5–7 days
forward. Nothing else changes; the payload is already stored whole.

**Why first:** you cannot plan Saturday from Thursday on 40 hours, and every
"when to fish" feature depends on it.

## 2. Per-spot 7-day weather  ·  ~half a day

The full NWS gridpoint forecast is **already fetched, already stored, already
arriving in the browser** — 14 periods running 7 days, with `windSpeed`,
`windDirection`, `probabilityOfPrecipitation`, `temperature`,
`temperatureTrend`, `isDaytime`. `parseNwsForecast()` in `src/lib/conditions.ts`
picks one of the fourteen and drops the rest.

Generalize to `parseNwsPeriods()`, add an **additive** field to
`ConditionsSnapshot` (the contract explicitly permits additive fields), render
a forecast strip on location pages. No new requests, no added cost.

## 3. "When to fish" window scoring  ·  2–4 days  ·  the real prize

`src/lib/nearby.ts` already scores spots, is tested, and assumes `now`.
Refactor it to take a `when`; generate candidate windows (each tide turn ±2h
across the forecast, intersected with each spot's researched `dayparts`); score
with the existing terms plus wind speed and precipitation.

Target output: *"Longboat Pass — Saturday 6:10–9:10am. Outgoing through dawn ·
wind SE 7 · 10% rain."*

**Constraint:** score wind *speed* and precip only. Wind *direction* is often
the whole story locally, but no spot has an orientation or shelter field —
inventing one breaks the content rule. It needs research, not code.

## 4. Research `seasons` and `dayparts`  ·  research, not code  ·  the long pole

`seasons` exists for 10 of 25 spots, `dayparts` for 13 of 25. Both feed the
ranking, and a spot with neither can never rank on anything but distance and
tide. Needs sourced research per spot, with `SourceRef`s attached. **Do not
fill these from general knowledge.**

## 5. Research the shop directory  ·  research, not code

`src/data/shops.ts` ships empty by design. Populating it needs a checkable
source per business. It is also the entire basis of the sponsorship revenue
layer (`src/lib/sponsorship.ts`), so it gates monetization.

## 6. Fix the location-page hero  ·  ~2 hours

`.lochero` (`location.css`) and `.plate-hero` (`base.css`) are still a 45°
hatch over a blue gradient — the exact treatment the owner rejected on Home.
It is the offline fallback and the empty-photo-plate treatment everywhere. A
small `HeroChart` variant would fix both.

## 7. Two lime lines in the home hero  ·  30 minutes  ·  needs owner's eye

The hero's stated rule is "lime marks exactly one thing: the current
waterline." There are two lime lines — the contour and the shoreline crest —
and the waterline's glow reads neon rather than chart hairline. Ask before
changing; it is a taste call.

## 8. Dedupe `useConditions`  ·  ~1 hour

Home fires four identical request pairs. `useConditions` has no cache, so the
seed / pick / nearest reads each fetch independently even when two resolve to
the same slug. A module-level promise cache keyed by slug fixes it. Harmless
now; worth doing before forecast payloads get bigger.

## 9. Apply the sponsorships migration

`supabase/migrations/20260822120000_sponsorships.sql` is written and committed
but **not applied**. Needs the owner (it touches the live project).

## 10. Capture the browser setup as a project skill

Playwright works here via `apt-get download` + `dpkg -x` into a local sysroot
(no root needed) at `/home/johnd/.claude-browser/`. `/run-skill-generator`
would freeze that so nobody rediscovers it.
