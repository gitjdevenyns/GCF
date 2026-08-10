-- GCF seed data, migrated faithfully from the v6 static app (data.js / supplement.js).
-- Idempotent: safe to re-run (upserts keyed on primary keys / unique constraints).
-- Tide-station mapping researched against the NOAA CO-OPS station listing
-- (https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions).


-- NOAA CO-OPS tide prediction stations mapped to GCF locations.

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726247', 'Bradenton, Manatee River', 27.5, -82.5733, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726247', 'Subordinate prediction station (offsets from St. Petersburg 8726520). High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726282', 'Anna Maria Key, City Pier', 27.5333, -82.73, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726282', 'Subordinate prediction station (offsets from St. Petersburg 8726520). High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726273', 'Desoto Point, Manatee River', 27.5233, -82.65, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726273', 'Subordinate prediction station near the Manatee River mouth. High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726249', 'Palma Sola Bay (North)', 27.5033, -82.6483, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726249', 'Subordinate prediction station inside Palma Sola Bay. High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726233', 'Palma Sola Bay (South)', 27.485, -82.645, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726233', 'Subordinate prediction station inside Palma Sola Bay. High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8726217', 'Cortez, Sarasota Bay', 27.4667, -82.6867, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8726217', 'Subordinate prediction station on the bay side at Cortez. High/low predictions only. Gulf beaches and Longboat Pass will lead this inside-bay station.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8725747', 'Englewood, Lemon Bay', 26.9333, -82.3533, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725747', 'Subordinate prediction station inside Lemon Bay. High/low predictions only. Stump Pass and the Gulf beach will lead this inside-bay station.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8725667', 'Placida, Gasparilla Sound', 26.8333, -82.265, 'subordinate', '8726520', 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725667', 'Subordinate prediction station in Gasparilla Sound. High/low predictions only.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;

insert into public.tide_stations (id, name, lat, lng, station_type, reference_station_id, url, notes)
values ('8725577', 'Port Boca Grande, Charlotte Harbor', 26.72, -82.2583, 'reference', null, 'https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8725577', 'Harmonic reference station at the Boca Grande lighthouse; full-interval predictions available.')
on conflict (id) do update set name = excluded.name, lat = excluded.lat, lng = excluded.lng,
  station_type = excluded.station_type, reference_station_id = excluded.reference_station_id,
  url = excluded.url, notes = excluded.notes;


-- Fish species pages (handling guidance merged from supplement HANDLING).

insert into public.fish (id, name, images, habitat, gear, leader, hook, bait, handling_dos, handling_donts, angler_safety)
values ('snook', 'Common Snook', array['https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Centropomus-undecimalis-01.jpg', 'https://www.anglersbooking.com/blog/articles/boca-grande-fishing/images/underwater-snook-fish.webp'], 'Mangroves, beaches, passes, docks, bridge shadow lines', '7–7''6 MH • 4000–5000 • 20–30 lb braid', '30–40 lb fluoro; 40–60 at pilings', '2/0–5/0 inline circle', 'Pilchard, pinfish, mullet, shrimp; paddletail/jerk shad', array['Leave it in the water while dehooking when possible', 'Wet hands before touching', 'Support horizontally for a quick photo', 'Use adequate tackle so the fight is not prolonged'], array['Do not grab the gill plate—FWC warns the gill covers are razor sharp', 'Do not put fingers in gills or eyes', 'Do not drag large fish onto dry sand or deck'], 'Razor-sharp gill covers. Control the head and keep fingers behind/away from the gill plate.')
on conflict (id) do update set name = excluded.name, images = excluded.images, habitat = excluded.habitat,
  gear = excluded.gear, leader = excluded.leader, hook = excluded.hook, bait = excluded.bait,
  handling_dos = excluded.handling_dos, handling_donts = excluded.handling_donts, angler_safety = excluded.angler_safety;

