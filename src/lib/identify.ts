/**
 * Photo identification — client contract.
 *
 * Mirrors the shape of `lib/conditions.ts`: every outcome is a named state, so
 * a blank or crashed panel is unrepresentable. Nothing here throws at the call
 * site — `identifyFish()` resolves to either an `IdentifyOk` or an
 * `IdentifyFailure`, and every failure carries a sentence written for a person
 * standing on a dock, not a stack trace.
 *
 * The result is an ESTIMATE. That word is load-bearing and is repeated in the
 * UI: the guide already keeps official regulation, general tactics and local
 * heuristics visually distinct (README, "Content rules"), and an AI species
 * call is weaker than all three. It is a prompt to look closer, not an answer.
 */

import { FISH, HAZARDS, locationsNaming, namedTargetById } from '../data';
import { getSupabaseConfig } from './supabase';

/** Wire shape returned by the `identify-fish` Edge Function's `result`. */
export interface FishIdResult {
  identified: boolean;
  common_name: string;
  scientific_name: string;
  confidence: 'high' | 'moderate' | 'low';
  field_marks: string;
  /** An id from this guide's own species list, or 'none'. */
  guide_species_id: string;
  is_potentially_hazardous: boolean;
  hazard_note: string;
  also_consider: string[];
}

export interface IdentifyOk {
  ok: true;
  result: FishIdResult;
  /** Present when the function reported token usage; used for nothing but debugging. */
  usage?: { input_tokens: number; output_tokens: number };
}

export type IdentifyFailureKind =
  | 'unavailable' // this build has no Supabase config
  | 'offline'
  | 'rate-limited'
  | 'too-large'
  | 'bad-image'
  | 'declined' // Claude declined to answer
  | 'timeout'
  | 'server';

export interface IdentifyFailure {
  ok: false;
  kind: IdentifyFailureKind;
  message: string;
  retryAfterSeconds?: number;
}

export type IdentifyOutcome = IdentifyOk | IdentifyFailure;

/**
 * A resolved link into the guide's own content.
 *
 * Three kinds, because the guide knows three different amounts about a fish:
 *   fish   — a documented target species with its own page
 *   hazard — a documented Handle With Care species
 *   named  — named as a target at real locations, with a researched rig and
 *            bait at each, but no species page yet
 */
export interface GuideMatch {
  kind: 'fish' | 'hazard' | 'named';
  id: string;
  name: string;
  /** In-app route. */
  to: string;
  /** For a `named` match, how many guide locations name it as a target. */
  spotCount?: number;
}

/**
 * Resolve the model's `guide_species_id` against the bundled content.
 *
 * The Edge Function constrains the model to this exact id set via the output
 * schema, so a mismatch here means the guide's data and the function's copy of
 * the list have drifted — which `src/test/identify.data.test.ts` fails the
 * build over. Returning null rather than guessing is still the right behaviour
 * if it ever happens: a wrong deep link sends someone to confident handling
 * instructions for the wrong animal.
 */
export function resolveGuideMatch(id: string | null | undefined): GuideMatch | null {
  if (!id || id === 'none') return null;

  const fish = FISH.find((f) => f.id === id);
  if (fish) return { kind: 'fish', id: fish.id, name: fish.name, to: `/fish/${fish.id}` };

  const hazard = HAZARDS.find((h) => h.id === id);
  if (hazard) return { kind: 'hazard', id: hazard.id, name: hazard.name, to: '/care' };

  const named = namedTargetById(id);
  if (named) {
    // Point at a spot that actually lists this species, because that page
    // carries the researched rig, hook, leader, weight and bait for it — the
    // closest thing the guide has to a species page for these five.
    const spots = locationsNaming(named);
    if (spots.length === 0) return null;
    return {
      kind: 'named',
      id: named.id,
      name: named.name,
      to: `/locations/${spots[0].slug}`,
      spotCount: spots.length,
    };
  }
  return null;
}

/** Human wording for the confidence enum. Never a percentage — we have no basis for one. */
export const CONFIDENCE_LABEL: Record<FishIdResult['confidence'], string> = {
  high: 'Confident',
  moderate: 'Fairly confident',
  low: 'Not confident',
};

/* --------------------------------------------------------------- validation */

