# Content policy

Binding on anything published under the GCF name, by a person or an agent.

## The one rule everything else follows from

**The product is credibility.** A fishing guide is worth using because its
content was researched instead of guessed — that is the whole differentiator
against apps with a hundred times the users. A marketing claim that outruns
the researched content does not oversell the product; it removes the reason
the product exists. There is no growth number worth that trade.

## Never claim

- **That the app predicts or improves a catch.** There is no catch data in the
  system to calibrate such a claim against, which makes it unfalsifiable — and
  the app itself deliberately refuses uncalibrated confidence (the photo
  identifier is built so no number on screen implies a probability). Marketing
  must not assert what the product declines to.
- **That AI decides where to fish.** The ranking is a documented rule set over
  researched fields. Calling it AI is a claim we cannot support, and it is the
  one false note on a screen whose entire appeal is showing its work.
- **Any fishing fact not already in `src/data/`.** Species, seasons, tackle,
  spots, regulations, safety. Quote the researched string; never paraphrase
  it, because paraphrasing researched fishing content is writing new fishing
  content.
- **Anything about a named business** without a checkable source.
- **Endorsements, testimonials, catch photos or user counts that do not
  exist.** No invented people, no stock fish presented as a user's catch.

## Always

- **Disclose paid placement.** Sponsored content carries its label wherever a
  reader sees it. Undisclosed paid placement is deceptive advertising and it is
  the fastest way to lose the credibility above. Enforced in code
  (`src/lib/sponsorship.ts`), and it applies to marketing too.
- **Disclose AI-generated promotional content** where a platform requires it.
- **Say "estimate" about the photo identifier**, every time.
- **Respect platform automation rules.** No fake accounts, no bought
  engagement, no identical text blasted across platforms.

## Safe, strong claims (all verifiable today)

- 25 researched spots, St. Petersburg to Boca Grande Pass.
- Works fully offline — the whole guide is bundled.
- Your location never leaves your device.
- It shows why a spot matched: the tide it fishes, the hours, the season.
- Live NOAA tide predictions and NWS forecasts, labelled as predictions.
- Safe-handling guidance for the species that hurt people.

## The approval gate

Drafts go to `marketing/queue/` as `status: draft`. A human moves them to
`approved`. Publishing additionally requires `autonomous_posting: true` in
`marketing/config.json`. Both conditions, every time. Agents may always draft
and may never publish unapproved work.

The gate exists because a wrong post is not a bug you can revert — it has
already been seen, screenshotted and indexed.
