# `identify-fish` Edge Function

Takes one photograph, returns one species **estimate**. Deployed to project
`nwpuausjhqtvwmjprphc`, called from the browser by `src/pages/IdentifyFish.tsx`.

```
POST /functions/v1/identify-fish
Authorization: Bearer <publishable anon key>
Content-Type: application/json

{ "image_base64": "<bare base64, no data: prefix>", "media_type": "image/jpeg" }
```

```jsonc
// 200
{
  "result": {
    "identified": true,
    "common_name": "Redfish / Red Drum",
    "scientific_name": "Sciaenops ocellatus",
    "confidence": "high",              // high | moderate | low
    "field_marks": "Coppery-bronze body with a distinct black ocellus …",
    "guide_species_id": "redfish",     // an id from src/data, or "none"
    "is_potentially_hazardous": false,
    "hazard_note": "",
    "also_consider": []
  },
  "usage": { "input_tokens": 3451, "output_tokens": 156 },
  "model": "claude-opus-5"
}
```

## The model call

`claude-opus-5` vision with **structured outputs** — `output_config.format` with
a `json_schema`. This is a bounded classification, not an agentic task, so the
schema does the work that prompt-wrangling would otherwise do: the shape is
guaranteed, and `guide_species_id` is an `enum` over this guide's own species
ids, so the model cannot name a species the guide has nothing to say about.

That enum covers three kinds, because the guide knows three different amounts
about a fish:

| kind | source | what a match links to |
| --- | --- | --- |
| `fish` (5) | `src/data/fish.ts` | its own species page |
| `hazard` (6) | `src/data/hazards.ts` | Handle With Care |
| `named` (5) | `src/data/namedTargets.ts` | a location that lists a rig and bait for it |

`named` exists because sheepshead and pompano are among the most commonly caught
fish in this footprint and neither has a page. Recognising them and saying "no
page for this yet, here's the spot that fishes for it" beats answering `none`.
Anything outside all three — flounder, whiting, ladyfish, black drum — is
identified by name with `guide_species_id: "none"` and no link, which is the
honest answer.

Two API details worth keeping in mind if you edit the call:

- `output_config.format` accepts exactly `type` and `schema`. Adding a `name`
  alongside them returns `400 output_config.format.name: Extra inputs are not
  permitted`.
- Thinking is **on by default** on Opus 5 and `max_tokens` bounds thinking plus
  the answer together, which is why `max_tokens` is 4096 for a ~250-token
  result. `effort: "medium"` is a deliberate choice: the ceiling on a bounded
  classification is reached well below the `high` default, and effort is the
  main lever on cost here.
- `stop_reason: "refusal"` is a **200**, with empty or partial content. It is
  handled explicitly — reading `content[0]` on a refusal would throw.

## Cost

Measured end-to-end against licensed Wikimedia photographs, at Opus 5's
$5/$25 per MTok:

| Photo | Pixels | Input | Output | Cost |
| --- | --- | --- | --- | --- |
| Red drum, 1280×853 | 1.09 MP | 3,451 | 202 | $0.022 |
| Hardhead catfish, 1280×960 | 1.23 MP | 3,635 | 259 | $0.025 |
| Sheepshead, 1000×667 | 0.67 MP | 3,545 | 455 | $0.029 |
| Sheepshead engraving, 2580×1597 | 4.12 MP | 7,433 | 707 | $0.055 |

Input fits `≈ 2650 + pixels/744` — a fixed ~2,650 tokens of system prompt and
schema, plus the image. Output runs 150–700 tokens including adaptive thinking,
and is highest when the model is being careful (that last row is a monochrome
engraving; it correctly declined to call it and spent the tokens explaining
why).

The client downscales to 1024px on the long edge, so a real request is about
**3,700 input + ~300 output ≈ $0.026 per identification**. That last row is the
argument for the downscale: the same fish at full resolution costs twice as
much and identifies no better.

## Abuse protection

The site is public and the anon key is in the bundle by design, so the JWT gate
is not the control — these are:

| Control | Value | Where |
| --- | --- | --- |
| Request size | 2.2 MB body / 1.5 MB decoded image | this function, before the body is read |
| Per IP, per hour | 6 | `claim_fish_id_slot()` |
| Per IP, per day | 20 | `claim_fish_id_slot()` |
| Everyone, per day | 250 | `claim_fish_id_slot()` |

The global cap is the one that actually bounds the bill: **250 × $0.026 ≈
$6.50/day worst case**, and it is a single number in the migration if that is
the wrong ceiling. The per-IP caps only shape who gets to spend it.

The slot is claimed *before* the model call, so a refusal costs nothing, and a
failure of the ledger itself returns 503 rather than falling open — a broken
rate limiter must not become an open tap on someone's API account. Malformed
and oversized uploads are rejected before the claim, so junk cannot burn a
caller's quota.

Callers are pseudonymised: the ledger stores `HMAC-SHA256(ip, pepper)` where the
pepper is the service-role key, which never leaves the Edge runtime. No raw IP,
no photo and no result is ever written down. See the migration
`20260810190000_fish_id_rate_limit.sql`.

## Secrets

`ANTHROPIC_API_KEY` is a Supabase Function secret, read via `Deno.env` here and
nowhere else. It must never appear in client code, in a `VITE_`-prefixed
variable, or in `dist/` — the deploy workflow greps the built bundle for it and
fails the deploy on a hit.

## Deploy

```sh
supabase db push --linked                                     # the ledger + gate
supabase functions deploy identify-fish --project-ref nwpuausjhqtvwmjprphc
```

CORS: `verify_jwt = true` (see `supabase/config.toml`), and the preflight is
answered by this function before the JWT check, so a browser on
`https://gitjdevenyns.github.io` gets a 204 with the right
`Access-Control-Allow-Origin`. Adding a new front-end origin means adding it to
`ALLOWED_ORIGINS`.
