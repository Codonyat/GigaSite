import { useState } from "react";
import { parseUnits } from "viem";
import { USDMY, USDM, formatUSDmore, calculateMintOutput } from "@gigasite/shared";
import { useUserData } from "../../hooks/useUserData";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { useTokenApproval } from "../../hooks/useTokenApproval";
import { useGigaVaultContract } from "../../hooks/useGigaVaultContract";
import { TokenIcon } from "../shared/TokenIcon";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-bold">Mint USDmore</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">&times;</button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["USDmY", "USDm"] as const).map((token) => (
            <button
              key={token}
              onClick={() => setInputToken(token)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                inputToken === token ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-text-muted"
              }`}
            >
              <TokenIcon token={token} size={18} />
              {token}
            </button>
          ))}
        </div>

        <div className="bg-bg-elevated rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Deposit {inputToken}</span>
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
          <div className="bg-bg-elevated rounded-lg p-3 mb-4 text-sm">
            <span className="text-text-muted">Estimated output: </span>
            <span className="text-secondary font-medium">{formatUSDmore(estimatedOutput)} USDmore</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-4">
            <p className="text-secondary font-medium mb-2">Mint successful!</p>
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
            onClick={handleMint}
            disabled={isPending || isConfirming || parsedAmount === 0n}
            className="w-full py-3 rounded-lg bg-secondary text-bg font-medium disabled:opacity-50"
          >
            {isPending ? "Confirming..." : isConfirming ? "Minting..." : "Deposit"}
          </button>
        )}
      </div>
    </div>
  );
}
