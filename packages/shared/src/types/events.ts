export interface MintedEvent {
  type: "Minted";
  to: `0x${string}`;
  collateralAmount: bigint;
  tokenAmount: bigint;
  fee: bigint;
}

export interface RedeemedEvent {
  type: "Redeemed";
  from: `0x${string}`;
  tokenAmount: bigint;
  collateralAmount: bigint;
  fee: bigint;
}

export interface LotteryWonEvent {
  type: "LotteryWon";
  winner: `0x${string}`;
  amount: bigint;
  day: bigint;
}

export interface PrizeClaimedEvent {
  type: "PrizeClaimed";
  winner: `0x${string}`;
  amount: bigint;
}

export interface BeneficiaryFundedEvent {
  type: "BeneficiaryFunded";
  beneficiary: `0x${string}`;
  amount: bigint;
  previousWinner: `0x${string}`;
}

export interface AuctionStartedEvent {
  type: "AuctionStarted";
  day: bigint;
  tokenAmount: bigint;
  minBid: bigint;
}

export interface BidPlacedEvent {
  type: "BidPlaced";
  bidder: `0x${string}`;
  amount: bigint;
  day: bigint;
}

export interface BidRefundedEvent {
  type: "BidRefunded";
  bidder: `0x${string}`;
  amount: bigint;
}

export interface AuctionWonEvent {
  type: "AuctionWon";
  winner: `0x${string}`;
  tokenAmount: bigint;
  collateralPaid: bigint;
  day: bigint;
}

export interface AuctionNoBidsEvent {
  type: "AuctionNoBids";
  day: bigint;
  rolledOverAmount: bigint;
}

export interface FeesDistributedEvent {
  type: "FeesDistributed";
  day: bigint;
  lotteryShare: bigint;
  auctionShare: bigint;
}

export interface MaxSupplyLockedEvent {
  type: "MaxSupplyLocked";
  maxSupply: bigint;
}

export interface UnclaimedPrizeExpiredEvent {
  type: "UnclaimedPrizeExpired";
  previousWinner: `0x${string}`;
  amount: bigint;
  day: bigint;
  slot: bigint;
  isLottery: boolean;
}

export type GigaVaultEvent =
  | MintedEvent
  | RedeemedEvent
  | LotteryWonEvent
  | PrizeClaimedEvent
  | BeneficiaryFundedEvent
  | AuctionStartedEvent
  | BidPlacedEvent
  | BidRefundedEvent
  | AuctionWonEvent
  | AuctionNoBidsEvent
  | FeesDistributedEvent
  | MaxSupplyLockedEvent
  | UnclaimedPrizeExpiredEvent;
