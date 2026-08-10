import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getLocations } from '../lib/api';
import { ACCESS_TYPES, REGIONS } from '../data';
import type { AccessType, Region } from '../data';
import LazyMap from '../components/LazyMap';
import { Chevron } from '../components/location/art';
import { EmptyState, SectionTitle } from '../components/ui';

/**
 * The index of all fifteen spots: a map with every pin, and the same list
 * grouped by area. Filters are chip buttons with `aria-pressed`, and the
 * current filter lives in the URL so Home can link straight to an area.
 */
export default function Locations() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const regionParam = params.get('region');
  const accessParam = params.get('access');
  const region: 'all' | Region =
    regionParam && (REGIONS as string[]).includes(regionParam) ? (regionParam as Region) : 'all';
  const access: 'all' | AccessType =
    accessParam && (ACCESS_TYPES as string[]).includes(accessParam)
      ? (accessParam as AccessType)
      : 'all';

  const setFilter = (key: 'region' | 'access', value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const all = getLocations();
  const locations = useMemo(
    () =>
      all.filter(
        (l) =>
          (region === 'all' || l.region === region) &&
          (access === 'all' || l.access.includes(access)),
      ),
    [all, region, access],
  );

  const groups = REGIONS.map((r) => ({
    region: r,
    items: locations.filter((l) => l.region === r),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <div className="sect">
        <h1>Where to fish</h1>
        <p className="mut" style={{ marginTop: 'var(--s2)' }}>
          Fifteen spots from the Manatee River to Boca Grande Pass. Every one has its own page:
          structure, the four tide stages, and a tackle plan per species.
        </p>
      </div>

      <div className="sect" style={{ paddingTop: 0 }}>
        <p className="lab" style={{ marginBottom: 'var(--s2)' }} id="filter-area">
          Area
        </p>
        <div className="filters" role="group" aria-labelledby="filter-area">
          <button
            type="button"
            className="chip"
            aria-pressed={region === 'all'}
            onClick={() => setFilter('region', 'all')}
          >
            All areas ({all.length})
          </button>
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              className="chip"
              aria-pressed={region === r}
              onClick={() => setFilter('region', r)}
            >
              {r} ({all.filter((l) => l.region === r).length})
            </button>
          ))}
        </div>

        <p className="lab" style={{ margin: 'var(--s4) 0 var(--s2)' }} id="filter-access">
          Access
        </p>
        <div className="filters" role="group" aria-labelledby="filter-access">
          <button
            type="button"
            className="chip"
            aria-pressed={access === 'all'}
            onClick={() => setFilter('access', 'all')}
          >
            Any access
          </button>
          {ACCESS_TYPES.map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              aria-pressed={access === a}
              onClick={() => setFilter('access', a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="sect" style={{ paddingTop: 0 }}>
        <LazyMap
          locations={locations}
          className="map--tall"
          onSelect={(slug) => navigate(`/locations/${slug}`)}
          label={`Map of ${locations.length} fishing locations`}
        />
        <p className="mut xs" style={{ marginTop: 6 }}>
          {locations.length} of {all.length} spots shown. Tap a pin for the location page, or
          switch to the satellite layer to read the structure before you go.
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="sect">
          <EmptyState
            title="Nothing matches those filters"
            action={
              <button type="button" className="btn btn-ghost" onClick={() => setParams({})}>
                Clear filters
              </button>
            }
          >
            <p>Try a wider area, or any access type.</p>
          </EmptyState>
        </div>
      ) : (
        groups.map((group) => (
          <section className="sect" key={group.region} aria-labelledby={`area-${group.region}`}>
            <SectionTitle id={`area-${group.region}`}>
              {group.region} · {group.items.length}
            </SectionTitle>
            <div className="card">
              {group.items.map((l) => (
                <Link className="linkrow" to={`/locations/${l.slug}`} key={l.slug}>
                  <div>
                    <b>{l.name}</b>
                    <div className="mut xs">
                      {l.structures.join(' · ')} — {l.access.join(' / ')}
                    </div>
                    <div className="row g2 wrap" style={{ marginTop: 6 }}>
                      <span className="chip chip-ghost-blue">
                        Best: {l.tide_playbook.best_window}
                      </span>
                      <span className="chip">
                        {l.targets.map((t) => t.species_label).join(' · ')}
                      </span>
                    </div>
                  </div>
                  <Chevron />
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
