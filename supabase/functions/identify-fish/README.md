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
ids, so the model cannot name a species that has no page behind it.

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

Measured end-to-end against public-domain Wikimedia photographs:

| Photo | Pixels | Input | Output | Cost |
| --- | --- | --- | --- | --- |
| Red drum, 1280×853 | 1.09 MP | 3,451 | 156 | $0.021 |
| Hardhead catfish, 1280×960 | 1.23 MP | 3,635 | 259 | $0.025 |

Those two points fit `input ≈ 1984 + pixels/744`, i.e. a fixed ~1,984 tokens of
system prompt and schema plus the image itself. The client downscales to 1024px
on the long edge before uploading, so a real request is around **3,000 input +
~200 output tokens ≈ $0.02 per identification** at Opus 5's $5/$25 per MTok.

## Abuse protection

The site is public and the anon key is in the bundle by design, so the JWT gate
is not the control — these are:

| Control | Value | Where |
| --- | --- | --- |
| Request size | 2.2 MB body / 1.5 MB decoded image | this function, before the body is read |
| Per IP, per hour | 6 | `claim_fish_id_slot()` |
| Per IP, per day | 20 | `claim_fish_id_slot()` |
| Everyone, per day | 250 | `claim_fish_id_slot()` |

The global cap is the one that actually bounds the bill: **250 × $0.02 ≈ $5/day
worst case**. The per-IP caps only shape who gets to spend it.

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
