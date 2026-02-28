import { createPublicClient, webSocket, type Address, type Log } from "viem";
import { gigavaultAbi, megaeth } from "@gigasite/shared";
import { env } from "../config/env.js";

type EventCallback = (eventName: string, log: Log) => void;

export function createChainListener(onEvent: EventCallback) {
  const client = createPublicClient({
    chain: megaeth,
    transport: webSocket(env.RPC_WSS_URL, {
      reconnect: { attempts: 10, delay: 1000 },
      keepAlive: { interval: 30_000 },
    }),
  });

  const contractAddress = env.CONTRACT_ADDRESS as Address;

  const unwatchFns: (() => void)[] = [];

  const watchEvent = (eventName: string) => {
    const unwatch = client.watchContractEvent({
      address: contractAddress,
      abi: gigavaultAbi,
      eventName: eventName as any,
      onLogs: (logs) => {
        for (const log of logs) {
          onEvent(eventName, log);
        }
      },
      onError: (error) => {
        console.error(`[chain-listener] Error watching ${eventName}:`, error.message);
      },
    });
    unwatchFns.push(unwatch);
  };

  const eventNames = [
    "Minted", "Redeemed", "Transfer",
    "LotteryWon", "PrizeClaimed", "BeneficiaryFunded",
    "AuctionStarted", "BidPlaced", "BidRefunded",
    "AuctionWon", "AuctionNoBids", "FeesDistributed",
    "UnclaimedPrizeExpired",
  ];

  for (const name of eventNames) {
    watchEvent(name);
  }

  console.log(`[chain-listener] Watching ${eventNames.length} events on ${contractAddress}`);

  return {
    cleanup() {
      for (const unwatch of unwatchFns) {
        unwatch();
      }
      console.log("[chain-listener] Stopped watching events");
    },
  };
}
