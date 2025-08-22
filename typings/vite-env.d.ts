/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_STH: never
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
