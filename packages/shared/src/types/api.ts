export interface StatsResponse {
  totalSupply: string;
  maxSupplyEver: string;
  reserve: string;
  currentDay: number;
  feesPoolBalance: string;
  lotteryPool: string;
  holderCount: number;
  escrowedBid: string;
  currentAuction: {
    currentBidder: string;
    currentBid: string;
    minBid: string;
    auctionTokens: string;
    auctionDay: number;
  };
  lastLotteryDay: number;
  backingRatio: string;
  isMintingPeriod: boolean;
  isAuctionActive: boolean;
  effectiveMinBid: string;
  timestamp: number;
}

export interface PriceResponse {
  usdm: number;
  timestamp: number;
}

export interface WebSocketTransaction {
  id: string;
  type: "MINT" | "REDEEM" | "TRANSFER" | "BID";
  user: string;
  tokenAmount?: string;
  collateralAmount?: string;
  fee?: string;
  txHash: string;
  timestamp: number;
}

export interface WebSocketLotteryWon {
  winner: string;
  amount: string;
  day: number;
}

export interface WebSocketAuctionWon {
  winner: string;
  tokenAmount: string;
  collateralPaid: string;
  day: number;
}

export interface WebSocketBidPlaced {
  bidder: string;
  amount: string;
  day: number;
}

export interface WebSocketDayChanged {
  newDay: number;
  timestamp: number;
}
