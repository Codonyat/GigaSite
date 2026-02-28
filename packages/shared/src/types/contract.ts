export interface Auction {
  currentBidder: `0x${string}`;
  currentBid: bigint;
  minBid: bigint;
  auctionTokens: bigint;
  auctionDay: number;
}

export interface UnclaimedPrize {
  winner: `0x${string}`;
  amount: bigint;
}

export interface GlobalContractData {
  totalSupply: bigint;
  maxSupplyEver: bigint;
  reserve: bigint;
  currentDay: number;
  feesPoolBalance: bigint;
  lotteryPool: bigint;
  holderCount: number;
  escrowedBid: bigint;
  currentAuction: Auction;
  lastLotteryDay: number;
  backingRatio: string;
  isMintingPeriod: boolean;
  isAuctionActive: boolean;
  effectiveMinBid: bigint;
  timestamp: number;
}

export interface UserData {
  usdmoreBalance: bigint;
  usdmyBalance: bigint;
  usdmBalance: bigint;
  usdmyAllowance: bigint;
  usdmAllowance: bigint;
  claimableAmount: bigint;
  unclaimedPrizes: {
    lotteryWinners: readonly `0x${string}`[];
    lotteryAmounts: readonly bigint[];
    auctionWinners: readonly `0x${string}`[];
    auctionAmounts: readonly bigint[];
  };
}
