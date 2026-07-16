import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';

/** A surface component object: a component name + id, plus arbitrary A2UI props. */
export type Comp = {id: string; component: string; [k: string]: unknown};

/** One surface: a createSurface + updateComponents (and an optional initial data model). */
export function surface(surfaceId: string, components: Comp[], dataModel?: unknown): A2uiMessage[] {
  const messages: A2uiMessage[] = [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {version: 'v0.9', updateComponents: {surfaceId, components}},
  ];
  if (dataModel !== undefined) {
    messages.push({version: 'v0.9', updateDataModel: {surfaceId, path: '/', value: dataModel}});
  }
  return messages;
}

/** The root `PageLayout` (always `id: 'root'`), wired to the given region slots plus extra props. */
export function root(
  slots: Partial<Record<'header' | 'content' | 'pane' | 'sidebar' | 'footer', string>>,
  props: Record<string, unknown> = {},
): Comp {
  return {id: 'root', component: 'PageLayout', ...slots, ...props};
}

/** A `PageLayout.Header` region (id `h`) filled with a `Heading`. */
export function headerRegion(props: Record<string, unknown> = {}, id = 'h'): Comp[] {
  return [
    {id, component: 'PageLayout.Header', children: [`${id}-title`], ...props},
    {id: `${id}-title`, component: 'Heading', text: 'Repositories'},
  ];
}

/** A `PageLayout.Content` region (id `c`) filled with a `Stack` of three `Text`. */
export function contentRegion(props: Record<string, unknown> = {}, id = 'c'): Comp[] {
  const labels = ['Overview', 'Recent activity', 'Insights'];
  const textIds = labels.map((_, i) => `${id}-t${i + 1}`);
  return [
    {id, component: 'PageLayout.Content', children: [`${id}-stack`], ...props},
    {id: `${id}-stack`, component: 'Stack', children: textIds},
    ...labels.map((text, i) => ({id: textIds[i], component: 'Text', text})),
  ];
}

/** A `PageLayout.Pane` region (id `p`) filled with a `Stack` of three `Link`. */
export function paneRegion(props: Record<string, unknown> = {}, id = 'p'): Comp[] {
  const labels = ['Issues', 'Pull requests', 'Actions'];
  const linkIds = labels.map((_, i) => `${id}-l${i + 1}`);
  return [
    {id, component: 'PageLayout.Pane', children: [`${id}-stack`], ...props},
    {id: `${id}-stack`, component: 'Stack', children: linkIds},
    ...labels.map((text, i) => ({
      id: linkIds[i],
      component: 'Link',
      text,
      href: 'https://github.com',
    })),
  ];
}

/** A `PageLayout.Sidebar` region (id `s`) filled with a `Stack` of three `Link`. */
export function sidebarRegion(props: Record<string, unknown> = {}, id = 's'): Comp[] {
  const labels = ['Code', 'Issues', 'Settings'];
  const linkIds = labels.map((_, i) => `${id}-l${i + 1}`);
  return [
    {id, component: 'PageLayout.Sidebar', children: [`${id}-stack`], ...props},
    {id: `${id}-stack`, component: 'Stack', children: linkIds},
    ...labels.map((text, i) => ({
      id: linkIds[i],
      component: 'Link',
      text,
      href: 'https://github.com',
    })),
  ];
}

/** A `PageLayout.Footer` region (id `f`) filled with a `Text`. */
export function footerRegion(props: Record<string, unknown> = {}, id = 'f'): Comp[] {
  return [
    {id, component: 'PageLayout.Footer', children: [`${id}-text`], ...props},
    {id: `${id}-text`, component: 'Text', text: '© 2026 Example'},
  ];
}
