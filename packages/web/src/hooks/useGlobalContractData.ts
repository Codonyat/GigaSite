import { useState, useEffect, useCallback, useMemo } from "react";
import type { GlobalContractData, StatsResponse } from "@gigasite/shared";
import { SERVER_URL } from "../config/contract";

const POLLING_INTERVAL = 15_000;

function parseStats(data: StatsResponse): GlobalContractData {
  const currentBid = BigInt(data.currentAuction.currentBid);
  const storedMinBid = BigInt(data.currentAuction.minBid);
  const effectiveMinBid = currentBid === 0n ? storedMinBid : (currentBid * 110n) / 100n;

  return {
    totalSupply: BigInt(data.totalSupply),
    maxSupplyEver: BigInt(data.maxSupplyEver),
    reserve: BigInt(data.reserve),
    currentDay: data.currentDay,
    feesPoolBalance: BigInt(data.feesPoolBalance),
    lotteryPool: BigInt(data.lotteryPool),
    holderCount: data.holderCount,
    escrowedBid: BigInt(data.escrowedBid),
    currentAuction: {
      currentBidder: data.currentAuction.currentBidder as `0x${string}`,
      currentBid,
      minBid: storedMinBid,
      auctionTokens: BigInt(data.currentAuction.auctionTokens),
      auctionDay: data.currentAuction.auctionDay,
    },
    lastLotteryDay: data.lastLotteryDay,
    backingRatio: data.backingRatio,
    isMintingPeriod: data.isMintingPeriod,
    isAuctionActive: data.isAuctionActive,
    effectiveMinBid,
    timestamp: data.timestamp,
  };
}

export function useGlobalContractData() {
  const [data, setData] = useState<GlobalContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StatsResponse = await res.json();
      setData(parseStats(json));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const tvl = useMemo(() => {
    if (!data) return 0n;
    return data.reserve;
  }, [data]);

  return { data, isLoading, error, refetch: fetchStats, tvl };
}
