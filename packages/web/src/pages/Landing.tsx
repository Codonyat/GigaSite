import { useState } from "react";
import { useUserData } from "../hooks/useUserData";
import { MintModal } from "../components/modals/MintModal";
import { RedeemModal } from "../components/modals/RedeemModal";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import { DisplayFormattedNumber } from "../components/shared/DisplayFormattedNumber";
import "./Landing.css";

export function Landing() {
  const { userData, isConnected } = useUserData();
  const [showMint, setShowMint] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [hoverState, setHoverState] = useState<"none" | "deposit" | "withdraw">("none");
  const [flipped, setFlipped] = useState(false);

  const coinContainerClass = [
    "coin-container",
    hoverState === "deposit" ? "hover-deposit" : "",
    hoverState === "withdraw" ? "hover-withdraw" : "",
    hoverState === "none" && flipped ? "flipped" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="page-header-section">
        <div className="page-header-content">
          <p className="page-tagline">
            Deposit USDmY. Earn lottery prizes. Win auctions. A 1% fee fuels daily rewards for all holders.
          </p>

          {/* User Portfolio (above hero grid when connected) */}
          {isConnected && userData && (
            <div className="portfolio-section" style={{ width: "100%", maxWidth: "var(--max-width)" }}>
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
            </div>
          )}

          {/* Hero Grid: Coin + Actions | Activity Feed */}
          <div className="hero-content-grid" style={{ maxWidth: "var(--max-width)", width: "100%" }}>
            <div className="hero-left">
              <div className="coin-area">
                <div className={coinContainerClass} onClick={() => setFlipped(!flipped)}>
                  <div className="coin-face coin-native">
                    <div className="coin-placeholder native">USDmY</div>
                  </div>
                  <div className="coin-face coin-strategy">
                    <div className="coin-placeholder strategy">USDmore</div>
                  </div>
                </div>
              </div>

              <div className="coin-actions">
                <button
                  className="action-btn deposit-btn"
                  onClick={() => setShowMint(true)}
                  onMouseEnter={() => setHoverState("deposit")}
                  onMouseLeave={() => setHoverState("none")}
                >
                  <span className="action-line">Deposit USDmY</span>
                  <span className="action-line">Mint USDmore</span>
                </button>
                <button
                  className="action-btn withdraw-btn"
                  onClick={() => setShowRedeem(true)}
                  onMouseEnter={() => setHoverState("withdraw")}
                  onMouseLeave={() => setHoverState("none")}
                >
                  <span className="action-line">Burn USDmore</span>
                  <span className="action-line">Withdraw USDmY</span>
                </button>
              </div>
            </div>

            <div className="hero-right">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="explainer-section">
        <div className="explainer-content">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-title">Deposit</div>
                <div className="step-description">
                  Deposit <strong>USDmY</strong> to mint <strong>USDmore</strong> tokens. A 1% fee is collected.
                </div>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-title">Backing Grows</div>
                <div className="step-description">
                  Auction bids add USDmY to the reserve, increasing the <strong>backing ratio</strong> for all holders.
                </div>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-title">Lottery</div>
                <div className="step-description">
                  Every 25 hours, <strong>31% of fees</strong> are awarded to a random holder via lottery.
                </div>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <div className="step-title">Withdraw</div>
                <div className="step-description">
                  Burn USDmore anytime to withdraw <strong>USDmY</strong> at the current backing ratio.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MintModal isOpen={showMint} onClose={() => setShowMint(false)} />
      <RedeemModal isOpen={showRedeem} onClose={() => setShowRedeem(false)} />
    </div>
  );
}
