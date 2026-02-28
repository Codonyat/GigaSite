import { BigInt } from "@graphprotocol/graph-ts";
import {
  Minted,
  Redeemed,
  Transfer,
  LotteryWon,
  PrizeClaimed,
  BeneficiaryFunded,
  AuctionStarted,
  BidPlaced,
  BidRefunded,
  AuctionWon,
  AuctionNoBids,
  FeesDistributed,
  UnclaimedPrizeExpired,
  MaxSupplyLocked,
} from "../generated/GigaVault/GigaVault";
import {
  Transaction,
  LotteryDraw,
  AuctionRound,
  Bid,
} from "../generated/schema";
import {
  ZERO_BI,
  ZERO_ADDRESS,
  FEES_POOL,
  LOT_POOL,
  getDayFromTimestamp,
  getOrCreateUser,
  getOrCreateProtocolStats,
  getOrCreateDailyMetric,
} from "./helpers";

export function handleMinted(event: Minted): void {
  let txId =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();
  let day = getDayFromTimestamp(event.block.timestamp);

  let tx = new Transaction(txId);
  tx.type = "MINT";
  tx.user = event.params.to.toHexString();
  tx.collateralAmount = event.params.collateralAmount;
  tx.tokenAmount = event.params.tokenAmount;
  tx.fee = event.params.fee;
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.day = day;
  tx.save();

  let user = getOrCreateUser(event.params.to);
  user.totalMinted = user.totalMinted.plus(event.params.tokenAmount);
  user.totalFeesPaid = user.totalFeesPaid.plus(event.params.fee);
  user.mintCount = user.mintCount + 1;
  user.save();

  let stats = getOrCreateProtocolStats();
  stats.totalSupplyMinted = stats.totalSupplyMinted.plus(
    event.params.tokenAmount
  );
  stats.totalFeesCollected = stats.totalFeesCollected.plus(event.params.fee);
  stats.save();

  let daily = getOrCreateDailyMetric(day);
  daily.mintVolume = daily.mintVolume.plus(event.params.tokenAmount);
  daily.feesCollected = daily.feesCollected.plus(event.params.fee);
  daily.transactionCount = daily.transactionCount + 1;
  daily.save();
}

export function handleRedeemed(event: Redeemed): void {
  let txId =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();
  let day = getDayFromTimestamp(event.block.timestamp);

  let tx = new Transaction(txId);
  tx.type = "REDEEM";
  tx.user = event.params.from.toHexString();
  tx.collateralAmount = event.params.collateralAmount;
  tx.tokenAmount = event.params.tokenAmount;
  tx.fee = event.params.fee;
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.day = day;
  tx.save();

  let user = getOrCreateUser(event.params.from);
  user.totalRedeemed = user.totalRedeemed.plus(event.params.tokenAmount);
  user.totalFeesPaid = user.totalFeesPaid.plus(event.params.fee);
  user.redeemCount = user.redeemCount + 1;
  user.save();

  let stats = getOrCreateProtocolStats();
  stats.totalSupplyBurned = stats.totalSupplyBurned.plus(
    event.params.tokenAmount
  );
  stats.totalFeesCollected = stats.totalFeesCollected.plus(event.params.fee);
  stats.save();

  let daily = getOrCreateDailyMetric(day);
  daily.redeemVolume = daily.redeemVolume.plus(event.params.tokenAmount);
  daily.feesCollected = daily.feesCollected.plus(event.params.fee);
  daily.transactionCount = daily.transactionCount + 1;
  daily.save();
}

export function handleTransfer(event: Transfer): void {
  // Filter out mint/burn (zero address) and pool address transfers
  if (
    event.params.from.equals(ZERO_ADDRESS) ||
    event.params.to.equals(ZERO_ADDRESS) ||
    event.params.from.equals(FEES_POOL) ||
    event.params.to.equals(FEES_POOL) ||
    event.params.from.equals(LOT_POOL) ||
    event.params.to.equals(LOT_POOL)
  ) {
    return;
  }

  let txId =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();
  let day = getDayFromTimestamp(event.block.timestamp);

  let tx = new Transaction(txId);
  tx.type = "TRANSFER";
  tx.user = event.params.from.toHexString();
  tx.collateralAmount = ZERO_BI;
  tx.tokenAmount = event.params.value;
  tx.fee = ZERO_BI;
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.day = day;
  tx.save();

  let daily = getOrCreateDailyMetric(day);
  daily.transactionCount = daily.transactionCount + 1;
  daily.save();
}

