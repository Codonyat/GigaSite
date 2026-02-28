import { createPublicClient, http, type Address } from "viem";
import { megaeth, gigavaultAbi } from "@gigasite/shared";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS as Address;
if (!CONTRACT_ADDRESS) {
  console.error("VITE_CONTRACT_ADDRESS not set");
  process.exit(1);
}

const RPC_URL = process.env.RPC_URL || "https://rpc.megaeth.com";

async function main() {
  const client = createPublicClient({
    chain: megaeth,
    transport: http(RPC_URL),
  });

  const [deploymentTime, mintingEndTime, oneDayEndTime] = await Promise.all([
    client.readContract({ address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "deploymentTime" }),
    client.readContract({ address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "mintingEndTime" }),
    client.readContract({ address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "oneDayEndTime" }),
  ]);

  const constants = {
    deploymentTime: Number(deploymentTime),
    mintingEndTime: Number(mintingEndTime),
    oneDayEndTime: Number(oneDayEndTime),
    fetchedAt: new Date().toISOString(),
  };

  const outPath = resolve(import.meta.dirname, "../src/config/contract-constants.json");
  writeFileSync(outPath, JSON.stringify(constants, null, 2));
  console.log("Wrote contract constants to", outPath);
  console.log(constants);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
