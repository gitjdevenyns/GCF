---
platform: instagram
status: draft
created: 2026-08-22
posted_url: null
screenshot: marketing/assets/2026-08-22-cortez-bridge-430x932-dark.png
screenshot_source: |
  Real screen, live production site, not a mockup. Reproduce with:
  cd /home/johnd/.claude-browser && source env.sh && \
    node shot.mjs https://gitjdevenyns.github.io/GCF/locations/cortez-bridge \
    <out.png> 430 932 dark
  Captured 2026-08-22 ~02:07 local. The tide state visible in the frame
  ("TIDE IS INCOMING", "Next high at 7:16 am station time, about 1.8 ft now",
  "updated 3 min ago") is what the app actually showed at that moment.
claims:
  - "Cortez Bridge is a Bradenton spot with walk-in shore and bridge access"
  - "its structures are bridge and docks"
  - "the app read the tide as incoming from NOAA Cortez 8726217 and said so on screen"
  - "on an incoming tide the page says: 'Fish the up-current face, seam and any bait pushed through structure.'"
  - "the outgoing tide is this spot's prime window"
  - "the snook recipe there is live bait, 3/0–5/0, 40–50 lb leader, 0–1 oz, pinfish"
  - "the sheepshead recipe there is a bottom rig, 1/0 short shank, 25 lb fluoro, 1/2–1 oz, fiddler crab/live shrimp"
  - "tide heights and times are NOAA predictions, not observations"
  - "the satellite imagery is Esri World Imagery, credited on screen"
sources:
  - src/data/locations.ts        # cortez-bridge: region 'Bradenton', access ['shore','bridge'], structures ['bridge','docks'], tide_playbook.best_window 'Moving tide', prime_stages ['outgoing'], tide_playbook.incoming string quoted verbatim, station NOAA Cortez 8726217, Snook and Sheepshead TargetRecipe rows quoted field for field
  - marketing/assets/2026-08-22-cortez-bridge-430x932-dark.png  # the frame itself; every on-screen string above is legible in it
  - src/pages/Tides.tsx          # "Predicted heights are astronomical — wind and pressure routinely move the real water level, so trust what you can see over what you read."
  - README.md                    # Esri satellite layer; "any caller using it must credit the tile source in its own visible caption"
notes:
  - "Spot chosen deliberately. The first frame I shot was Skyway Pier North and
     its live tide card read 'updated unknown' on the production site — see the
     production-data note below. Cortez Bridge is on NOAA Cortez 8726217, which
     does have live snapshots, so this frame shows the feature actually working."
  - "PRODUCTION DATA GAP, for the owner, not for the caption: public.tide_latest
     currently holds rows for only the 9 original stations (8725577, 8725667,
     8725747, 8726217, 8726233, 8726247, 8726249, 8726273, 8726282). The 6
     stations added with the Tampa Bay / Sarasota expansion — 8726034, 8726089,
     8726347, 8726364, 8726428, 8726520 — have no rows, so all 10 of the newer
     spots (St. Pete Pier, Skyway North, the two Fort De Soto piers, Egmont Key,
     Weedon Island, Pass-a-Grille, Bunces Pass, New Pass, South Lido) render
     'updated unknown'. Until that is fixed, do not screenshot a live tide card
     on any of those ten."
  - "No hashtag wall. Five, all descriptive of the place and the access type."
  - "Alt text is filled in below the caption — Instagram supports it and a
     fishing audience includes people reading this one-handed in bright sun."
---

**Caption**

Cortez Bridge, Bradenton. Walk-in shore and bridge access, and the two things
worth knowing are right there under the name: bridge, docks.

The app read the stage from NOAA Cortez 8726217 while this was open — incoming,
next high 7:16 am station time, about 1.8 ft at that moment — and answered the
only question that matters when you have already parked:

"Fish the up-current face, seam and any bait pushed through structure."

The outgoing is this spot's prime window, and the page says that too rather
than making you guess which half of the cycle it meant.

Scroll the same page and the snook line reads: live bait, 3/0–5/0, 40–50 lb
leader, 0–1 oz, pinfish. Sheepshead: bottom rig, 1/0 short shank, 25 lb fluoro,
1/2–1 oz, fiddler crab or live shrimp. Five species at this bridge, each with
its own numbers, because "bring shrimp" is not a plan.

Two honest notes. Tide heights and times are NOAA *predictions* — astronomical,
so wind and pressure routinely move the real water, and you should trust what
you can see over what you read. And the aerial is live Esri World Imagery of
the actual coordinates, credited in the corner, because there is no photograph
of this spot we can prove is this spot.

Link in bio.

#cortezbridge #bradentonfishing #annamariaisland #shorefishing #floridafishing

---

**Alt text (paste into Instagram's alt-text field)**

Phone screenshot of the Gulf Coast Fishing Guide, dark theme, showing the Cortez
Bridge page. A satellite aerial of the bridge and marina is captioned "esri
world imagery · satellite". Below it, a lime "Prime: outgoing" chip, a "walk-in
shore · bridge" chip, the heading "Cortez Bridge" and the line "Bradenton ·
27.4669, −82.6883 · bridge · docks". A lime-outlined card headed "RIGHT NOW ·
TIDE IS INCOMING" reads "Fish the up-current face, seam and any bait pushed
through structure." and "Next high at 7:16 am station time, about 1.8 ft now.
Start on 1 bridge pilings and 2 dock line." with buttons for "Open in Maps" and
"Tide chart", and a footer line "Cortez, Sarasota Bay · updated 3 min ago".