export function handleLotteryWon(event: LotteryWon): void {
  let dayStr = event.params.day.toString();

  let draw = new LotteryDraw(dayStr);
  draw.winner = event.params.winner.toHexString();
  draw.amount = event.params.amount;
  draw.claimed = false;
  draw.claimTimestamp = null;
  draw.expired = false;
  draw.beneficiaryAmount = null;
  draw.lotteryShare = ZERO_BI;
  draw.auctionShare = ZERO_BI;
  draw.save();

  let user = getOrCreateUser(event.params.winner);
  user.lotteryWinCount = user.lotteryWinCount + 1;
  user.totalLotteryWinnings = user.totalLotteryWinnings.plus(
    event.params.amount
  );
  user.save();

  let stats = getOrCreateProtocolStats();
  stats.lotteryCount = stats.lotteryCount + 1;
  stats.totalLotteryPrizes = stats.totalLotteryPrizes.plus(
    event.params.amount
  );
  stats.save();

  let daily = getOrCreateDailyMetric(event.params.day);
  daily.lotteryPrize = daily.lotteryPrize.plus(event.params.amount);
  daily.save();
}

export function handlePrizeClaimed(event: PrizeClaimed): void {
  let user = getOrCreateUser(event.params.winner);
  user.totalClaimed = user.totalClaimed.plus(event.params.amount);
  user.save();
}

export function handleBeneficiaryFunded(event: BeneficiaryFunded): void {
  // No-op: covered by UnclaimedPrizeExpired
}

export function handleAuctionStarted(event: AuctionStarted): void {
  let dayStr = event.params.day.toString();

  let round = new AuctionRound(dayStr);
  round.tokenAmount = event.params.tokenAmount;
  round.minBid = event.params.minBid;
  round.winner = null;
  round.winningBid = null;
  round.noBids = false;
  round.rolledOverAmount = null;
  round.claimed = false;
  round.bidCount = 0;
  round.save();

  let stats = getOrCreateProtocolStats();
  stats.auctionCount = stats.auctionCount + 1;
  stats.save();
}

export function handleBidPlaced(event: BidPlaced): void {
  let txId =
    event.transaction.hash.toHexString() +
    "-" +
    event.logIndex.toString();
  let dayStr = event.params.day.toString();

  let bid = new Bid(txId);
  bid.round = dayStr;
  bid.bidder = event.params.bidder.toHexString();
  bid.amount = event.params.amount;
  bid.timestamp = event.block.timestamp;
  bid.refunded = false;
  bid.save();

  let round = AuctionRound.load(dayStr);
  if (round != null) {
    round.bidCount = round.bidCount + 1;
    round.save();
  }

  let user = getOrCreateUser(event.params.bidder);
  user.bidCount = user.bidCount + 1;
  user.save();

  let stats = getOrCreateProtocolStats();
  stats.totalBids = stats.totalBids + 1;
  stats.save();

  let daily = getOrCreateDailyMetric(event.params.day);
  daily.bidCount = daily.bidCount + 1;
  if (event.params.amount.gt(daily.highestBid)) {
    daily.highestBid = event.params.amount;
  }
  daily.save();
}

export function handleBidRefunded(event: BidRefunded): void {
  // No-op: refund status inferred (any non-winning bid was refunded)
}

export function handleAuctionWon(event: AuctionWon): void {
  let dayStr = event.params.day.toString();

  let round = AuctionRound.load(dayStr);
  if (round != null) {
    round.winner = event.params.winner.toHexString();
    round.winningBid = event.params.collateralPaid;
    round.save();
  }

  let user = getOrCreateUser(event.params.winner);
  user.auctionWinCount = user.auctionWinCount + 1;
  user.save();

  let stats = getOrCreateProtocolStats();
  stats.totalAuctionPrizes = stats.totalAuctionPrizes.plus(
    event.params.tokenAmount
  );
  stats.save();

  let daily = getOrCreateDailyMetric(event.params.day);
  daily.auctionPrize = daily.auctionPrize.plus(event.params.tokenAmount);
  daily.save();
}

export function handleAuctionNoBids(event: AuctionNoBids): void {
  let dayStr = event.params.day.toString();

  let round = AuctionRound.load(dayStr);
  if (round != null) {
    round.noBids = true;
    round.rolledOverAmount = event.params.rolledOverAmount;
    round.save();
  }
}

export function handleFeesDistributed(event: FeesDistributed): void {
  let dayStr = event.params.day.toString();

  let draw = LotteryDraw.load(dayStr);
  if (draw != null) {
    draw.lotteryShare = event.params.lotteryShare;
    draw.auctionShare = event.params.auctionShare;
    draw.save();
  }
}

export function handleUnclaimedPrizeExpired(
  event: UnclaimedPrizeExpired
): void {
  let dayStr = event.params.day.toString();

  if (event.params.isLottery) {
    let draw = LotteryDraw.load(dayStr);
    if (draw != null) {
      draw.expired = true;
      draw.save();
    }
  } else {
    let round = AuctionRound.load(dayStr);
    if (round != null) {
      round.claimed = false;
      round.save();
    }
  }
}

export function handleMaxSupplyLocked(event: MaxSupplyLocked): void {
  // No-op: max supply available via contract state reads
}
