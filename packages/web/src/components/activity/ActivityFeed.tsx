import { useRealtimeEvents } from "../../hooks/useRealtimeEvents";
import { TransactionRow } from "./TransactionRow";

export function ActivityFeed() {
  const { transactions, isConnected } = useRealtimeEvents();

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold">Activity</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-secondary" : "bg-primary"}`} />
          <span className="text-xs text-text-muted">{isConnected ? "Live" : "Connecting..."}</span>
        </div>
      </div>
      {transactions.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-8">Waiting for transactions...</p>
      ) : (
        <div className="space-y-0">
          {transactions.slice(0, 10).map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
