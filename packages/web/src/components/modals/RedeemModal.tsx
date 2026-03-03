import { useState } from "react";
import { parseUnits } from "viem";
import { formatUSDmore, calculateRedemptionOutput } from "@gigasite/shared";
import { useUserData } from "../../hooks/useUserData";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";
import "./TransactionModal.css";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Redeem USDmore</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {isSuccess ? (
          <div className="success-view">
            <div className="success-icon">🔥</div>
            <h3 className="success-title">Redemption Successful!</h3>
            <p className="success-message">
              Your USDmore tokens have been burned and <strong>{outputToken}</strong> returned to your wallet.
            </p>
            <div className="success-actions">
              <button className="close-success-button" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <div className="modal-form">
            <div className="token-toggle">
              {(["USDmY", "USDm"] as const).map((token) => (
                <button
                  key={token}
                  onClick={() => setOutputToken(token)}
                  className={`toggle-btn${outputToken === token ? " active" : ""}`}
                >
                  Receive {token}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>Burn USDmore</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
                <span className="token-symbol">USDmore</span>
              </div>
              <div className="balance-row">
                <span className="balance-info-text">
                  Balance: <strong>{balance !== undefined ? formatUSDmore(balance) : "---"}</strong>
                </span>
                <div className="balance-shortcuts">
                  {shortcuts.map((pct) => (
                    <button
                      key={pct}
                      className="shortcut-btn"
                      disabled={!balance}
                      onClick={() => balance && setAmount(formatUSDmore((balance * BigInt(pct)) / 100n, 18))}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="transaction-info">
              {estimatedOutput > 0n && (
                <div className="info-row">
                  <span>Expected output</span>
                  <span>{formatUSDmore(estimatedOutput)} {outputToken}</span>
                </div>
              )}
              {globalData && (
                <div className="info-row">
                  <span>Backing ratio</span>
                  <span>{globalData.backingRatio}x</span>
                </div>
              )}
            </div>

            <button
              className={`submit-button burn btn-full${isPending || isConfirming ? " loading" : ""}`}
              onClick={handleRedeem}
              disabled={isPending || isConfirming || parsedAmount === 0n}
            >
              <span className="button-content">
                {(isPending || isConfirming) && <span className="spinner" />}
                {isPending ? "Confirming..." : isConfirming ? "Redeeming..." : "Redeem"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
