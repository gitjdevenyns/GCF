import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Console from './Console';
import Review from './Review';
import '../styles/tokens.css';
import '../styles/base.css';
import './admin.css';

/**
 * Owner tooling, served from its own entry (`admin.html`).
 *
 * Not a route inside the reader's app, and not in the service worker precache:
 * a person who installs the guide should never carry this code, and it has no
 * business working offline when every action in it is a network write.
 *
 * No router — two tabs is not a routing problem.
 */
type Tab = 'review' | 'packaging';

function Admin() {
  const [tab, setTab] = useState<Tab>('review');
  return (
    <div className="app">
      <header className="appbar">
        <span className="appbar-brand">
          <span className="name">GCF · owner console</span>
        </span>
        <nav className="adm-tabs">
          <button
            type="button" className={`btn ${tab === 'review' ? 'btn-lime' : 'btn-ghost'}`}
            onClick={() => setTab('review')}
          >
            Review queue
          </button>
          <button
            type="button" className={`btn ${tab === 'packaging' ? 'btn-lime' : 'btn-ghost'}`}
            onClick={() => setTab('packaging')}
          >
            Free / paid
          </button>
        </nav>
      </header>
      <main className="app-main">
        <div className="app-shell">{tab === 'review' ? <Review /> : <Console />}</div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('admin-root')!).render(
  <StrictMode>
    <Admin />
  </StrictMode>,
);
