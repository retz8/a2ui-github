/**
 * Repro: the live agent's valid PR-detail surface (captured 2026-07-24) crashes at
 * render. Renders the exact payload through the real catalog WITHOUT the error
 * boundary so the true stack surfaces.
 */
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import {Providers} from '../providers';

const MESSAGES = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'pull-request-detail',
      catalogId:
        'https://github.com/retz8/a2ui-github/blob/main/primer-a2ui-adapter/catalogs/v0.9.1/catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'pull-request-detail',
      components: [
        {id: 'body-author', component: 'Text', text: {path: '/pull_request/user/login'}, weight: 'semibold'},
        {id: 'body-av', component: 'TimelineAvatar', child: 'body-avatar'},
        {id: 'body-avatar', component: 'Avatar', src: 'https://avatars.githubusercontent.com/u/583231?v=4', alt: {path: '/pull_request/user/login'}, size: 24},
        {id: 'body-badge', component: 'TimelineBadge', child: 'body-icon'},
        {id: 'body-content', component: 'TimelineBody', children: ['body-head', 'body-p1']},
        {id: 'body-head', component: 'Stack', direction: 'horizontal', gap: 'condensed', align: 'center', children: ['body-author', 'body-verb', 'body-time']},
        {id: 'body-icon', component: 'Icon', name: 'git-pull-request'},
        {id: 'body-item', component: 'TimelineItem', children: ['body-av', 'body-badge', 'body-content']},
        {id: 'body-p1', component: 'Text', text: {path: '/pull_request/body'}, as: 'p'},
        {id: 'body-time', component: 'RelativeTime', datetime: {path: '/pull_request/created_at'}, format: 'relative'},
        {id: 'body-verb', component: 'Text', text: 'opened this pull request'},
        {id: 'ct', component: 'PageLayout.Content', padding: 'normal', children: ['tl']},
        {id: 'hd', component: 'PageLayout.Header', divider: 'line', children: ['ph']},
        {id: 'label-token', component: 'IssueLabelToken', text: {path: 'name'}, fillColor: {path: 'color'}},
        {id: 'labels-group', component: 'LabelGroup', children: {componentId: 'label-token', path: '/pull_request/labels'}},
        {id: 'labels-head', component: 'Heading', text: 'Labels', as: 'h3', variant: 'small'},
        {id: 'meta', component: 'Stack', direction: 'vertical', gap: 'normal', children: ['reviewers-head', 'reviewers-list', 'labels-head', 'labels-group']},
        {id: 'ph', component: 'PageHeader', 'aria-label': 'Pull request header', children: ['ph-ta', 'ph-desc']},
        {id: 'ph-desc', component: 'PageHeader.Description', children: ['ph-state']},
        {id: 'ph-icon', component: 'Icon', name: 'git-pull-request', fill: 'open', accessibility: {label: 'Open pull request'}},
        {id: 'ph-lv', component: 'PageHeader.LeadingVisual', children: ['ph-icon']},
        {id: 'ph-state', component: 'StateLabel', status: 'pullOpened', text: {path: '/pull_request/state_label_text'}},
        {id: 'ph-ta', component: 'PageHeader.TitleArea', variant: 'large', children: ['ph-lv', 'ph-title']},
        {id: 'ph-title', component: 'PageHeader.Title', text: {path: '/pull_request/title_with_number'}, as: 'h1'},
        {id: 'pn', component: 'PageLayout.Pane', position: 'end', width: 'small', divider: 'line', children: ['meta']},
        {id: 'reviewer-avatar', component: 'Avatar', src: 'https://avatars.githubusercontent.com/u/583231?v=4', alt: {path: 'login'}},
        {id: 'reviewer-name', component: 'Text', text: {path: 'login'}, size: 'small', weight: 'semibold'},
        {id: 'reviewer-row', component: 'Stack', direction: 'horizontal', gap: 'condensed', align: 'center', children: ['reviewer-avatar', 'reviewer-name']},
        {id: 'reviewers-head', component: 'Heading', text: 'Reviewers', as: 'h3', variant: 'small'},
        {id: 'reviewers-list', component: 'Stack', direction: 'vertical', gap: 'condensed', children: {componentId: 'reviewer-row', path: '/pull_request/requested_reviewers'}},
        {id: 'root', component: 'PageLayout', padding: 'normal', columnGap: 'normal', header: 'hd', content: 'ct', pane: 'pn'},
        {id: 'tl', component: 'Timeline', children: ['body-item']},
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'pull-request-detail',
      path: '/',
      value: {
        pull_request: {
          title_with_number: 'feat(catalog): add SplitPageLayout to the v0.9.1 catalog #231',
          state_label_text: 'Open',
          user: {login: 'octo-maintainer'},
          created_at: '2026-07-18T09:12:44Z',
          body: 'Adds SplitPageLayout with a pane on the trailing side, matching Primer.',
          requested_reviewers: [{login: 'review-bot'}],
          labels: [
            {color: '0e8a16', name: 'catalog'},
            {color: 'd93f0b', name: 'needs-review'},
          ],
        },
      },
    },
  },
] as unknown as A2uiMessage[];

afterEach(cleanup);

describe('live PR-detail surface payload', () => {
  it('renders without crashing', () => {
    const processor = new MessageProcessor([CATALOG], () => {});
    processor.processMessages(MESSAGES);
    const surface = processor.model.surfacesMap.get('pull-request-detail');
    expect(surface).toBeDefined();
    render(
      <Providers>
        <A2uiSurface surface={surface!} />
      </Providers>,
    );
    expect(screen.getByText('octo-maintainer')).toBeInTheDocument();
  });
});
