# Lessons learned

Operating rules earned the expensive way. Each one exists because something
actually went wrong on this project.

---

## 1. An agent that runs off on its own and comes back with nothing

**What happened.** A shops-research agent was told to be thorough and to
prefer quality over coverage. It decided the way to do that was to spawn four
regional sub-researchers of its own. Then it sat waiting on them. It reported
"completed" three separate times over 24 minutes while its actual answer was
"waiting on the final two regional researchers before compiling."

**Cost: ~108,000 tokens, 64 tool calls, and no file written.** The parent never
compiled anything. One sub-researcher did produce genuinely excellent work —
including the discovery that Annie's Bait & Tackle has been demolished since
April 2025 while its website still publishes opening hours — and that report
survived only because it happened to arrive as a notification and was copied
out by hand. The others are gone.

**Why it happened.** The brief said what to research and how carefully, and
said nothing about *how the agent was allowed to organise the work*. Given
latitude and a large task, delegating looks reasonable. Nothing in the brief
forbade it, and nothing required incremental output, so a stalled child meant
zero output rather than partial output.

**The rules now:**

- **State whether sub-agents are allowed.** Usually: they are not. Say so
  explicitly — "do not spawn sub-agents; do the work yourself."
- **Require incremental writes.** "Write each section to the output file as
  you finish it, before starting the next." A run that dies at 80% should
  leave 80% on disk. Never let the only copy of the work live in a context
  window.
- **Give an explicit budget.** Number of searches, number of items, or a
  wall-clock ceiling. "Be thorough" is not a budget, and an agent cannot
  ration what it has not been given a number for.
- **Define done as a file.** "You are finished when `<path>` exists and
  contains X." Not "when you have researched the topic."
- **Name the stop condition for partial work.** "If you run out of budget,
  write what you have with a TODO list of what is missing, and stop."

## 2. Questions come back to the owner, not around him

An agent that hits a genuine ambiguity must **stop and surface the question**,
not pick an interpretation and build on it. Every brief says so, and every
brief names where the question goes: back in the agent's final report, at the
top, flagged — or into `docs/OPS_LOG.md` for agents that run unattended.

A question costs the owner a minute. A wrong assumption committed to the repo
costs an afternoon, and if it reaches the guide's content it costs credibility
that cannot be bought back.

**This applies to me too.** Where two readings of a request would produce
materially different work, ask before building, not after.

## 3. Briefs are specific or they are not briefs

Every agent brief on this project must carry, explicitly:

1. **The exact deliverable** — full file path and format.
2. **The exact scope** — the list of items, not a description of a category.
3. **What it may not do** — no sub-agents, no application-code edits, no
   publishing, no invented content.
4. **A budget** — searches, items, or time.
5. **Where questions go.**
6. **What "insufficient information" looks like as output** — an honest gap
   is a valid result and must be a named, expected outcome.
7. **The verification command** — `npm run build`, `npm test`, a file check.

## 4. Verify the agent's claim, not just the agent's report

A design agent reported "byte-identical, verified by diff" for a region it was
told not to touch. It was telling the truth — but that was established by
re-running the diff, the build and the tests, not by the report saying so.

The same pass caught a real regression the report did not mention. Reports are
evidence, not proof.

## 5. Look at the thing

Three real bugs on this project were invisible in code review and obvious in a
browser: 59px of every page hidden behind a sticky appbar, axis labels stretched
2.8× horizontally, and "right here" claimed by two spots a third of a mile
apart. There is a Playwright driver at `/home/johnd/.claude-browser/`. Use it.

## 6. Cheap models are for capture, not judgment

Where a two-stage pipeline is used — a cheap model gathering, a stronger one
writing — the split must be **verbatim capture vs. judgment**, never
"research vs. writing". The scout records quote, URL, publisher and date-seen
and nothing else. The moment a cheap model is asked whether a source is
trustworthy, its failure mode stops being "finds less" and becomes
"confidently attributes a claim to a source that does not support it" — which
is the one failure this guide cannot absorb.

## 7. The live site is not the repo

The Supabase `locations` table drifted to 15 rows while the bundled guide grew
to 25. Ten spots had no live tide for weeks and nothing errored, because a
missing row and a stale cache render identically. `npm run check:db-sync`
exists now. Anything with two sources of truth needs a command that compares
them, and that command needs to be run.
