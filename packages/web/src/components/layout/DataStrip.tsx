import { Fragment } from "react";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore } from "@gigasite/shared";
import "./DataStrip.css";

interface TickerItem {
  label: string;
  value: string;
  tooltip?: string;
}

export function DataStrip() {
  const { data } = useGlobalContractData();
  if (!data) return null;

  const items: TickerItem[] = [
    { label: "Supply", value: formatUSDmore(data.totalSupply), tooltip: "Total USDmore tokens in circulation" },
    { label: "Reserve", value: `$${formatUSDmore(data.reserve)}`, tooltip: "Total USDmY backing the supply" },
    { label: "Lottery", value: formatUSDmore(data.lotteryPool) },
    { label: "Fees", value: formatUSDmore(data.feesPoolBalance) },
    { label: "Holders", value: String(data.holderCount) },
    { label: "Day", value: String(data.currentDay), tooltip: "Current pseudo-day (25-hour cycles)" },
  ];

  return (
    <div className="data-strip">
      <div className="data-strip-content">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <span className="ticker-separator">·</span>}
            <span
              className={`ticker-item${item.tooltip ? " has-tooltip" : ""}`}
              tabIndex={item.tooltip ? 0 : undefined}
            >
              <span className="ticker-label">{item.label}</span>
              <span className="ticker-value">{item.value}</span>
              {item.tooltip && <span className="ticker-tooltip">{item.tooltip}</span>}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
