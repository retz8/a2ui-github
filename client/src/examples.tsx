import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ExamplesApp} from './examples-space/ExamplesApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplesApp />
  </StrictMode>,
);
