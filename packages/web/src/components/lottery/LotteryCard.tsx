import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";
import { formatUSDmore, getNextDayTimestamp } from "@gigasite/shared";
import { CountdownTimer } from "../shared/CountdownTimer";
import contractConstants from "../../config/contract-constants.json";

export function LotteryCard() {
  const { data } = useGlobalContractData();
  const { executeLottery, isPending, isConfirming } = useGigaVaultContract();

  if (!data) return <div className="card-base animate-pulse" style={{ height: 192 }} />;

  const nextDayTimestamp = getNextDayTimestamp(contractConstants.deploymentTime, data.currentDay);
  const canDraw = data.currentDay > data.lastLotteryDay;

  return (
    <div className="card-base">
      <h3 className="font-heading text-lg font-bold mb-4">Daily Lottery</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-text-muted mb-1">Current Pool</p>
          <p className="text-xl font-heading font-bold text-accent-gold">
            {formatUSDmore(data.lotteryPool)}
          </p>
          <p className="text-xs text-text-muted">USDmore</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Next Draw</p>
          <CountdownTimer targetTimestamp={nextDayTimestamp} className="flex flex-col" />
        </div>
      </div>

      <div className="info-row">
        <span>Day</span>
        <span>{data.currentDay}</span>
      </div>

      <div className="info-row">
        <span>Fees Pool</span>
        <span>{formatUSDmore(data.feesPoolBalance)} USDmore</span>
      </div>

      {canDraw && (
        <button
          onClick={() => executeLottery()}
          disabled={isPending || isConfirming}
          className="btn btn-success btn-full"
          style={{ marginTop: "var(--spacing-md)" }}
        >
          <span>{isPending || isConfirming ? "Executing..." : "Draw Lottery"}</span>
        </button>
      )}
    </div>
  );
}
