import type { WebSocketTransaction } from "@gigasite/shared";
import { shortenAddress, formatUSDmore } from "@gigasite/shared";
import { getExplorerTxUrl } from "../../config/contract";

interface Props {
  tx: WebSocketTransaction;
}

const typeColors: Record<string, string> = {
  MINT: "text-secondary",
  REDEEM: "text-primary",
  TRANSFER: "text-text-secondary",
  BID: "text-accent-orange",
};

const typeLabels: Record<string, string> = {
  MINT: "Mint",
  REDEEM: "Redeem",
  TRANSFER: "Transfer",
  BID: "Bid",
};

export function TransactionRow({ tx }: Props) {
  const amount = tx.tokenAmount || tx.collateralAmount || tx.fee || "0";

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0 animate-slide-in">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColors[tx.type]} bg-bg-elevated`}>
          {typeLabels[tx.type]}
        </span>
        <span className="text-sm text-text-secondary">{shortenAddress(tx.user)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm tabular-nums">{formatUSDmore(BigInt(amount))}</span>
        <a
          href={getExplorerTxUrl(tx.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-secondary"
        >
          tx
        </a>
      </div>
    </div>
  );
}