insert into public.fish (id, name, images, habitat, gear, leader, hook, bait, handling_dos, handling_donts, angler_safety)
values ('redfish', 'Redfish / Red Drum', array['https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Sciaenops-ocellatus-01.jpg', 'https://fishingweather.app/_next/image?url=%2Fblog%2Fgulf-coast-redfish-guide%2Fredfish-flats.jpg&w=1200&q=75'], 'Oyster edges, grass, potholes, drains', '7–7''6 M • 3000–4000 • 15–20 lb braid', '20–30 lb fluoro', '1/0–3/0 circle or 3/0–4/0 weedless', 'Shrimp, pinfish, cut mullet; gold spoon/paddletail', array['Wet hands', 'Use a knotless rubber net', 'Support belly and tail horizontally', 'Release head-first'], array['Do not hang vertically by the jaw', 'Do not scrape across oyster shell or dry surfaces', 'Do not squeeze the abdomen'], 'Generally manageable, but dorsal fin rays/spines and hooks are the main handling hazards.')
on conflict (id) do update set name = excluded.name, images = excluded.images, habitat = excluded.habitat,
  gear = excluded.gear, leader = excluded.leader, hook = excluded.hook, bait = excluded.bait,
  handling_dos = excluded.handling_dos, handling_donts = excluded.handling_donts, angler_safety = excluded.angler_safety;

insert into public.fish (id, name, images, habitat, gear, leader, hook, bait, handling_dos, handling_donts, angler_safety)
values ('trout', 'Spotted Seatrout', array['https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Cynoscion-nebulosus-01.jpg', 'https://www.louisianasportsman.com/wp-content/uploads/2023/08/Eel-Grass-pic2.jpg'], 'Grass flats, sandy potholes, channel edges', '7–7''6 M • 2500–3000 • 10–15 lb braid', '15–20 lb fluoro', '1/0–2/0 circle or 1/8–1/4 oz jig', 'Live shrimp under cork; 3–4 in paddletail', array['Keep handling exceptionally brief', 'Use wet hands and rubber net', 'Support horizontally', 'Dehook in water when possible'], array['Do not squeeze—trout are delicate', 'Do not lift by leader', 'Keep fingers away from mouth'], 'Large canine teeth at the front of the upper jaw; dorsal spines can also prick hands.')
on conflict (id) do update set name = excluded.name, images = excluded.images, habitat = excluded.habitat,
  gear = excluded.gear, leader = excluded.leader, hook = excluded.hook, bait = excluded.bait,
  handling_dos = excluded.handling_dos, handling_donts = excluded.handling_donts, angler_safety = excluded.angler_safety;

insert into public.fish (id, name, images, habitat, gear, leader, hook, bait, handling_dos, handling_donts, angler_safety)
values ('tarpon', 'Tarpon', array['https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Megalops-atlanticus-01.jpg', 'https://www.saltyjawcharters.com/uploads/9/2/6/0/92607848/img-4612_orig.jpeg'], 'Passes, beaches, bridges, harbor mouths', '7''6–8 H • 6000–8000 • 40–50 lb braid', '60–80 lb leader', '5/0–8/0 strong inline circle', 'Pass crab, threadfin, pilchard, mullet', array['For fish over 40 inches, keep it in the water', 'Use a long dehooker or cut leader close', 'Keep gills submerged', 'Use tackle heavy enough to shorten the fight'], array['Do not boat or drag large tarpon over a gunwale', 'Do not hold by gills/eyes', 'Do not prolong photos'], 'Large fish can thrash violently; mouth is abrasive and hooks are a major hazard. Control from alongside the boat.')
on conflict (id) do update set name = excluded.name, images = excluded.images, habitat = excluded.habitat,
  gear = excluded.gear, leader = excluded.leader, hook = excluded.hook, bait = excluded.bait,
  handling_dos = excluded.handling_dos, handling_donts = excluded.handling_donts, angler_safety = excluded.angler_safety;

insert into public.fish (id, name, images, habitat, gear, leader, hook, bait, handling_dos, handling_donts, angler_safety)
values ('snapper', 'Mangrove / Gray Snapper', array['https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Lutjanus-griseus-01.jpg', 'https://www.anglersbooking.com/blog/articles/tampa-bay-fishing/images/mangrove-snapper-group-mangrove-roots-florida.webp'], 'Mangroves, docks, bridge pilings, rock', '7 M • 3000–4000 • 15–20 lb braid', '20–30 lb fluoro', '1/0–2/0 circle', 'Shrimp, pilchard, pinfish, cut bait', array['Wet hands', 'Use rubber net', 'Support body', 'Use pliers for hook removal'], array['Do not put fingers in mouth', 'Do not hold only by jaw for extended periods', 'Do not let it flop on hot/dry deck'], 'Two prominent canine teeth; dorsal spines can prick. Use pliers and keep fingers clear of mouth.')
on conflict (id) do update set name = excluded.name, images = excluded.images, habitat = excluded.habitat,
  gear = excluded.gear, leader = excluded.leader, hook = excluded.hook, bait = excluded.bait,
  handling_dos = excluded.handling_dos, handling_donts = excluded.handling_donts, angler_safety = excluded.angler_safety;


