import { useState } from "react";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore, shortenAddress, getNextDayTimestamp } from "@gigasite/shared";
import { CountdownTimer } from "../shared/CountdownTimer";
import { BidModal } from "../modals/BidModal";
import contractConstants from "../../config/contract-constants.json";

export function AuctionCard() {
  const { data } = useGlobalContractData();
  const [showBidModal, setShowBidModal] = useState(false);

  if (!data) return <div className="card-base animate-pulse" style={{ height: 192 }} />;

  const { currentAuction, isAuctionActive, effectiveMinBid } = data;
  const nextDayTimestamp = getNextDayTimestamp(contractConstants.deploymentTime, data.currentDay);

  return (
    <>
      <div className="card-base">
        <h3 className="font-heading text-lg font-bold mb-4">Daily Auction</h3>

        {isAuctionActive ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Tokens for Sale</p>
                <p className="text-xl font-heading font-bold text-accent-gold">
                  {formatUSDmore(currentAuction.auctionTokens)}
                </p>
                <p className="text-xs text-text-muted">USDmore</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Auction Ends</p>
                <CountdownTimer targetTimestamp={nextDayTimestamp} className="flex flex-col" />
              </div>
            </div>

            <div className="info-row">
              <span>Current Bid</span>
              <span style={{ color: "var(--color-orange)" }}>
                {currentAuction.currentBid > 0n
                  ? `${formatUSDmore(currentAuction.currentBid)} USDmY`
                  : "No bids"}
              </span>
            </div>
            {currentAuction.currentBidder !== "0x0000000000000000000000000000000000000000" && (
              <div className="info-row">
                <span>Leading Bidder</span>
                <span>{shortenAddress(currentAuction.currentBidder)}</span>
              </div>
            )}
            <div className="info-row">
              <span>Min Next Bid</span>
              <span>{formatUSDmore(effectiveMinBid)} USDmY</span>
            </div>

            <button
              onClick={() => setShowBidModal(true)}
              className="btn btn-primary btn-full"
              style={{ marginTop: "var(--spacing-md)", borderColor: "var(--color-orange)" }}
            >
              <span>Place Bid</span>
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-muted mb-2">No active auction</p>
            <p className="text-xs text-text-muted">Next auction starts when the lottery executes.</p>
          </div>
        )}
      </div>

      <BidModal isOpen={showBidModal} onClose={() => setShowBidModal(false)} />
    </>
  );
}
