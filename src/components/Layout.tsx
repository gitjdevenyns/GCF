import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';
import { useOnline } from '../lib/network';
import { IconHome, IconSpots, IconWater, IconFish, IconCare } from './ui/icons';

/**
 * Primary navigation. The design boards specify a five-slot tab bar
 * (Home · Spots · Water · Fish · Care); "Water" opens the Tides & Water screen.
 * Read-the-water (habitat modules) and Rigs + Knots are reference sections
 * reached from Home, location pages and the desktop nav.
 */
const TABS = [
  { to: '/', label: 'Home', end: true, Icon: IconHome },
  { to: '/locations', label: 'Spots', end: false, Icon: IconSpots },
  { to: '/tides', label: 'Water', end: false, Icon: IconWater },
  { to: '/fish', label: 'Fish', end: false, Icon: IconFish },
  { to: '/care', label: 'Care', end: false, Icon: IconCare },
];

const DESKTOP_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/locations', label: 'Spots', end: false },
  { to: '/tides', label: 'Tides + Water', end: false },
  { to: '/water', label: 'Read Water', end: false },
  { to: '/fish', label: 'Fish + Gear', end: false },
  { to: '/rigs', label: 'Rigs + Knots', end: false },
  { to: '/care', label: 'Handle With Care', end: false },
];

/** Move focus to the page heading on navigation so keyboard/SR users land in content. */
function useRouteFocus() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus();
  }, [pathname]);

  return main;
}

export default function Layout() {
  const [theme, toggleTheme] = useTheme();
  const online = useOnline();
  const main = useRouteFocus();

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="appbar">
        <Link to="/" className="appbar-brand">
          <span className="mark" aria-hidden="true">
            GC
          </span>
          <span>
            <span className="name">Gulf Coast Fishing</span>
            <span className="lab" style={{ fontSize: 10, display: 'block' }}>
              Tampa Bay → Boca Grande
            </span>
          </span>
        </Link>

        <nav className="appnav" aria-label="Sections">
          {DESKTOP_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => (isActive ? 'on' : undefined)}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="appbar-actions">
          <button
            type="button"
            className="iconbtn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '◑' : '◐'}</span>
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      {/* Explains why live slots are empty. The bundled guide still works, so
          this is informational, never blocking. */}
      <div aria-live="polite">
        {!online && (
          <p className="offline-bar">
            <span className="dot" aria-hidden="true" />
            Offline — the full guide still works. Live tide and weather are paused.
          </p>
        )}
      </div>

      <main id="main" className="app-main" ref={main} tabIndex={-1}>
        <div className="app-shell">
          <Outlet />
        </div>
      </main>

      <nav className="tabbar" aria-label="Primary">
        {TABS.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'on' : undefined)}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
