import { IS_TESTNET } from "@/constant/Network.ts";

export const CKB_EXPLORER = IS_TESTNET
  ? "https://testnet.explorer.nervos.org"
  : "https://explorer.nervos.org"

export const ETHEREUM_EXPLORER = IS_TESTNET ? "https://sepolia.etherscan.io/" : "https://etherscan.io"
