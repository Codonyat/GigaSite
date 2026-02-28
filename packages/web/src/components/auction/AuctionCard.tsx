import { useState } from "react";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore, shortenAddress, getNextDayTimestamp } from "@gigasite/shared";
import { CountdownTimer } from "../shared/CountdownTimer";
import { BidModal } from "../modals/BidModal";
import contractConstants from "../../config/contract-constants.json";

export function AuctionCard() {
  const { data } = useGlobalContractData();
  const [showBidModal, setShowBidModal] = useState(false);

  if (!data) return <div className="bg-bg-card border border-border rounded-xl p-6 animate-pulse h-48" />;

  const { currentAuction, isAuctionActive, effectiveMinBid } = data;
  const nextDayTimestamp = getNextDayTimestamp(contractConstants.deploymentTime, data.currentDay);

  return (
    <>
      <div className="bg-bg-card border border-border rounded-xl p-6">
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

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Current Bid</span>
                <span className="text-accent-orange">
                  {currentAuction.currentBid > 0n
                    ? `${formatUSDmore(currentAuction.currentBid)} USDmY`
                    : "No bids"}
                </span>
              </div>
              {currentAuction.currentBidder !== "0x0000000000000000000000000000000000000000" && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Leading Bidder</span>
                  <span className="text-text-secondary">{shortenAddress(currentAuction.currentBidder)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Min Next Bid</span>
                <span className="text-text-secondary">{formatUSDmore(effectiveMinBid)} USDmY</span>
              </div>
            </div>

            <button
              onClick={() => setShowBidModal(true)}
              className="w-full py-3 rounded-lg bg-accent-orange text-bg font-medium"
            >
              Place Bid
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
