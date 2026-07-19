import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {DevApp} from './test-space/DevApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevApp />
  </StrictMode>,
);
