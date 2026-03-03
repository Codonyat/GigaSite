import type { WebSocketTransaction } from "@gigasite/shared";
import { shortenAddress, formatUSDmore } from "@gigasite/shared";
import { getExplorerTxUrl } from "../../config/contract";

interface Props {
  tx: WebSocketTransaction;
  isNew?: boolean;
}

const typeMap: Record<string, string> = {
  MINT: "mint",
  REDEEM: "burn",
  TRANSFER: "transfer",
  BID: "bid",
};

const typeLabels: Record<string, string> = {
  MINT: "Mint",
  REDEEM: "Burn",
  TRANSFER: "Transfer",
  BID: "Bid",
};

export function TransactionRow({ tx, isNew }: Props) {
  const amount = tx.tokenAmount || tx.collateralAmount || tx.fee || "0";
  const typeClass = typeMap[tx.type] || "transfer";

  return (
    <div className={`transaction-row ${typeClass}${isNew ? " new" : ""}`}>
      <span className="tx-indicator" />
      <span className="tx-type">{typeLabels[tx.type]}</span>
      <a
        href={getExplorerTxUrl(tx.txHash)}
        target="_blank"
        rel="noopener noreferrer"
        className="tx-address"
      >
        {shortenAddress(tx.user)}
      </a>
      <span className="tx-amount">{formatUSDmore(BigInt(amount))}</span>
    </div>
  );
}
