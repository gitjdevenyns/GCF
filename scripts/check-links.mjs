#!/usr/bin/env node
/**
 * External link health check.
 *
 * Deliberately NOT part of `npm test`: it hits the network, so it would make the
 * suite flaky and slow. Run it manually (`npm run check:links`) before a release
 * or when auditing content provenance.
 *
 * KNOWN_ISSUES.md #2 — many images are hotlinked from third-party hosts that may
 * block embedding, disappear, or change. This is how we find that out on purpose
 * instead of a user finding out in the field.
 *
 * Exit code is 1 if any URL is definitively broken (4xx/5xx or DNS failure).
 * Hosts that refuse HEAD/GET from a script but work in a browser are reported
 * separately as "blocked" and do not fail the run.
 */
import { LOCATIONS, FISH, HAZARDS, HABITATS, VIDEOS, TIDE_GUIDE, SOURCES } from '../src/data/index.ts';

const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;
const UA =
  'Mozilla/5.0 (compatible; gcf-link-check/1.0; +https://gitjdevenyns.github.io/GCF/)';
/**
 * Some hosts (myfwc.com among them) serve a 403/500 to anything that doesn't
 * look like a real browser. A URL is only reported broken if it also fails with
 * this UA, so bot filtering isn't mistaken for rot.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Collect every outbound URL with a label saying where it lives. */
function collect() {
  const urls = new Map(); // url -> Set<where>
  const add = (url, where) => {
    if (!url) return;
    if (!urls.has(url)) urls.set(url, new Set());
    urls.get(url).add(where);
  };

  for (const f of FISH) f.images.forEach((m, i) => add(m.url, `fish/${f.id} image[${i}]`));
  for (const h of HAZARDS) {
    if (h.image) add(h.image.url, `hazard/${h.id} image`);
    h.injury_media.forEach((m, i) => {
      add(m.url, `hazard/${h.id} injury[${i}]`);
      add(m.source_url, `hazard/${h.id} injury[${i}] source`);
    });
  }
  for (const h of HABITATS) h.photos.forEach((m, i) => add(m.url, `habitat/${h.id} photo[${i}]`));
  for (const v of VIDEOS) add(v.url, `video/${v.title}`);
  for (const s of TIDE_GUIDE.stations) add(s.url, `tide station/${s.area}`);
  for (const s of SOURCES) add(s.url, `source/${s.id}`);
  for (const l of LOCATIONS) {
    l.images.forEach((m, i) => add(m.url, `location/${l.slug} image[${i}]`));
    l.sources.forEach((s) => add(s.url, `location/${l.slug} source/${s.id}`));
    if (l.tide_station.url) add(l.tide_station.url, `location/${l.slug} tide station`);
  }
  return urls;
}

async function probe(url) {
  const attempt = async (method, ua) => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctl.signal,
        headers: { 'User-Agent': ua, Accept: '*/*' },
      });
      return { status: res.status };
    } finally {
      clearTimeout(timer);
    }
  };

  const classify = (status) => {
    if (status >= 200 && status < 400) return 'ok';
    // Hotlink protection / bot filtering, not a dead URL.
    if (status === 401 || status === 403 || status === 429) return 'blocked';
    return 'broken';
  };

  try {
    // HEAD first (cheap); many CDNs reject it, so fall back to GET.
    let { status } = await attempt('HEAD', UA);
    if (status === 405 || status === 403 || status === 501) {
      ({ status } = await attempt('GET', UA));
    }
    let state = classify(status);

    // Second opinion with a browser UA before condemning a URL.
    if (state !== 'ok') {
      try {
        const retry = await attempt('GET', BROWSER_UA);
        const retryState = classify(retry.status);
        if (retryState === 'ok') return { state: 'ok', status: retry.status };
        if (retryState === 'blocked') return { state: 'blocked', status: retry.status };
        status = retry.status;
        state = retryState;
      } catch {
        /* keep the original verdict */
      }
    }
    return { state, status };
  } catch (e) {
    const msg = e?.cause?.code ?? e?.name ?? String(e);
    if (msg === 'AbortError' || msg === 'TimeoutError') return { state: 'blocked', status: 'timeout' };
    return { state: 'broken', status: msg };
  }
}

async function main() {
  const urls = [...collect().entries()];
  console.log(`Checking ${urls.length} external URLs...\n`);

  const results = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < urls.length) {
        const [url, wheres] = urls[cursor++];
        const r = await probe(url);
        results.push({ url, wheres: [...wheres], ...r });
        process.stdout.write(r.state === 'ok' ? '.' : r.state === 'blocked' ? '?' : 'X');
      }
    }),
  );
  process.stdout.write('\n\n');

  const by = (s) => results.filter((r) => r.state === s);
  const broken = by('broken');
  const blocked = by('blocked');

  console.log(`ok:      ${by('ok').length}`);
  console.log(`blocked: ${blocked.length}  (bot/hotlink protection or timeout — verify by hand)`);
  console.log(`broken:  ${broken.length}\n`);

  for (const r of blocked) {
    console.log(`? ${r.status}  ${r.url}\n    ${r.wheres.join('\n    ')}`);
  }
  if (blocked.length) console.log('');
  for (const r of broken) {
    console.log(`X ${r.status}  ${r.url}\n    ${r.wheres.join('\n    ')}`);
  }

  process.exit(broken.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
