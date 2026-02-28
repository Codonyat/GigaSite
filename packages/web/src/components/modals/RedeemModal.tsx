import { useState } from "react";
import { parseUnits } from "viem";
import { formatUSDmore, calculateRedemptionOutput } from "@gigasite/shared";
import { useUserData } from "../../hooks/useUserData";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RedeemModal({ isOpen, onClose }: Props) {
  const [outputToken, setOutputToken] = useState<"USDmY" | "USDm">("USDmY");
  const [amount, setAmount] = useState("");
  const { userData, refetch: refetchUser } = useUserData();
  const { data: globalData } = useGlobalContractData();
  const { redeem, redeemToUSDm, isPending, isConfirming, isSuccess } = useGigaVaultContract();

  if (!isOpen) return null;

  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;
  const balance = userData?.usdmoreBalance;

  const estimatedOutput =
    globalData && parsedAmount > 0n
      ? calculateRedemptionOutput(parsedAmount, globalData.totalSupply, globalData.reserve)
      : 0n;

  const handleRedeem = async () => {
    if (outputToken === "USDmY") {
      await redeem(parsedAmount);
    } else {
      await redeemToUSDm(parsedAmount);
    }
    refetchUser();
    setAmount("");
  };

  const shortcuts = [25, 50, 75, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-bold">Redeem USDmore</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">&times;</button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="text-sm text-text-muted py-2">Receive as:</span>
          {(["USDmY", "USDm"] as const).map((token) => (
            <button
              key={token}
              onClick={() => setOutputToken(token)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                outputToken === token ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted"
              }`}
            >
              {token}
            </button>
          ))}
        </div>

        <div className="bg-bg-elevated rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Burn USDmore</span>
            <span className="text-xs text-text-muted">
              Balance: {balance !== undefined ? formatUSDmore(balance) : "---"}
            </span>
          </div>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl font-heading text-text-primary outline-none"
          />
          <div className="flex gap-2 mt-2">
            {shortcuts.map((pct) => (
              <button
                key={pct}
                onClick={() => balance && setAmount(formatUSDmore((balance * BigInt(pct)) / 100n, 18))}
                className="px-2 py-0.5 text-xs rounded bg-bg-card border border-border text-text-muted hover:text-text-secondary"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {estimatedOutput > 0n && (
          <div className="bg-bg-elevated rounded-lg p-3 mb-2 text-sm">
            <span className="text-text-muted">Expected output: </span>
            <span className="text-primary font-medium">{formatUSDmore(estimatedOutput)} {outputToken}</span>
          </div>
        )}

        {globalData && (
          <div className="bg-bg-elevated rounded-lg p-3 mb-4 text-sm">
            <span className="text-text-muted">Backing ratio: </span>
            <span className="text-text-secondary">{globalData.backingRatio}x</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-4">
            <p className="text-primary font-medium mb-2">Redemption successful!</p>
            <button onClick={onClose} className="text-sm text-text-muted hover:text-text-primary">Close</button>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={isPending || isConfirming || parsedAmount === 0n}
            className="w-full py-3 rounded-lg bg-primary text-text-primary font-medium disabled:opacity-50"
          >
            {isPending ? "Confirming..." : isConfirming ? "Redeeming..." : "Redeem"}
          </button>
        )}
      </div>
    </div>
  );
}
