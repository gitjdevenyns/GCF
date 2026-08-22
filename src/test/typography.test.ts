import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Brand type guard.
 *
 * The app drifted to six font families and thirteen off-scale font sizes
 * before anyone noticed, because every one of them arrived as a reasonable
 * local decision — a 15px heading here, a Helvetica SVG label there. Nothing
 * catches that by review; it only shows up when you put every screen side by
 * side. So it is checked here instead.
 *
 * The rule is not "no new sizes". It is "new sizes are named in tokens.css and
 * used through a variable", so the scale stays visible in one file and a new
 * step is a deliberate act rather than a magic number in a rule nobody
 * revisits.
 */

const SRC = join(__dirname, '..');
const STYLES = join(SRC, 'styles');

function walk(dir: string, ext: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

const cssFiles = readdirSync(STYLES)
  .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
  .map((f) => join(STYLES, f));

const tsxFiles = walk(SRC, '.tsx').filter((f) => !f.includes('/test/'));

describe('type scale', () => {
  it('declares every font-size through a token', () => {
    const bad: string[] = [];
    for (const f of cssFiles) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        // clamp() is a deliberate fluid step and carries its own bounds.
        if (/font-size:\s*[\d.]+(px|rem|em)/.test(line) && !line.includes('clamp(')) {
          bad.push(`${f.split('/').pop()}:${i + 1}  ${line.trim()}`);
        }
      });
    }
    expect(bad, `Hardcoded font-size. Add a step to tokens.css and use var(--fs-*):\n${bad.join('\n')}`).toEqual([]);
  });

  it('declares every font-family through a token', () => {
    const bad: string[] = [];
    for (const f of cssFiles) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (/font-family:/.test(line) && !line.includes('var(--ff-')) {
          bad.push(`${f.split('/').pop()}:${i + 1}  ${line.trim()}`);
        }
      });
    }
    expect(bad, `Hardcoded font-family. Use var(--ff-display|body|mono):\n${bad.join('\n')}`).toEqual([]);
  });
});

describe('components', () => {
  it('never hardcodes a font family in SVG or inline styles', () => {
    const bad: string[] = [];
    for (const f of tsxFiles) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (/fontFamily/.test(line) && !line.includes('var(--ff-')) {
          bad.push(`${f.split('/src/')[1] ?? f}:${i + 1}  ${line.trim()}`);
        }
      });
    }
    expect(bad, `SVG chart labels are data and belong in the mono face:\n${bad.join('\n')}`).toEqual([]);
  });

  it('never sets an inline numeric fontSize in a style object', () => {
    // fontSize="9" as an SVG *attribute* is allowed — it is user units in a
    // viewBox, not CSS pixels. `style={{ fontSize: 9 }}` is CSS and is not.
    const bad: string[] = [];
    for (const f of tsxFiles) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (/fontSize:\s*['"]?[\d.]+['"]?\s*[,}]/.test(line) && !line.includes('var(--fs-')) {
          bad.push(`${f.split('/src/')[1] ?? f}:${i + 1}  ${line.trim()}`);
        }
      });
    }
    expect(bad, `Inline fontSize. Use a class or var(--fs-*):\n${bad.join('\n')}`).toEqual([]);
  });
});
