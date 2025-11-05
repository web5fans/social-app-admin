/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: 'testnet' | 'mainnet'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
