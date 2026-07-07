import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
// Primer functional color tokens (--fgColor-*, etc.). ThemeProvider sets the
// data-color-mode/-theme attributes these are scoped to, but the custom properties
// themselves ship as CSS in @primer/primitives and must be imported. Icon's `fill`
// roles resolve to var(--fgColor-<role>), so without these they compute to black.
import '@primer/primitives/dist/css/functional/themes/light.css';
import '@primer/primitives/dist/css/functional/themes/dark.css';
import {App} from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
