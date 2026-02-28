import { createPublicClient, http, type Address } from "viem";
import { gigavaultAbi, FEES_POOL, megaeth } from "@gigasite/shared";
import type { StatsResponse } from "@gigasite/shared";
import { TTLCache } from "./cache.js";
import { env } from "../config/env.js";

const CACHE_TTL = 15_000; // 15 seconds
const cache = new TTLCache<StatsResponse>();

const client = createPublicClient({
  chain: megaeth,
  transport: http(env.RPC_URL),
});

const contractAddress = env.CONTRACT_ADDRESS as Address;

export async function getStats(): Promise<StatsResponse> {
  const cached = cache.get("stats");
  if (cached) return cached;

  const [
    totalSupply,
    maxSupplyEver,
    reserve,
    currentDay,
    feesPoolBalance,
    lotteryPool,
    holderCount,
    escrowedBid,
    currentAuction,
    lastLotteryDay,
    deploymentTime,
    mintingEndTime,
  ] = await Promise.all([
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "totalSupply" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "maxSupplyEver" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "getReserve" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "getCurrentDay" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "balanceOf", args: [FEES_POOL] }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "currentLotteryPool" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "getHolderCount" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "escrowedBid" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "currentAuction" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "lastLotteryDay" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "deploymentTime" }),
    client.readContract({ address: contractAddress, abi: gigavaultAbi, functionName: "mintingEndTime" }),
  ]);

  const nowSeconds = Math.floor(Date.now() / 1000);
  const isMintingPeriod = BigInt(nowSeconds) <= mintingEndTime;

  // currentAuction returns: [currentBidder, currentBid, minBid, auctionTokens, auctionDay]
  const [bidder, bid, minBid, auctionTokens, auctionDay] = currentAuction;
  const currentDayNum = Number(currentDay);
  const isAuctionActive = auctionTokens > 0n && auctionDay >= currentDayNum - 1;

  const effectiveMinBid = bid === 0n ? minBid : (bid * 110n) / 100n;

  let backingRatio = "1.0000";
  if (totalSupply > 0n) {
    const ratio = (reserve * 10000n) / totalSupply;
    const whole = ratio / 10000n;
    const frac = ratio % 10000n;
    backingRatio = `${whole}.${String(frac).padStart(4, "0")}`;
  }

  const stats: StatsResponse = {
    totalSupply: totalSupply.toString(),
    maxSupplyEver: maxSupplyEver.toString(),
    reserve: reserve.toString(),
    currentDay: currentDayNum,
    feesPoolBalance: feesPoolBalance.toString(),
    lotteryPool: lotteryPool.toString(),
    holderCount: Number(holderCount),
    escrowedBid: escrowedBid.toString(),
    currentAuction: {
      currentBidder: bidder,
      currentBid: bid.toString(),
      minBid: minBid.toString(),
      auctionTokens: auctionTokens.toString(),
      auctionDay: Number(auctionDay),
    },
    lastLotteryDay: Number(lastLotteryDay),
    backingRatio,
    isMintingPeriod,
    isAuctionActive,
    effectiveMinBid: effectiveMinBid.toString(),
    timestamp: nowSeconds,
  };

  cache.set("stats", stats, CACHE_TTL);
  return stats;
}
