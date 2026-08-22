import { useCallback, useEffect, useState } from 'react';
import { CAPABILITIES, DEFAULT_MATRIX, mergeMatrix } from '../lib/entitlements';
import type { Capability, EntitlementMatrix, Tier } from '../lib/entitlements';
import { useTier } from '../lib/useEntitlements';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { SHOPS } from '../data/shops';
import { SectionTitle } from '../components/ui';

/**
 * Owner console: what free includes, what paid includes, and who is paying.
 *
 * Not linked from the app's navigation. It is not secret — the route is
 * guessable and the config it edits is public to read — but it is not part of
 * the reader's product either, and RLS is what actually protects it: writes
 * require a row in `public.admins`, which only the service role can grant.
 * Signing in as an ordinary user gets you a read-only screen and a clear note
 * saying so.
 */

type Status = 'idle' | 'saving' | 'saved' | 'error';

function Row({ cap, matrix, onChange }: {
  cap: Capability;
  matrix: EntitlementMatrix;
  onChange: (id: string, tier: Tier, value: boolean | number | null) => void;
}) {
  const row = matrix[cap.id] ?? { free: cap.free, paid: cap.paid };

  const cell = (tier: Tier) => {
    const v = row[tier];
    if (cap.kind === 'boolean') {
      return (
        <label className="adm-toggle">
          <input
            type="checkbox"
            checked={v === true}
            onChange={(e) => onChange(cap.id, tier, e.target.checked)}
          />
          <span>{v === true ? 'On' : 'Off'}</span>
        </label>
      );
    }
    const uncapped = v === null;
    return (
      <div className="adm-limit">
        <label className="adm-toggle">
          <input
            type="checkbox"
            checked={uncapped}
            onChange={(e) => onChange(cap.id, tier, e.target.checked ? null : 0)}
          />
          <span>All</span>
        </label>
        {!uncapped && (
          <input
            type="number"
            min={0}
            className="adm-num"
            value={typeof v === 'number' ? v : 0}
            onChange={(e) => onChange(cap.id, tier, Math.max(0, Number(e.target.value) || 0))}
            aria-label={`${cap.label} limit for ${tier}`}
          />
        )}
        {!uncapped && cap.unit && <span className="mut xs">{cap.unit}</span>}
      </div>
    );
  };

  return (
    <tr>
      <td>
        <b>{cap.label}</b>
        <div className="mut xs">{cap.description}</div>
        {cap.note && <div className="adm-note">{cap.note}</div>}
        <code className="adm-key">{cap.id}</code>
      </td>
      <td>{cell('free')}</td>
      <td>{cell('paid')}</td>
      <td>
        <span className={`chip ${cap.enforced ? 'chip-lime' : ''}`}>
          {cap.enforced ? 'Enforced' : 'Soft'}
        </span>
      </td>
    </tr>
  );
}

