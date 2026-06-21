/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_A2A_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
