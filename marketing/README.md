# Marketing pipeline

Drafts live in `queue/` as one markdown file per item:
`queue/<YYYY-MM-DD>-<slug>.md`

```markdown
---
platform: x | instagram | reddit | facebook | blog | email
status: draft | approved | posted | rejected
created: 2026-08-22
posted_url: null
claims:
  - "25 researched spots"          # every factual claim, one per line
  - "works offline"
sources:
  - src/data/locations.ts          # where each claim was read from
---

Post body here.
```

`claims` and `sources` are not bureaucracy — they are how a reviewer checks a
post in thirty seconds instead of re-reading the codebase. An item with a
factual claim and no source is rejected on sight.

## Flow

1. An agent (or you) writes a draft. `status: draft`.
2. You review against `CONTENT_POLICY.md` and set `status: approved`.
3. Publishing requires `config.json` → `autonomous_posting: true` **and**
   `status: approved`.
4. After posting, the item gets `status: posted` and its `posted_url`.
   Items are never deleted — the queue is the record of what went out.

## Getting started

- `marketing-creative` agent: drafting, campaigns, SEO copy, screenshots.
- Screenshots come from the real app, never a mockup:
  `cd /home/johnd/.claude-browser && source env.sh && node shot.mjs <url> <out.png> <w> <h> dark`
