import { useRealtimeEvents } from "../../hooks/useRealtimeEvents";
import { TransactionRow } from "./TransactionRow";

export function ActivityFeed() {
  const { transactions, isConnected } = useRealtimeEvents();

  return (
    <div className="transactions-wrapper">
      <div className="transactions-header">
        <h3 className="transactions-title">Activity</h3>
        <div className="live-indicator">
          <span className="live-dot" />
          <span>{isConnected ? "LIVE" : "CONNECTING"}</span>
        </div>
      </div>
      {transactions.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-8">Waiting for transactions...</p>
      ) : (
        <div className="transactions-list">
          {transactions.slice(0, 15).map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
