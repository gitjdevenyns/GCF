# Where the money goes

Audited 2026-08-22. Two separate bills, and they behave very differently.

## 1. Claude Code agents — your subscription

| Agent | Model | Why |
|---|---|---|
| `ops-lead` | **Sonnet 5** | Bounded work: one backlog item, written spec, build+tests as a hard gate, branch-only. The guard rails do the work, not model size. |
| `marketing-creative` | **Sonnet 5** | Drafting against an explicit policy with a fixed source of truth. What keeps it safe is `marketing/CONTENT_POLICY.md`, not model tier. |

Both were Opus 5; neither was ever above it. **Nothing in this project runs
on Fable 5**, the only tier above Opus.

Override per-invocation when a task genuinely warrants it — the Agent tool
takes a `model` argument, so a hard architectural item can be run on Opus
without changing the definition. The default should be the cheap one.

Rough guide for the ad-hoc research and build agents this project spawns:

- **Sonnet 5** — research with explicit sources, drafting, mechanical
  refactors, anything with a spec and a test to check it against.
- **Opus 5** — architecture, subtle debugging, design work, anything where
  being wrong is expensive and not caught by a test.
- **Haiku 4.5** — bulk mechanical passes with a machine-checkable result.

The largest single agent run in this project's history was 260k tokens for
the hero redesign. That is the kind of task that earns Opus. A research agent
reading web pages and writing a sourced markdown file is not.

## 2. Anthropic API — your credit card, and it scales with users

Only one thing here: `supabase/functions/identify-fish`, the photo species
identifier. Everything else the app calls (NOAA CO-OPS, NWS) is free.

Measured cost today: **3,700 input + ~300 output tokens per identification.**

| Model | In / Out per MTok | Per ID | Worst-case day (250 cap) |
|---|---|---|---|
| **Opus 5** (current) | $5 / $25 | **$0.0260** | **$6.50** |
| Sonnet 5 (intro, to 2026-08-31) | $2 / $10 | $0.0104 | $2.60 |
| Sonnet 5 (standard) | $3 / $15 | $0.0156 | $3.90 |
| Haiku 4.5 | $1 / $5 | $0.0052 | $1.30 |

Already optimised and worth *not* undoing:

- `effort: "medium"` is set, below the `high` default. On a bounded
  classification that is the main lever and it is already pulled.
- Images are downscaled to 1024px on the device before upload. Full
  resolution costs roughly twice as much for the same answer.
- Three rate-limit windows are claimed in Postgres **before** the paid call,
  so a refusal costs nothing and the global cap actually bounds the bill.

**Prompt caching is not worth it here.** The stable prefix is only around
2,000 tokens and the cache TTL is five minutes; at this traffic level the
writes would cost more than the reads save. Revisit if usage becomes bursty.

### The model decision is a product call, not just a cost one

Switching to Sonnet 5 is a one-line change (`MODEL` in `index.ts`) and saves
40% — 60% while the intro pricing lasts. It keeps `effort` and adaptive
thinking, so nothing else in the request changes.

Haiku 4.5 saves 80% but is **not** a one-line change: `effort` is rejected on
that generation, so `output_config` would have to be reworked.

Before switching, weigh what this feature is for. Two of the six Handle With
Care species look, to a casual eye, like fish people grab without thinking. A
weaker model does not fail dangerously here — the design already routes
uncertainty to "I can't tell" and flags anything unidentified as potentially
hazardous — but it will say "I can't tell" more often, which makes the
feature less useful rather than less safe.

**Recommended: try Sonnet 5, but verify first.** Run a set of known photos —
especially the look-alike pairs — through both models and compare before
committing. A 40% saving on a feature nobody trusts is not a saving.
