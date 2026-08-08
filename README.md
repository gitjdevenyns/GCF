# Gulf Coast Fishing Guide v4 — Complete Repository

Major changes:
- Real reference photos for the top target species
- Visual "read the water" field guide
- 15 curated Bradenton → Boca Grande fishing locations
- Street + satellite map layers
- Location cards with structure, species, tide and tactics
- Dangerous / handle-with-care species section
- FWC-based stingray, lionfish and shark handling guidance
- Light/dark mode
- PWA manifest/service worker
- Apple Maps links

## Deploy
Upload the contents of this folder to the root of the GitHub repository, commit, and GitHub Pages will redeploy automatically.

## Important
Regulations and access status change. Verify FWC regulations and local closures before fishing/harvesting.

## v3 safety update
- Added tap-to-reveal "DON'T LET THIS BE YOU" panels in the Handle With Care section.
- Uses documented real injury photographs alongside the dangerous species.
- Injury photographs remain hosted by the original publishers and include source links.
- Stingray example: Wilderness & Environmental Medicine retained-barb case.
- Lionfish examples: documented severe envenomation and treatment case.
- Bumped PWA cache version so existing installed copies will refresh.

Graphic injury images are hidden by default and require a tap to reveal.

## v4 graphic-safety update
- Removed tap-to-reveal behavior from documented injury photographs.
- Graphic injury photographs now display automatically for all users who open the Handle With Care section.
- Added a prominent graphic-content warning at the top of the section.
- Injury images are loaded eagerly so they appear with the dangerous-species cards.
- Bumped the PWA cache to gcf-v4 so installed devices refresh the new behavior.


## Complete repository package
This archive is self-contained and includes every file needed for the current GitHub Pages/PWA build, including the `assets/` directory, app icons, and source artwork. You can replace the contents of your existing repository with the contents of this archive.
