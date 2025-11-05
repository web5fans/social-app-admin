export const NETWORK = import.meta.env.VITE_NETWORK
export const CDN_HOST = import.meta.env.VITE_CDN_HOST

export const IS_TESTNET = NETWORK === 'testnet'

export const IS_MAINNET = NETWORK === 'mainnet'
