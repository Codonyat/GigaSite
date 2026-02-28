import { AuctionCard } from "../components/auction/AuctionCard";
import { AuctionHistory } from "../components/auction/AuctionHistory";
import { useUserData } from "../hooks/useUserData";
import { useGigaVaultContract } from "../hooks/useGigaVaultContract";
import { formatUSDmore } from "@gigasite/shared";

export function Auctions() {
  const { userData, isConnected } = useUserData();
  const { claim, isPending, isConfirming } = useGigaVaultContract();
  const claimable = userData?.claimableAmount ?? 0n;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Auctions</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AuctionCard />

        {isConnected && claimable > 0n && (
          <div className="bg-bg-card border border-accent-orange rounded-xl p-6">
            <h3 className="font-heading text-lg font-bold mb-2">Claimable Prizes</h3>
            <p className="text-2xl font-heading font-bold text-accent-orange mb-4">
              {formatUSDmore(claimable)} USDmore
            </p>
            <button
              onClick={() => claim()}
              disabled={isPending || isConfirming}
              className="w-full py-3 rounded-lg bg-accent-orange text-bg font-medium disabled:opacity-50"
            >
              {isPending || isConfirming ? "Claiming..." : "Claim All Prizes"}
            </button>
          </div>
        )}
      </div>

      <AuctionHistory />
    </div>
  );
}
