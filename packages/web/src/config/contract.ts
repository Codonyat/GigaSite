import type { Address } from "viem";

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as Address;
export const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL || "https://megaexplorer.xyz";
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

export function getExplorerTxUrl(txHash: string): string {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}`;
}
