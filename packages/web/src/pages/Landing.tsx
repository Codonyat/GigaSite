import { useState } from "react";
import { useGlobalContractData } from "../hooks/useGlobalContractData";
import { useUserData } from "../hooks/useUserData";
import { formatUSDmore } from "@gigasite/shared";
import { DataStrip } from "../components/layout/DataStrip";
import { MintModal } from "../components/modals/MintModal";
import { RedeemModal } from "../components/modals/RedeemModal";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import { DisplayFormattedNumber } from "../components/shared/DisplayFormattedNumber";

export function Landing() {
  const { data, isLoading } = useGlobalContractData();
  const { userData, isConnected } = useUserData();
  const [showMint, setShowMint] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  return (
    <>
      <DataStrip />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            <span className="text-secondary">USDmore</span>
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Deposit USDmY. Earn lottery prizes. Win auctions. A 1% fee fuels daily rewards for all holders.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowMint(true)}
              className="px-8 py-3 rounded-lg bg-secondary text-bg font-heading font-bold text-lg hover:brightness-110 transition"
            >
              Mint
            </button>
            <button
              onClick={() => setShowRedeem(true)}
              className="px-8 py-3 rounded-lg border border-primary text-primary font-heading font-bold text-lg hover:bg-primary/10 transition"
            >
              Redeem
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-bg-card border border-border rounded-xl p-4 animate-pulse h-24" />
            ))
          ) : data ? (
            <>
              <StatCard label="Total Supply" value={formatUSDmore(data.totalSupply)} suffix=" USDmore" />
              <StatCard label="Reserve (TVL)" value={`$${formatUSDmore(data.reserve)}`} />
              <StatCard label="Backing Ratio" value={`${data.backingRatio}x`} />
              <StatCard label="Holders" value={String(data.holderCount)} />
            </>
          ) : null}
        </section>

        {/* User balances */}
        {isConnected && userData && (
          <section className="bg-bg-card border border-border rounded-xl p-6 mb-12">
            <h2 className="font-heading text-lg font-bold mb-4">Your Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">USDmore</p>
                <DisplayFormattedNumber value={userData.usdmoreBalance} className="text-lg font-heading font-bold" />
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">USDmY</p>
                <DisplayFormattedNumber value={userData.usdmyBalance} className="text-lg font-heading font-bold" />
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">USDm</p>
                <DisplayFormattedNumber value={userData.usdmBalance} className="text-lg font-heading font-bold" />
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Claimable Prizes</p>
                <DisplayFormattedNumber
                  value={userData.claimableAmount}
                  className={`text-lg font-heading font-bold ${userData.claimableAmount > 0n ? "text-accent-gold" : ""}`}
                />
              </div>
            </div>
          </section>
        )}

        {/* Activity */}
        <ActivityFeed />
      </div>

      <MintModal isOpen={showMint} onClose={() => setShowMint(false)} />
      <RedeemModal isOpen={showRedeem} onClose={() => setShowRedeem(false)} />
    </>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-xl font-heading font-bold">
        {value}
        {suffix && <span className="text-sm text-text-muted">{suffix}</span>}
      </p>
    </div>
  );
}
