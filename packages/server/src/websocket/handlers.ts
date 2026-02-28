import type { Log } from "viem";
import type { Server } from "socket.io";
import type { WebSocketTransaction } from "@gigasite/shared";
import { FEES_POOL } from "@gigasite/shared";

const recentTransactions: WebSocketTransaction[] = [];
const MAX_CACHE_SIZE = 50;

function addTransaction(tx: WebSocketTransaction) {
  recentTransactions.unshift(tx);
  if (recentTransactions.length > MAX_CACHE_SIZE) {
    recentTransactions.length = MAX_CACHE_SIZE;
  }
}

export function getRecentTransactions(limit: number = 10): WebSocketTransaction[] {
  return recentTransactions.slice(0, limit);
}

export function handleContractEvent(io: Server, eventName: string, log: Log) {
  const args = (log as any).args;
  const txHash = log.transactionHash ?? "0x";
  const timestamp = Math.floor(Date.now() / 1000);

  switch (eventName) {
    case "Minted": {
      const tx: WebSocketTransaction = {
        id: `${txHash}-${log.logIndex}`,
        type: "MINT",
        user: args.to,
        tokenAmount: args.tokenAmount?.toString(),
        collateralAmount: args.collateralAmount?.toString(),
        fee: args.fee?.toString(),
        txHash,
        timestamp,
      };
      addTransaction(tx);
      io.emit("newTransaction", tx);
      break;
    }
    case "Redeemed": {
      const tx: WebSocketTransaction = {
        id: `${txHash}-${log.logIndex}`,
        type: "REDEEM",
        user: args.from,
        tokenAmount: args.tokenAmount?.toString(),
        collateralAmount: args.collateralAmount?.toString(),
        fee: args.fee?.toString(),
        txHash,
        timestamp,
      };
      addTransaction(tx);
      io.emit("newTransaction", tx);
      break;
    }
    case "Transfer": {
      // Only broadcast transfers to FEES_POOL (fee transfers from user actions)
      if (args.to?.toLowerCase() === FEES_POOL.toLowerCase()) {
        // Skip mint-related fee transfers (from === 0x0)
        if (args.from === "0x0000000000000000000000000000000000000000") break;
        const tx: WebSocketTransaction = {
          id: `${txHash}-${log.logIndex}`,
          type: "TRANSFER",
          user: args.from,
          fee: args.value?.toString(),
          txHash,
          timestamp,
        };
        addTransaction(tx);
        io.emit("newTransaction", tx);
      }
      break;
    }
    case "LotteryWon": {
      io.emit("lotteryWon", {
        winner: args.winner,
        amount: args.amount?.toString(),
        day: Number(args.day),
      });
      break;
    }
    case "AuctionStarted": {
      io.emit("auctionStarted", {
        day: Number(args.day),
        tokenAmount: args.tokenAmount?.toString(),
        minBid: args.minBid?.toString(),
      });
      break;
    }
    case "BidPlaced": {
      const tx: WebSocketTransaction = {
        id: `${txHash}-${log.logIndex}`,
        type: "BID",
        user: args.bidder,
        collateralAmount: args.amount?.toString(),
        txHash,
        timestamp,
      };
      addTransaction(tx);
      io.emit("newTransaction", tx);
      io.emit("bidPlaced", {
        bidder: args.bidder,
        amount: args.amount?.toString(),
        day: Number(args.day),
      });
      break;
    }
    case "AuctionWon": {
      io.emit("auctionWon", {
        winner: args.winner,
        tokenAmount: args.tokenAmount?.toString(),
        collateralPaid: args.collateralPaid?.toString(),
        day: Number(args.day),
      });
      break;
    }
    case "PrizeClaimed": {
      io.emit("prizeClaimed", {
        winner: args.winner,
        amount: args.amount?.toString(),
      });
      break;
    }
  }
}