const CONFIDENCES = ['high', 'moderate', 'low'] as const;

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Defensive parse of the function's `result`.
 *
 * The Edge Function constrains Claude with a JSON schema, so a well-formed
 * response is the norm — but this is a network boundary, and a network boundary
 * that trusts its input is a crash waiting for a bad day. Anything missing or
 * mistyped degrades to a safe value rather than throwing: unknown confidence
 * becomes 'low', and a missing hazard flag becomes `true`, because the safe
 * default for "we do not know what this is" is "treat it as if it bites".
 */
export function parseFishIdResult(value: unknown): FishIdResult | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.identified !== 'boolean') return null;

  const confidence = CONFIDENCES.includes(v.confidence as FishIdResult['confidence'])
    ? (v.confidence as FishIdResult['confidence'])
    : 'low';

  const identified = v.identified && str(v.common_name).trim().length > 0;

  return {
    identified,
    common_name: str(v.common_name).trim(),
    scientific_name: str(v.scientific_name).trim(),
    confidence,
    field_marks: str(v.field_marks).trim(),
    guide_species_id: str(v.guide_species_id) || 'none',
    // Fail safe, not silent: anything other than an explicit `false` is treated
    // as "could hurt you", as is any unidentified animal.
    is_potentially_hazardous: v.is_potentially_hazardous !== false || !identified,
    hazard_note: str(v.hazard_note).trim(),
    also_consider: Array.isArray(v.also_consider)
      ? v.also_consider.filter((x): x is string => typeof x === 'string' && x.trim() !== '')
      : [],
  };
}

/* ------------------------------------------------------------------ request */

export const isIdentifyConfigured = (): boolean => getSupabaseConfig() !== null;

/** Long enough for a cold Edge Function plus a thinking vision call. */
const TIMEOUT_MS = 75_000;

const OFFLINE: IdentifyFailure = {
  ok: false,
  kind: 'offline',
  message:
    'No connection reached the identification service. The rest of the guide works offline — try this again when you have signal.',
};

/**
 * POST one prepared photo and resolve to a named outcome.
 *
 * Never rejects. Never leaves an unhandled rejection. Aborts on a timeout
 * rather than hanging a spinner forever.
 */
export async function identifyFish(image: {
  base64: string;
  mediaType: string;
}): Promise<IdentifyOutcome> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      kind: 'unavailable',
      message: 'Photo identification is not switched on in this build of the guide.',
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${config.url.replace(/\/$/, '')}/functions/v1/identify-fish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Publishable anon key — the same one already in the bundle for reads.
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      body: JSON.stringify({ image_base64: image.base64, media_type: image.mediaType }),
      signal: controller.signal,
    });

    let body: Record<string, unknown> = {};
    try {
      body = (await res.json()) as Record<string, unknown>;
    } catch {
      // Fall through to the status-based branches below with an empty body.
    }
    const message = typeof body.message === 'string' ? body.message : '';

    if (res.status === 429) {
      return {
        ok: false,
        kind: 'rate-limited',
        message:
          message ||
          'You have used your photo identifications for now. This limit exists because each one costs real money on someone else’s account.',
        retryAfterSeconds:
          typeof body.retry_after_seconds === 'number' ? body.retry_after_seconds : undefined,
      };
    }
    if (res.status === 413) {
      return {
        ok: false,
        kind: 'too-large',
        message: message || 'That photo was too large to send. Try a different one.',
      };
    }
    if (res.status === 400) {
      return {
        ok: false,
        kind: 'bad-image',
        message: message || 'That file did not arrive as a readable photo.',
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        kind: 'server',
        message: message || 'The identification service did not answer. Try again in a moment.',
      };
    }
    // A 200 can still carry a refusal — see the Edge Function.
    if (body.error === 'declined') {
      return {
        ok: false,
        kind: 'declined',
        message:
          message || 'The identification service declined to answer for this photo. Try another one.',
      };
    }

    const result = parseFishIdResult(body.result);
    if (!result) {
      return {
        ok: false,
        kind: 'server',
        message: 'The identification came back in a shape this app could not read.',
      };
    }
    const usage = body.usage as IdentifyOk['usage'] | undefined;
    return { ok: true, result, usage };
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') {
      return {
        ok: false,
        kind: 'timeout',
        message: 'That took too long and was cancelled. Try again — a smaller, sharper photo helps.',
      };
    }
    // fetch() rejects on a transport failure, which on a phone almost always
    // means no usable connection rather than a broken server.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return OFFLINE;
    return {
      ok: false,
      kind: 'server',
      message: 'Could not reach the identification service. Try again in a moment.',
    };
  } finally {
    clearTimeout(timer);
  }
}