export default function Admin() {
  const [email, setEmail] = useState('');
  const [signedIn, setSignedIn] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [matrix, setMatrix] = useState<EntitlementMatrix>(DEFAULT_MATRIX);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [tier, setTier] = useTier();

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      const cp = getSupabaseClient();
      if (!cp) return;
      const supabase = await cp;
      const { data: session } = await supabase.auth.getSession();
      const user = session.session?.user ?? null;
      if (!cancelled) setSignedIn(user?.email ?? null);
      if (user) {
        const { data: admin } = await supabase.from('admins').select('user_id').maybeSingle();
        if (!cancelled) setIsAdmin(Boolean(admin));
      }
      const { data } = await supabase
        .from('app_config').select('value').eq('key', 'entitlements').maybeSingle();
      if (!cancelled) setMatrix(mergeMatrix(data?.value ?? null));
    })().catch(() => {
      if (!cancelled) setMessage('Could not reach Supabase. Showing shipped defaults.');
    });
    return () => { cancelled = true; };
  }, [configured]);

  const change = useCallback((id: string, t: Tier, value: boolean | number | null) => {
    setMatrix((m) => ({ ...m, [id]: { ...(m[id] ?? DEFAULT_MATRIX[id]), [t]: value } }));
    setStatus('idle');
  }, []);

  const signIn = async () => {
    const cp = getSupabaseClient();
    if (!cp || !email) return;
    const supabase = await cp;
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : `Sign-in link sent to ${email}.`);
  };

  const save = async () => {
    const cp = getSupabaseClient();
    if (!cp) return;
    setStatus('saving');
    const supabase = await cp;
    const { error } = await supabase
      .from('app_config')
      .update({ value: matrix })
      .eq('key', 'entitlements');
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    setStatus('saved');
    setMessage('Saved. Readers pick it up on their next load.');
  };

  const groups = [...new Set(CAPABILITIES.map((c) => c.group))];

  return (
    <div className="wrap adm">
      <h1 className="d2">Owner console</h1>

      {!configured && (
        <p className="callout callout--warn">
          Supabase is not configured in this build, so nothing here can be saved.
          The matrix below shows the shipped defaults.
        </p>
      )}

      {configured && !signedIn && (
        <div className="card card-pad">
          <p className="mut" style={{ marginTop: 0 }}>
            Sign in to edit. A link is emailed to you — no password.
          </p>
          <div className="row g2 wrap">
            <input
              type="email" className="adm-num" style={{ minWidth: 240 }}
              placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} aria-label="Email"
            />
            <button type="button" className="btn btn-lime" onClick={signIn}>
              Send link
            </button>
          </div>
        </div>
      )}

      {signedIn && !isAdmin && (
        <p className="callout callout--warn">
          Signed in as {signedIn}, but this account is not an admin, so saving
          will be refused by the database. Grant it with the SQL at the bottom of{' '}
          <code>supabase/migrations/20260822140000_app_config_and_admin.sql</code>.
        </p>
      )}

      {message && <p className="mut">{message}</p>}

      <div className="card card-pad mt3">
        <span className="lab">Preview as</span>
        <div className="row g2 wrap" style={{ marginTop: 6 }}>
          {(['free', 'paid'] as Tier[]).map((t) => (
            <button
              key={t} type="button"
              className={`btn ${tier === t ? 'btn-lime' : 'btn-ghost'}`}
              onClick={() => setTier(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mut xs" style={{ marginTop: 8 }}>
          Switches how the rest of the app renders for you on this device only.
          There is no billing yet, so every real reader is on free.
        </p>
      </div>

      {groups.map((g) => (
        <section key={g} className="mt3">
          <SectionTitle id={`grp-${g}`}>{g}</SectionTitle>
          <div className="scrollx">
            <table className="adm-table">
              <thead>
                <tr><th>Capability</th><th>Free</th><th>Paid</th><th>Gate</th></tr>
              </thead>
              <tbody>
                {CAPABILITIES.filter((c) => c.group === g).map((c) => (
                  <Row key={c.id} cap={c} matrix={matrix} onChange={change} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="card card-pad mt3">
        <button
          type="button" className="btn btn-lime"
          onClick={save} disabled={!isAdmin || status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Save packaging'}
        </button>
        <p className="mut xs" style={{ marginTop: 8 }}>
          "Soft" gates hide content that is already in the reader's bundle — good
          for packaging, not a lock. Only "Enforced" gates are checked on the
          server where a client cannot forge them.
        </p>
      </div>

      <section className="mt3">
        <SectionTitle id="adm-shops">Tackle &amp; bait shops</SectionTitle>
        {SHOPS.length === 0 ? (
          <p className="callout callout--info">
            The shop directory is empty. It is researched, bundled content —
            every real shop belongs in it whether or not they pay, because a
            directory of advertisers has no readers and therefore nothing to
            sell. Once <code>src/data/shops.ts</code> is populated, each shop
            appears here with its sponsorship controls: map pin, enhanced page,
            logo, directory rank, and which location pages may carry its card.
          </p>
        ) : (
          <p className="mut">{SHOPS.length} shops. Sponsorship editing lands with the directory.</p>
        )}
      </section>
    </div>
  );
}
