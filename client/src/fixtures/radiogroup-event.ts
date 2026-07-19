import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction (event path) + bound `disabled` (the agent-visibility coupling). The group's `action`
 * emits an `event` (`select`, context `{}`) on any selection; the deterministic agent acknowledges
 * and locks the group by writing `/locked = true`. The group's `disabled` is bound to `/locked`
 * (initial `false`), so the server's write is what disables the group — the half that proves two-way
 * data binding on the RadioGroup itself (mirroring Button's `disabled <- /submitted`).
 *
 * The surface root (id `root`) is a `Stack` hosting `[group, status]`. The `status` Text is the
 * agent's self-visible surface (swapped by the `select` response's updateComponents); the Stack root
 * renders it alongside the bound-`disabled` resolution on the group.
 */
export const radiogroupEventFixture: Fixture = {
  name: 'radiogroup-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['group', 'status']},
          {
            id: 'group',
            component: 'RadioGroup',
            name: 'choices',
            disabled: {path: '/locked'},
            action: {event: {name: 'select', context: {}}},
            children: ['rg-label', 'fc-one', 'fc-two'],
          },
          {id: 'rg-label', component: 'RadioGroupLabel', text: 'Choices'},
          {
            id: 'fc-one',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['radio-one', 'lbl-one'],
          },
          {id: 'radio-one', component: 'Radio', value: 'one'},
          {id: 'lbl-one', component: 'FormControlLabel', text: 'Choice one'},
          {
            id: 'fc-two',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['radio-two', 'lbl-two'],
          },
          {id: 'radio-two', component: 'Radio', value: 'two'},
          {id: 'lbl-two', component: 'FormControlLabel', text: 'Choice two'},
          {id: 'status', component: 'Text', text: 'Select an option'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'radiogroup-event', path: '/', value: {locked: false}},
    },
  ],
};
