import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuHeightXlargeFixture: Fixture = menuFixture('actionmenu-height-xlarge', {
  open: true,
  overlayProps: {height: 'xlarge'},
});
