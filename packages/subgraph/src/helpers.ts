import { BigInt, Address } from "@graphprotocol/graph-ts";
import { User, ProtocolStats, DailyMetric } from "../generated/schema";

export const ZERO_BI = BigInt.fromI32(0);
export const PROTOCOL_STATS_ID = "protocol";
export const PSEUDO_DAY_SECONDS = BigInt.fromI32(90000);

// TODO: Replace with actual deploymentTime() value from contract
export const DEPLOYMENT_TIME = BigInt.fromI32(0);

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
export const FEES_POOL = Address.fromString(
  "0x00000000000fee50000000AdD2E5500000000000"
);
export const LOT_POOL = Address.fromString(
  "0x0000000000010700000000aDD2E5500000000000"
);

export function getDayFromTimestamp(timestamp: BigInt): BigInt {
  return timestamp.minus(DEPLOYMENT_TIME).div(PSEUDO_DAY_SECONDS);
}

export function getOrCreateUser(address: Address): User {
  let id = address.toHexString();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
    user.totalMinted = ZERO_BI;
    user.totalRedeemed = ZERO_BI;
    user.totalFeesPaid = ZERO_BI;
    user.mintCount = 0;
    user.redeemCount = 0;
    user.lotteryWinCount = 0;
    user.totalLotteryWinnings = ZERO_BI;
    user.auctionWinCount = 0;
    user.bidCount = 0;
    user.totalClaimed = ZERO_BI;
    user.save();
  }
  return user;
}

export function getOrCreateProtocolStats(): ProtocolStats {
  let stats = ProtocolStats.load(PROTOCOL_STATS_ID);
  if (stats == null) {
    stats = new ProtocolStats(PROTOCOL_STATS_ID);
    stats.totalSupplyMinted = ZERO_BI;
    stats.totalSupplyBurned = ZERO_BI;
    stats.totalFeesCollected = ZERO_BI;
    stats.totalLotteryPrizes = ZERO_BI;
    stats.totalAuctionPrizes = ZERO_BI;
    stats.lotteryCount = 0;
    stats.auctionCount = 0;
    stats.totalBids = 0;
    stats.save();
  }
  return stats;
}

export function getOrCreateDailyMetric(day: BigInt): DailyMetric {
  let id = day.toString();
  let metric = DailyMetric.load(id);
  if (metric == null) {
    metric = new DailyMetric(id);
    metric.day = day;
    metric.mintVolume = ZERO_BI;
    metric.redeemVolume = ZERO_BI;
    metric.feesCollected = ZERO_BI;
    metric.lotteryPrize = ZERO_BI;
    metric.auctionPrize = ZERO_BI;
    metric.bidCount = 0;
    metric.highestBid = ZERO_BI;
    metric.transactionCount = 0;
    metric.save();
  }
  return metric;
}
