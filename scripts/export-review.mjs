/**
 * Turns accepted review decisions into a patch for the bundled guide data.
 *
 * Accepting an item in the console does not change the app: locations and
 * species are compiled into the bundle, so an accepted line is a queued edit.
 * This is the step that closes that gap — it prints, grouped by location, the
 * exact strings to paste into `src/data/locations.ts`, using the owner's
 * rewrite where there is one.
 *
 * It is deliberately a printout rather than an automatic rewrite of the data
 * files. These are researched claims about real places; the last look before
 * they ship should be a human one.
 *
 *   set -a && . ./.env.local && set +a && npm run review:export
 */
import ITEMS from '../src/admin/data/review-items.json' with { type: 'json' };

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
  process.exit(2);
}

const res = await fetch(`${url}/rest/v1/review_decisions?select=*`, { headers: { apikey: key } });
if (!res.ok) {
  console.error(`Could not read decisions: ${res.status}. Reading them requires an admin session — ` +
    `export from the console instead, or query with the service role.`);
  process.exit(1);
}
const decisions = new Map((await res.json()).map((d) => [d.item_id, d]));

const queued = ITEMS
  .map((i) => ({ item: i, d: decisions.get(i.id) }))
  .filter(({ d }) => d && (d.status === 'accepted' || d.status === 'rewritten') && !d.published_at);

if (queued.length === 0) {
  console.log('Nothing accepted and unpublished. Queue is clear.');
  process.exit(0);
}

const byTarget = new Map();
for (const q of queued) {
  if (!byTarget.has(q.item.target)) byTarget.set(q.item.target, []);
  byTarget.get(q.item.target).push(q);
}

console.log(`# ${queued.length} accepted item(s) ready to apply\n`);

const recheck = queued.filter(({ item }) => item.time_sensitive);
if (recheck.length) {
  console.log(`## ⏱ RE-CHECK BEFORE PUBLISHING — ${recheck.length} time-sensitive\n`);
  console.log('Hours, fees, construction and closures go stale. Confirm each against');
  console.log('its source again now, not when it was researched.\n');
  for (const { item } of recheck) {
    console.log(`  - ${item.target}: ${item.sources[0]?.url ?? '(no source)'}`);
  }
  console.log();
}

for (const [target, list] of [...byTarget].sort()) {
  console.log(`\n## ${target}`);
  const byKind = new Map();
  for (const q of list) {
    if (!byKind.has(q.item.kind)) byKind.set(q.item.kind, []);
    byKind.get(q.item.kind).push(q);
  }
  for (const [kind, qs] of byKind) {
    console.log(`\n    ${kind}: [`);
    for (const { item, d } of qs) {
      const text = (d.final_text?.trim() || item.proposed).replace(/'/g, "\\'");
      console.log(`      '${text}',`);
    }
    console.log('    ],');
  }
}

console.log(`\n\n# After applying and deploying, mark them published:`);
console.log(`#   update public.review_decisions set published_at = now()`);
console.log(`#   where item_id in (${queued.slice(0, 3).map((q) => `'${q.item.id}'`).join(', ')}${queued.length > 3 ? ', …' : ''});`);
