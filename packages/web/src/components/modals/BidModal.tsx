import { useState } from "react";
import { parseUnits } from "viem";
import { USDMY, USDM, formatUSDmore } from "@gigasite/shared";
import { useUserData } from "../../hooks/useUserData";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useTokenApproval } from "../../hooks/useTokenApproval";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";
import { TokenIcon } from "../shared/TokenIcon";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-bold">Place Bid</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">&times;</button>
        </div>

        {globalData && (
          <div className="bg-bg-elevated rounded-lg p-3 mb-4 text-sm space-y-1">
            <div>
              <span className="text-text-muted">Auction tokens: </span>
              <span className="text-accent-gold">{formatUSDmore(globalData.currentAuction.auctionTokens)} USDmore</span>
            </div>
            <div>
              <span className="text-text-muted">Min bid: </span>
              <span className="text-text-secondary">{formatUSDmore(globalData.effectiveMinBid)} USDmY</span>
            </div>
            <div>
              <span className="text-text-muted">Current bid: </span>
              <span className="text-accent-orange">
                {globalData.currentAuction.currentBid > 0n
                  ? `${formatUSDmore(globalData.currentAuction.currentBid)} USDmY`
                  : "No bids yet"}
              </span>
            </div>
            <p className="text-text-muted text-xs mt-1">Bids must be at least 10% higher than the current bid.</p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(["USDmY", "USDm"] as const).map((token) => (
            <button
              key={token}
              onClick={() => setInputToken(token)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                inputToken === token ? "border-accent-orange bg-accent-orange/10 text-accent-orange" : "border-border text-text-muted"
              }`}
            >
              <TokenIcon token={token} size={18} />
              {token}
            </button>
          ))}
        </div>

        <div className="bg-bg-elevated rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Bid amount ({inputToken})</span>
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
        </div>

        {isSuccess ? (
          <div className="text-center py-4">
            <p className="text-accent-orange font-medium mb-2">Bid placed!</p>
            <button onClick={onClose} className="text-sm text-text-muted hover:text-text-primary">Close</button>
          </div>
        ) : needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="w-full py-3 rounded-lg bg-accent-purple text-text-primary font-medium disabled:opacity-50"
          >
            {isApproving ? "Approving..." : `Approve ${inputToken}`}
          </button>
        ) : (
          <button
            onClick={handleBid}
            disabled={isPending || isConfirming || parsedAmount === 0n}
            className="w-full py-3 rounded-lg bg-accent-orange text-bg font-medium disabled:opacity-50"
          >
            {isPending ? "Confirming..." : isConfirming ? "Placing bid..." : "Place Bid"}
          </button>
        )}
      </div>
    </div>
  );
}
