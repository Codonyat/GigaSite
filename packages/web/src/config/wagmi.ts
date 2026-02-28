import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { megaeth } from "@gigasite/shared";

const serverUrl = import.meta.env.VITE_SERVER_URL || "";

export const wagmiConfig = getDefaultConfig({
  appName: "GigaVault",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "placeholder",
  chains: [megaeth],
  transports: {
    [megaeth.id]: http(`${serverUrl}/api/rpc`),
  },
});
