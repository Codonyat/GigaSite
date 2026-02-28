export interface SubgraphTransaction {
  id: string;
  type: "MINT" | "REDEEM" | "TRANSFER";
  user: string;
  collateralAmount: string;
  tokenAmount: string;
  fee: string;
  timestamp: string;
  txHash: string;
  day: string;
}

export interface SubgraphLotteryDraw {
  id: string;
  winner: string;
  amount: string;
  claimed: boolean;
  claimTimestamp: string | null;
  expired: boolean;
  beneficiaryAmount: string | null;
  lotteryShare: string;
  auctionShare: string;
}

export interface SubgraphAuctionRound {
  id: string;
  tokenAmount: string;
  minBid: string;
  winner: string | null;
  winningBid: string | null;
  noBids: boolean;
  rolledOverAmount: string | null;
  claimed: boolean;
  bidCount: number;
}

export interface SubgraphBid {
  id: string;
  bidder: string;
  amount: string;
  timestamp: string;
  refunded: boolean;
}

export interface SubgraphUser {
  id: string;
  totalMinted: string;
  totalRedeemed: string;
  totalFeesPaid: string;
  mintCount: number;
  redeemCount: number;
  lotteryWinCount: number;
  totalLotteryWinnings: string;
  auctionWinCount: number;
  bidCount: number;
  totalClaimed: string;
}

export interface SubgraphProtocolStats {
  id: string;
  totalSupplyMinted: string;
  totalSupplyBurned: string;
  totalFeesCollected: string;
  totalLotteryPrizes: string;
  totalAuctionPrizes: string;
  lotteryCount: number;
  auctionCount: number;
  totalBids: number;
}

export interface SubgraphDailyMetric {
  id: string;
  day: string;
  mintVolume: string;
  redeemVolume: string;
  feesCollected: string;
  lotteryPrize: string;
  auctionPrize: string;
  bidCount: number;
  highestBid: string;
  transactionCount: number;
}
