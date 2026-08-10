import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// testing-library auto-cleanup only runs with vitest globals enabled;
// we keep globals off, so clean the DOM between tests explicitly.
afterEach(() => {
  cleanup();
});
