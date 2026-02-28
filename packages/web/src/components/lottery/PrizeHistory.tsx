import { shortenAddress, formatUSDmore } from "@gigasite/shared";

// Placeholder: Will be populated from subgraph queries when available
interface Prize {
  day: number;
  winner: string;
  amount: bigint;
  claimed: boolean;
}

export function PrizeHistory() {
  // TODO: Replace with subgraph query via useLotteryData hook
  const prizes: Prize[] = [];

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <h3 className="font-heading text-lg font-bold mb-4">Prize History</h3>
      {prizes.length === 0 ? (
        <p className="text-text-muted text-sm">No lottery history yet. Data will appear once a subgraph is deployed.</p>
      ) : (
        <div className="space-y-2">
          {prizes.map((prize) => (
            <div key={prize.day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <span className="text-xs text-text-muted">Day {prize.day}</span>
                <p className="text-sm">{shortenAddress(prize.winner)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-accent-gold">{formatUSDmore(prize.amount)}</p>
                <span className={`text-xs ${prize.claimed ? "text-secondary" : "text-text-muted"}`}>
                  {prize.claimed ? "Claimed" : "Unclaimed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
