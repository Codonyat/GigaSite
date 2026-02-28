import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore } from "@gigasite/shared";

export function DataStrip() {
  const { data } = useGlobalContractData();
  if (!data) return null;

  const items = [
    { label: "Total Supply", value: formatUSDmore(data.totalSupply) },
    { label: "Reserve", value: `$${formatUSDmore(data.reserve)}` },
    { label: "Lottery Pool", value: formatUSDmore(data.lotteryPool) },
    { label: "Fees Pool", value: formatUSDmore(data.feesPoolBalance) },
    { label: "Holders", value: String(data.holderCount) },
    { label: "Day", value: String(data.currentDay) },
  ];

  return (
    <div className="bg-bg-card border-y border-border overflow-hidden">
      <div className="flex items-center gap-8 px-6 py-2 animate-marquee whitespace-nowrap">
        {items.map((item) => (
          <span key={item.label} className="text-xs text-text-muted">
            <span className="text-text-secondary">{item.label}:</span> {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
