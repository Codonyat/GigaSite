import { shortenAddress, formatUSDmore } from "@gigasite/shared";

// Placeholder: Will be populated from subgraph queries when available
interface AuctionResult {
  day: number;
  winner: string | null;
  winningBid: bigint;
  tokenAmount: bigint;
  noBids: boolean;
}

export function AuctionHistory() {
  // TODO: Replace with subgraph query via useAuctionData hook
  const auctions: AuctionResult[] = [];

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <h3 className="font-heading text-lg font-bold mb-4">Auction History</h3>
      {auctions.length === 0 ? (
        <p className="text-text-muted text-sm">No auction history yet. Data will appear once a subgraph is deployed.</p>
      ) : (
        <div className="space-y-2">
          {auctions.map((auction) => (
            <div key={auction.day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <span className="text-xs text-text-muted">Day {auction.day}</span>
                <p className="text-sm">
                  {auction.noBids ? "No bids" : shortenAddress(auction.winner ?? "")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-accent-orange">
                  {auction.noBids ? "Rolled over" : `${formatUSDmore(auction.winningBid)} USDmY`}
                </p>
                <span className="text-xs text-text-muted">{formatUSDmore(auction.tokenAmount)} USDmore</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
