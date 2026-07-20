import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuWidthXlargeFixture: Fixture = menuFixture('actionmenu-width-xlarge', {
  open: true,
  overlayProps: {width: 'xlarge'},
});