-- Handle-with-care hazards (CREATURES cards + condensed DANGER text + injury media).

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('marine-catfish', 'Hardhead / Gafftopsail Catfish', 'https://www.floridamuseum.ufl.edu/wp-content/uploads/sites/66/2017/05/Ariopsis-felis-01.jpg', 'Sharp venom-associated dorsal and pectoral spines can cause a painful puncture.', 'Do not wrap your hand around the body behind the head. Keep clear of the dorsal and side spines; use long pliers/dehooker and cut the leader if needed.', 'Venomous dorsal/pectoral spines', 'Use long pliers/dehooker; never wrap a hand around the fish.', '[]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('stingray', 'Southern / Atlantic Stingray', 'https://lirp.cdn-website.com/b44e0cd2/dms3rep/multi/opt/stingrays-1920w.jpg', 'Defensive venomous spine near the base of the whip-like tail.', 'Keep the ray in the water when possible. Never grab the tail. Use a long dehooker; while wading use the stingray shuffle.', 'Venomous tail spine', 'Keep in water; use long dehooker; never grab tail.', '[{"image":"https://journals.sagepub.com/cms/10.1016/j.wem.2015.03.006/asset/6b61691f-3e98-4b0e-b209-21f72b7c5860/assets/images/large/10.1016_jwem201503006-fig1.jpg","url":"https://journals.sagepub.com/doi/10.1016/j.wem.2015.03.006"}]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('lionfish', 'Lionfish', 'https://www.tallahasseemagazine.com/content/uploads/data-import/sh/shutterstock37472188ccsz.jpg', 'Venomous dorsal, pelvic and anal fin spines.', 'Never grab around the fins. Use tools and a puncture-resistant container if retaining one.', 'Venomous fin spines', 'Never grab around fins; use tools.', '[{"image":"https://divernet.com/wp-content/uploads/2022/12/IMG_6285-924x1024.jpg","url":"https://divernet.com/scuba-diving/ouch-lionfish-divers-a-world-of-pain/"}]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('barracuda', 'Great Barracuda', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Sphyraena_barracuda.jpg', 'Large, extremely sharp teeth; an agitated fish can slash during handling.', 'Keep hands completely away from the mouth. Use long pliers; control/release large fish alongside the boat.', 'Severe bite', 'Keep hands away from mouth; release large fish alongside.', '[]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('sharks', 'Sharks', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Carcharhinus_leucas_TPWD.jpg', 'Bite hazard plus species-identification and legal requirements.', 'Do not put hands near the mouth or gills. Keep prohibited/unknown sharks in the water and cut the leader close when that is the safest quick release.', 'Bite + legal ID risk', 'Keep unknown/prohibited sharks in water; cut leader if needed.', '[]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;

insert into public.hazards (id, name, image, risk, handle, risk_short, handle_short, injury_media)
values ('pufferfish', 'Southern Puffer / Pufferfish', 'https://inaturalist-open-data.s3.amazonaws.com/photos/45647957/large.jpg', 'Primary danger is toxin if eaten; puffer toxins can cause severe neurologic poisoning and cooking/cleaning does not reliably destroy the toxin.', 'Treat unfamiliar puffers as release-only. Use pliers/dehooker, avoid putting fingers near the beak-like mouth, and do not prepare one for food.', null, null, '[]'::jsonb)
on conflict (id) do update set name = excluded.name, image = excluded.image, risk = excluded.risk,
  handle = excluded.handle, risk_short = excluded.risk_short, handle_short = excluded.handle_short,
  injury_media = excluded.injury_media;


-- Habitat identification cards.

insert into public.habitats (id, name, diagram, photos, look, fish_summary, how_to_fish)
values ('oyster-bar', 'Oyster bar / reef', 'assets/habitats/oyster.svg', array['https://blog.wfsu.org/blog-coastal-health/wp-content/uploads/2010/09/IMG_3499-small-1170x878.jpg', 'https://www.enr.com/ext/resources/2023/07/13/GettyImages-1374052671_ENRready.webp?t=1689259571'], 'Raised rough shell ridge. At low tide it may be exposed; submerged bars often create ripples/current breaks.', 'Redfish • sheepshead • black drum • snapper', 'Cast along the edge, especially the down-current tip. Keep braid away from shell.')
on conflict (id) do update set name = excluded.name, diagram = excluded.diagram, photos = excluded.photos,
  look = excluded.look, fish_summary = excluded.fish_summary, how_to_fish = excluded.how_to_fish;

insert into public.habitats (id, name, diagram, photos, look, fish_summary, how_to_fish)
values ('grass-flat', 'Grass flat + potholes', 'assets/habitats/grass.svg', array['https://midcurrent.com/wp-content/uploads/2023/07/1.FEATURE-Fly-fishing-saltwater-flats-potholes-St.-Croix-web-e1689162317430.jpg', 'https://www.saltstrong.com/wp-content/uploads/spots-pic7.jpg'], 'Dark green/brown = grass. Pale circles/irregular patches = sand holes. Satellite view makes contrast obvious.', 'Trout • redfish • snook', 'Cast beyond the hole and retrieve across the light/dark boundary.')
on conflict (id) do update set name = excluded.name, diagram = excluded.diagram, photos = excluded.photos,
  look = excluded.look, fish_summary = excluded.fish_summary, how_to_fish = excluded.how_to_fish;

insert into public.habitats (id, name, diagram, photos, look, fish_summary, how_to_fish)
values ('mangrove-point', 'Mangrove point', 'assets/habitats/mangrove.svg', array['https://content.osgnetworks.tv/photopacks/fs-inshore-points_522113/522115_fs-inshorepoints-03_hero_1200x800.jpg', 'https://content.osgnetworks.tv/photopacks/fs-inshore-points_522113/522116_fs-inshorepoints-04_hero_1200x800.jpg'], 'A shoreline corner protruding into moving water. Best points often have exposed roots, bait and nearby depth.', 'Snook • redfish • snapper', 'Incoming: cast near flooded roots. Outgoing: fish the tip and drains.')
on conflict (id) do update set name = excluded.name, diagram = excluded.diagram, photos = excluded.photos,
  look = excluded.look, fish_summary = excluded.fish_summary, how_to_fish = excluded.how_to_fish;

insert into public.habitats (id, name, diagram, photos, look, fish_summary, how_to_fish)
values ('pass-inlet', 'Pass / inlet', 'assets/habitats/pass.svg', array['https://smifclub.com/wp-content/uploads/2023/06/image-13.png', 'https://www.halfhitch.com/images/Default/images/Fishing-the-Flats-tip/Fishing-the-Flats-13.jpg'], 'Narrow Gulf/bay opening with rips, foam lines, sandbar tips, color changes and eddies.', 'Tarpon • snook • jacks • mackerel • snapper', 'Fish seams and edges rather than only the fastest water.')
on conflict (id) do update set name = excluded.name, diagram = excluded.diagram, photos = excluded.photos,
  look = excluded.look, fish_summary = excluded.fish_summary, how_to_fish = excluded.how_to_fish;

insert into public.habitats (id, name, diagram, photos, look, fish_summary, how_to_fish)
values ('bridge-piling', 'Bridge piling / shadow', 'assets/habitats/bridge.svg', array['https://www.sportfishingmag.com/wp-content/uploads/2021/09/bridge-fishing-live-bait-819x1024.jpg', 'https://www.sportfishingmag.com/wp-content/uploads/2021/09/bridge-fishing-tips.jpg'], 'Current splits around pilings; night lights create a sharp bright/dark edge.', 'Snook • snapper • sheepshead • drum • tarpon', 'Cast up-current so bait drifts naturally. At night work the shadow line.')
on conflict (id) do update set name = excluded.name, diagram = excluded.diagram, photos = excluded.photos,
  look = excluded.look, fish_summary = excluded.fish_summary, how_to_fish = excluded.how_to_fish;


-- Knot and rig tutorial references (VIDEOS).

insert into public.rigs (id, name, category, url)
values ('fg-knot', 'FG Knot — braid to leader', 'knot', 'https://www.youtube.com/watch?v=Xt2wB7H_9Zw')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;

insert into public.rigs (id, name, category, url)
values ('uni-knot', 'Uni Knot — terminal tackle', 'knot', 'https://www.youtube.com/watch?v=myMSMYy_iYU')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;

insert into public.rigs (id, name, category, url)
values ('non-slip-loop-knot', 'Non-Slip Loop Knot — lures', 'knot', 'https://www.youtube.com/watch?v=Us0wL8KS4ww')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;

insert into public.rigs (id, name, category, url)
values ('fish-finder-rig', 'Fish-Finder Rig — FWC', 'rig', 'https://www.youtube.com/watch?v=96xlLW2tu24')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;

insert into public.rigs (id, name, category, url)
values ('popping-cork-rig', 'Popping Cork Rig tutorials', 'rig', 'https://www.youtube.com/results?search_query=how+to+rig+popping+cork+saltwater+shrimp')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;

insert into public.rigs (id, name, category, url)
values ('knocker-rig', 'Knocker Rig tutorials', 'rig', 'https://www.youtube.com/results?search_query=how+to+tie+knocker+rig+mangrove+snapper')
on conflict (id) do update set name = excluded.name, category = excluded.category, url = excluded.url;


-- Fishing locations. tide_playbook.best_window preserves the original v6 tide/timing note.

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('emerson-point', 'Emerson Point / Snead Island', 'Bradenton', 27.5208, -82.644, 'shore kayak', array['grass', 'oyster', 'mangrove'], '8726273', '{}'::text[], '{"best_window":"Low incoming"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 1, 'weedless paddletail', '3/0–4/0', '20–25 lb', '1/16–1/8 oz', array['shrimp', 'paddletail']
from public.locations l where l.slug = 'emerson-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'trout', 'Trout', 2, 'popping cork', '1/0–2/0', '15–20 lb', 'light jig', array['live shrimp']
from public.locations l where l.slug = 'emerson-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 3, 'free-line', '2/0–4/0', '30–40 lb', 'none', array['pilchard', 'pinfish']
from public.locations l where l.slug = 'emerson-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('palma-sola-bay', 'Palma Sola Bay', 'Bradenton', 27.4962, -82.6684, 'shore wade', array['grass', 'potholes'], '8726249', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'trout', 'Trout', 1, 'popping cork', '1/0–2/0', '15–20 lb', 'light', array['shrimp']
from public.locations l where l.slug = 'palma-sola-bay'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 2, 'weedless paddletail', '3/0–4/0', '20–25 lb', '1/16–1/8 oz', array['paddletail']
from public.locations l where l.slug = 'palma-sola-bay'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 3, 'free-line', '2/0–4/0', '30–40 lb', 'none', array['pilchard']
from public.locations l where l.slug = 'palma-sola-bay'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('green-bridge', 'Green Bridge', 'Bradenton', 27.5003, -82.5705, 'shore pier', array['pilings', 'channel', 'lights'], '8726247', array['night'], '{"best_window":"Night moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait', '3/0–5/0', '40–60 lb', '0–1 oz', array['pinfish', 'pilchard']
from public.locations l where l.slug = 'green-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 2, 'knocker', '1/0–2/0', '20–30 lb', '1/4–1 oz', array['shrimp', 'pilchard']
from public.locations l where l.slug = 'green-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Sheepshead', 3, 'bottom rig', '1/0', '20–30 lb', '1/4–1 oz', array['shrimp', 'crab']
from public.locations l where l.slug = 'green-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('bradenton-riverwalk', 'Bradenton Riverwalk', 'Bradenton', 27.4989, -82.5688, 'shore', array['seawall', 'docks'], '8726247', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'free-line', '2/0–3/0', '30 lb', 'none', array['shrimp', 'pilchard']
from public.locations l where l.slug = 'bradenton-riverwalk'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 2, 'knocker', '1/0', '20–25 lb', '1/4–1/2 oz', array['shrimp']
from public.locations l where l.slug = 'bradenton-riverwalk'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Jack', 3, 'casting lure', 'single hook', '25–30 lb', 'lure', array['spoon', 'topwater']
from public.locations l where l.slug = 'bradenton-riverwalk'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('bridge-street-pier', 'Bridge Street / Bradenton Beach', 'Anna Maria', 27.4677, -82.698, 'pier shore', array['pilings', 'current'], '8726217', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait', '3/0–5/0', '40 lb', 'light', array['pilchard']
from public.locations l where l.slug = 'bridge-street-pier'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 2, 'knocker', '1/0–2/0', '20–30 lb', '1/2 oz', array['shrimp']
from public.locations l where l.slug = 'bridge-street-pier'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Mackerel', 3, 'casting spoon', 'single hook', '30–40 lb bite leader', '1/2–1 oz', array['spoon']
from public.locations l where l.slug = 'bridge-street-pier'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('longboat-pass', 'Longboat Pass', 'Anna Maria', 27.4414, -82.6916, 'shore boat', array['deep pass', 'bridge'], '8726217', '{}'::text[], '{"best_window":"Strong moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait drift', '4/0–5/0', '40–60 lb', '1/2–2 oz', array['pinfish']
from public.locations l where l.slug = 'longboat-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'tarpon', 'Tarpon', 2, 'live crab', '5/0–8/0', '60–80 lb', 'drift dependent', array['crab', 'threadfin']
from public.locations l where l.slug = 'longboat-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 3, 'knocker', '2/0', '30 lb', '1/2–1 oz', array['pilchard']
from public.locations l where l.slug = 'longboat-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('coquina-beach', 'Coquina Beach', 'Anna Maria', 27.4438, -82.691, 'shore', array['surf trough', 'pass edge'], '8726217', array['dawn', 'dusk'], '{"best_window":"Dawn/dusk"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'free-line/jig', '2/0–4/0', '30–40 lb', '0–3/8 oz', array['pilchard', 'paddletail']
from public.locations l where l.slug = 'coquina-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Pompano', 2, 'surf rig', '1/0', '15–20 lb', '1–3 oz pyramid', array['sand flea', 'shrimp']
from public.locations l where l.slug = 'coquina-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Mackerel', 3, 'spoon', 'single hook', '30–40 lb bite', 'lure', array['spoon']
from public.locations l where l.slug = 'coquina-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('bean-point', 'Bean Point', 'Anna Maria', 27.5387, -82.7443, 'shore', array['point', 'surf cuts'], '8726282', '{}'::text[], '{"best_window":"Moving water"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait', '3/0–5/0', '30–40 lb', 'light', array['pilchard']
from public.locations l where l.slug = 'bean-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'tarpon', 'Tarpon', 2, 'live crab', '5/0–8/0', '60–80 lb', 'none', array['crab']
from public.locations l where l.slug = 'bean-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Pompano', 3, 'surf rig', '1/0', '15–20 lb', '1–3 oz', array['sand flea']
from public.locations l where l.slug = 'bean-point'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('cortez-bridge', 'Cortez Bridge', 'Bradenton', 27.4669, -82.6883, 'shore bridge', array['bridge', 'docks'], '8726217', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait', '3/0–5/0', '40–50 lb', '0–1 oz', array['pinfish']
from public.locations l where l.slug = 'cortez-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 2, 'knocker', '1/0–2/0', '20–30 lb', '1/4–1 oz', array['shrimp']
from public.locations l where l.slug = 'cortez-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'trout', 'Trout', 3, 'jig', '1/8–1/4 oz jig', '15–20 lb', 'jig', array['paddletail']
from public.locations l where l.slug = 'cortez-bridge'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('south-palma-sola-flats', 'South Palma Sola Flats', 'Bradenton', 27.4798, -82.6758, 'kayak wade', array['grass', 'potholes'], '8726233', '{}'::text[], '{"best_window":"Low incoming"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'trout', 'Trout', 1, 'paddletail', '1/8–1/4 oz jig', '15–20 lb', 'jig', array['paddletail']
from public.locations l where l.slug = 'south-palma-sola-flats'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 2, 'weedless', '3/0–4/0', '20–25 lb', '1/16–1/8 oz', array['paddletail']
from public.locations l where l.slug = 'south-palma-sola-flats'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 3, 'jerk shad', '3/0–4/0', '25–30 lb', 'light', array['jerk shad']
from public.locations l where l.slug = 'south-palma-sola-flats'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('stump-pass', 'Stump Pass', 'Englewood', 26.9111, -82.3529, 'shore kayak', array['pass', 'surf', 'mangrove'], '8725747', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'live bait', '3/0–5/0', '30–40 lb', '0–1/2 oz', array['pilchard']
from public.locations l where l.slug = 'stump-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 2, 'shrimp/weedless', '1/0–3/0', '20–30 lb', 'light', array['shrimp']
from public.locations l where l.slug = 'stump-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'tarpon', 'Tarpon', 3, 'live bait', '5/0–8/0', '60–80 lb', 'drift', array['crab', 'threadfin']
from public.locations l where l.slug = 'stump-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('englewood-beach', 'Englewood Beach', 'Englewood', 26.9258, -82.3612, 'shore', array['surf trough', 'cuts'], '8725747', array['dawn', 'dusk'], '{"best_window":"Dawn/dusk"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 1, 'free-line', '2/0–4/0', '30–40 lb', 'none', array['pilchard']
from public.locations l where l.slug = 'englewood-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Pompano', 2, 'surf rig', '1/0', '15–20 lb', '1–3 oz', array['sand flea']
from public.locations l where l.slug = 'englewood-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Mackerel', 3, 'spoon', 'single hook', '30–40 lb bite', 'lure', array['spoon']
from public.locations l where l.slug = 'englewood-beach'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('lemon-bay-mangroves', 'Lemon Bay Mangroves', 'Englewood', 26.9562, -82.3328, 'kayak boat', array['points', 'grass', 'drains'], '8725747', '{}'::text[], '{"best_window":"High incoming/outgoing"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 1, 'weedless', '3/0–4/0', '20–25 lb', '1/16–1/8 oz', array['paddletail']
from public.locations l where l.slug = 'lemon-bay-mangroves'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 2, 'live bait', '2/0–4/0', '30–40 lb', 'light', array['pilchard']
from public.locations l where l.slug = 'lemon-bay-mangroves'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snapper', 'Snapper', 3, 'free-line', '1/0–2/0', '20–25 lb', 'none', array['shrimp']
from public.locations l where l.slug = 'lemon-bay-mangroves'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('placida-gasparilla-sound', 'Placida / Gasparilla Sound', 'Placida', 26.833, -82.2675, 'boat kayak', array['mangrove', 'flats', 'docks'], '8725667', '{}'::text[], '{"best_window":"Moving tide"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'redfish', 'Redfish', 1, 'weedless', '3/0–4/0', '20–30 lb', 'light', array['paddletail']
from public.locations l where l.slug = 'placida-gasparilla-sound'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 2, 'live bait', '3/0–5/0', '30–50 lb', 'none', array['pilchard']
from public.locations l where l.slug = 'placida-gasparilla-sound'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'trout', 'Trout', 3, 'popping cork', '1/0–2/0', '15–20 lb', 'light', array['shrimp']
from public.locations l where l.slug = 'placida-gasparilla-sound'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.locations (slug, name, region, lat, lng, access, structures, tide_station_id, dayparts, tide_playbook)
values ('boca-grande-pass', 'Boca Grande Pass', 'Boca Grande', 26.7208, -82.2694, 'boat', array['major pass', 'deep current'], '8725577', '{}'::text[], '{"best_window":"Seasonal / current"}'::jsonb)
on conflict (slug) do update set name = excluded.name, region = excluded.region, lat = excluded.lat,
  lng = excluded.lng, access = excluded.access, structures = excluded.structures,
  tide_station_id = excluded.tide_station_id, dayparts = excluded.dayparts, tide_playbook = excluded.tide_playbook;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'tarpon', 'Tarpon', 1, 'live crab drift', '5/0–8/0', '60–80 lb', 'depth dependent', array['crab', 'threadfin']
from public.locations l where l.slug = 'boca-grande-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, 'snook', 'Snook', 2, 'live bait', '4/0–5/0', '40–60 lb', '1/2–2 oz', array['pinfish']
from public.locations l where l.slug = 'boca-grande-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;

insert into public.location_targets (location_id, fish_id, species_label, priority, rig, hook, leader, weight, baits)
select l.id, null, 'Jack', 3, 'heavy lure', 'single hook', '40–60 lb', 'lure', array['plug', 'jig']
from public.locations l where l.slug = 'boca-grande-pass'
on conflict (location_id, species_label) do update set fish_id = excluded.fish_id, priority = excluded.priority,
  rig = excluded.rig, hook = excluded.hook, leader = excluded.leader, weight = excluded.weight, baits = excluded.baits;


-- Provenance: official sources referenced by the content above.

insert into public.sources (url, title, publisher, license, retrieved_at, subject)
values ('https://myfwc.com/fishing/saltwater/recreational/fish-handling/', 'Fish Handling', 'Florida Fish and Wildlife Conservation Commission', 'US state government publication; cite, do not imply endorsement', '2026-08-09', 'Saltwater fish handling and release guidance')
on conflict (url) do update set title = excluded.title, publisher = excluded.publisher,
  license = excluded.license, retrieved_at = excluded.retrieved_at, subject = excluded.subject;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'snook' from public.sources s where s.url = 'https://myfwc.com/fishing/saltwater/recreational/fish-handling/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'redfish' from public.sources s where s.url = 'https://myfwc.com/fishing/saltwater/recreational/fish-handling/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'trout' from public.sources s where s.url = 'https://myfwc.com/fishing/saltwater/recreational/fish-handling/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'tarpon' from public.sources s where s.url = 'https://myfwc.com/fishing/saltwater/recreational/fish-handling/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'snapper' from public.sources s where s.url = 'https://myfwc.com/fishing/saltwater/recreational/fish-handling/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.sources (url, title, publisher, license, retrieved_at, subject)
values ('https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/', 'Discover Fishes species profiles', 'Florida Museum of Natural History', 'unverified - educational site; image redistribution rights not confirmed', '2026-08-09', 'Species identification profiles and images')
on conflict (url) do update set title = excluded.title, publisher = excluded.publisher,
  license = excluded.license, retrieved_at = excluded.retrieved_at, subject = excluded.subject;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'snook' from public.sources s where s.url = 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'redfish' from public.sources s where s.url = 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'trout' from public.sources s where s.url = 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'tarpon' from public.sources s where s.url = 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'fish', 'snapper' from public.sources s where s.url = 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.sources (url, title, publisher, license, retrieved_at, subject)
values ('https://tidesandcurrents.noaa.gov/', 'NOAA Tides & Currents', 'NOAA CO-OPS', 'US Government work, public domain (17 USC 105)', '2026-08-09', 'Tide predictions and station metadata')
on conflict (url) do update set title = excluded.title, publisher = excluded.publisher,
  license = excluded.license, retrieved_at = excluded.retrieved_at, subject = excluded.subject;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726247' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726282' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726273' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726249' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726233' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8726217' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8725747' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8725667' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.source_links (source_id, content_table, content_id)
select s.id, 'tide_stations', '8725577' from public.sources s where s.url = 'https://tidesandcurrents.noaa.gov/'
on conflict (source_id, content_table, content_id) do nothing;

insert into public.sources (url, title, publisher, license, retrieved_at, subject)
values ('https://www.weather.gov/documentation/services-web-api', 'NWS API documentation', 'National Weather Service', 'US Government work, public domain; API requires User-Agent identification', '2026-08-09', 'Weather forecast API used for location conditions')
on conflict (url) do update set title = excluded.title, publisher = excluded.publisher,
  license = excluded.license, retrieved_at = excluded.retrieved_at, subject = excluded.subject;

insert into public.sources (url, title, publisher, license, retrieved_at, subject)
values ('https://api.tidesandcurrents.noaa.gov/api/prod/', 'CO-OPS Data Retrieval API', 'NOAA CO-OPS', 'US Government work, public domain; no key required', '2026-08-09', 'Tide prediction API used for station snapshots')
on conflict (url) do update set title = excluded.title, publisher = excluded.publisher,
  license = excluded.license, retrieved_at = excluded.retrieved_at, subject = excluded.subject;
