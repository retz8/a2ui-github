import type {Fixture} from '../fixtures';

/**
 * A curated agent knowledge example: structurally a {@link Fixture} (a `name` + canned A2UI v0.9
 * `messages`) plus the natural-language `intent` that produced it. The `name` is the kebab id, both
 * shown in the selector and used as the `?example=` URL value; the `intent` is shown as a caption
 * above the rendered surface so the request can be read against its resulting UI.
 */
export interface Example extends Fixture {
  intent: string;
}

// Single source of truth: the curated examples live in the sibling `agent/knowledge/examples/`
// subproject (outside the yarn workspace). `import.meta.glob(..., {eager: true})` bundles that JSON
// at build (production) and transforms it under Vitest — no copy or sync step, so this page
// auto-reflects any example the agent adds or edits. 7.8 is a read-only consumer of that corpus.
const modules = import.meta.glob<{default: Example}>('../../../agent/knowledge/examples/*.json', {
  eager: true,
});

/** Every bundled example, sorted by `name` for a stable selector order. */
export const EXAMPLES: Example[] = Object.values(modules)
  .map(m => m.default)
  .sort((a, b) => a.name.localeCompare(b.name));

/** Resolve a `?example=` name to its example, falling back to the first for an unknown name. */
export function getExample(name: string | null): Example {
  return EXAMPLES.find(e => e.name === name) ?? EXAMPLES[0];
}
