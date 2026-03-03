import { LotteryCard } from "../components/lottery/LotteryCard";
import { PrizeHistory } from "../components/lottery/PrizeHistory";
import { useUserData } from "../hooks/useUserData";
import { useGigaVaultContract } from "../hooks/useGigaVaultContract";
import { formatUSDmore } from "@gigasite/shared";

export function Lottery() {
  const { userData, isConnected } = useUserData();
  const { claim, isPending, isConfirming } = useGigaVaultContract();
  const claimable = userData?.claimableAmount ?? 0n;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <div className="page-header-section">
        <div className="page-header-content">
          <h1 className="font-heading text-3xl font-bold">Lottery</h1>
          <p className="page-tagline">Win daily prizes just by holding USDmore</p>
        </div>
      </div>

      <div style={{ padding: "0 var(--spacing-lg) var(--spacing-2xl)", maxWidth: 896, margin: "0 auto" }}>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <LotteryCard />

          {isConnected && claimable > 0n && (
            <div className="card-base" style={{ borderColor: "var(--color-accent)" }}>
              <h3 className="font-heading text-lg font-bold mb-2">You Have Prizes!</h3>
              <p className="text-2xl font-heading font-bold text-accent-gold mb-4">
                {formatUSDmore(claimable)} USDmore
              </p>
              <button
                onClick={() => claim()}
                disabled={isPending || isConfirming}
                className="btn btn-success btn-full"
              >
                <span>{isPending || isConfirming ? "Claiming..." : "Claim All Prizes"}</span>
              </button>
            </div>
          )}
        </div>

        <PrizeHistory />
      </div>
    </div>
  );
}
