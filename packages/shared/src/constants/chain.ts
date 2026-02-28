import { defineChain } from "viem";

export const megaeth = defineChain({
  id: 6342,
  name: "MegaETH",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.megaeth.com"] },
  },
  blockExplorers: {
    default: { name: "MegaExplorer", url: "https://megaexplorer.xyz" },
  },
});
