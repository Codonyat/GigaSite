import { useState } from "react";
import { parseUnits } from "viem";
import { USDMY, USDM, formatUSDmore } from "@gigasite/shared";
import { useUserData } from "../../hooks/useUserData";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useTokenApproval } from "../../hooks/useTokenApproval";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";
import { TokenIcon } from "../shared/TokenIcon";
import "./TransactionModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BidModal({ isOpen, onClose }: Props) {
  const [inputToken, setInputToken] = useState<"USDmY" | "USDm">("USDmY");
  const [amount, setAmount] = useState("");
  const { userData, refetch: refetchUser } = useUserData();
  const { data: globalData } = useGlobalContractData();
  const tokenAddress = inputToken === "USDmY" ? USDMY : USDM;
  const { approve, isApproving } = useTokenApproval(tokenAddress);
  const { bid, bidWithUSDm, isPending, isConfirming, isSuccess } = useGigaVaultContract();

  if (!isOpen) return null;

  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;
  const balance = inputToken === "USDmY" ? userData?.usdmyBalance : userData?.usdmBalance;
  const allowance = inputToken === "USDmY" ? userData?.usdmyAllowance : userData?.usdmAllowance;
  const needsApproval = allowance !== undefined && parsedAmount > 0n && allowance < parsedAmount;

  const handleApprove = async () => {
    await approve(parsedAmount);
    refetchUser();
  };

  const handleBid = async () => {
    if (inputToken === "USDmY") {
      await bid(parsedAmount);
    } else {
      await bidWithUSDm(parsedAmount);
    }
    refetchUser();
    setAmount("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Place Bid</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {isSuccess ? (
          <div className="success-view">
            <div className="success-icon">🎯</div>
            <h3 className="success-title">Bid Placed!</h3>
            <p className="success-message">
              Your bid has been submitted to the auction.
            </p>
            <div className="success-actions">
              <button className="close-success-button" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <div className="modal-form">
            {globalData && (
              <div className="transaction-info" style={{ marginTop: 0, marginBottom: "1.25rem" }}>
                <div className="info-row">
                  <span>Auction tokens</span>
                  <span style={{ color: "var(--color-accent)" }}>
                    {formatUSDmore(globalData.currentAuction.auctionTokens)} USDmore
                  </span>
                </div>
                <div className="info-row">
                  <span>Current bid</span>
                  <span style={{ color: "var(--color-orange)" }}>
                    {globalData.currentAuction.currentBid > 0n
                      ? `${formatUSDmore(globalData.currentAuction.currentBid)} USDmY`
                      : "No bids yet"}
                  </span>
                </div>
                <div className="info-row">
                  <span>Min next bid</span>
                  <span>{formatUSDmore(globalData.effectiveMinBid)} USDmY</span>
                </div>
              </div>
            )}

            <div className="token-toggle">
              {(["USDmY", "USDm"] as const).map((token) => (
                <button
                  key={token}
                  onClick={() => setInputToken(token)}
                  className={`toggle-btn${inputToken === token ? " active" : ""}`}
                >
                  <TokenIcon token={token} size={18} />
                  {token}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>Bid amount ({inputToken})</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
                <span className="token-symbol">{inputToken}</span>
              </div>
              <div className="balance-row">
                <span className="balance-info-text">
                  Balance: <strong>{balance !== undefined ? formatUSDmore(balance) : "---"}</strong>
                </span>
              </div>
            </div>

            {needsApproval ? (
              <button
                className={`submit-button bid btn-full${isApproving ? " loading" : ""}`}
                onClick={handleApprove}
                disabled={isApproving}
              >
                <span className="button-content">
                  {isApproving && <span className="spinner" />}
                  {isApproving ? "Approving..." : `Approve ${inputToken}`}
                </span>
              </button>
            ) : (
              <button
                className={`submit-button bid btn-full${isPending || isConfirming ? " loading" : ""}`}
                onClick={handleBid}
                disabled={isPending || isConfirming || parsedAmount === 0n}
              >
                <span className="button-content">
                  {(isPending || isConfirming) && <span className="spinner" />}
                  {isPending ? "Confirming..." : isConfirming ? "Placing bid..." : "Place Bid"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
