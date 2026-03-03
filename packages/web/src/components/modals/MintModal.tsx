import { useState } from "react";
import { parseUnits } from "viem";
import { USDMY, USDM, formatUSDmore, calculateMintOutput } from "@gigasite/shared";
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

export function MintModal({ isOpen, onClose }: Props) {
  const [inputToken, setInputToken] = useState<"USDmY" | "USDm">("USDmY");
  const [amount, setAmount] = useState("");
  const { userData, refetch: refetchUser } = useUserData();
  const { data: globalData } = useGlobalContractData();
  const tokenAddress = inputToken === "USDmY" ? USDMY : USDM;
  const { approve, isApproving } = useTokenApproval(tokenAddress);
  const { mint, mintWithUSDm, isPending, isConfirming, isSuccess } = useGigaVaultContract();

  if (!isOpen) return null;

  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;
  const balance = inputToken === "USDmY" ? userData?.usdmyBalance : userData?.usdmBalance;
  const allowance = inputToken === "USDmY" ? userData?.usdmyAllowance : userData?.usdmAllowance;
  const needsApproval = allowance !== undefined && parsedAmount > 0n && allowance < parsedAmount;

  const estimatedOutput =
    globalData && parsedAmount > 0n
      ? calculateMintOutput(parsedAmount, globalData.totalSupply, globalData.reserve)
      : 0n;

  const handleApprove = async () => {
    await approve(parsedAmount);
    refetchUser();
  };

  const handleMint = async () => {
    if (inputToken === "USDmY") {
      await mint(parsedAmount);
    } else {
      await mintWithUSDm(parsedAmount);
    }
    refetchUser();
    setAmount("");
  };

  const shortcuts = [25, 50, 75, 100];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Mint USDmore</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {isSuccess ? (
          <div className="success-view">
            <div className="success-icon">🎉</div>
            <h3 className="success-title">Mint Successful!</h3>
            <p className="success-message">
              Your USDmore tokens have been minted successfully.
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
                  onClick={() => setInputToken(token)}
                  className={`toggle-btn${inputToken === token ? " active" : ""}`}
                >
                  <TokenIcon token={token} size={18} />
                  {token}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>Deposit {inputToken}</label>
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

            {estimatedOutput > 0n && (
              <div className="transaction-info">
                <div className="info-row">
                  <span>Estimated output</span>
                  <span>{formatUSDmore(estimatedOutput)} USDmore</span>
                </div>
              </div>
            )}

            {needsApproval ? (
              <button
                className={`submit-button btn-full${isApproving ? " loading" : ""}`}
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
                className={`submit-button btn-full${isPending || isConfirming ? " loading" : ""}`}
                onClick={handleMint}
                disabled={isPending || isConfirming || parsedAmount === 0n}
              >
                <span className="button-content">
                  {(isPending || isConfirming) && <span className="spinner" />}
                  {isPending ? "Confirming..." : isConfirming ? "Minting..." : "Deposit"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
