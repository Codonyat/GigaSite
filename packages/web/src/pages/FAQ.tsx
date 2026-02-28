import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "What is USDmore?",
    a: "USDmore is an ERC20 token backed 1:1 by USDmY (an ERC4626 vault token wrapping USDm). It features a 1% fee on all operations that funds daily lottery prizes and auction rewards for holders.",
  },
  {
    q: "How does the 1% fee work?",
    a: "Every mint, redeem, and transfer incurs a 1% fee. This fee is split: 31% goes to a lottery pool and 69% goes to an auction pool. Both pools are distributed daily.",
  },
  {
    q: "What are pseudo-days?",
    a: "GigaVault uses 25-hour days instead of 24-hour days. This means lottery and auction cycles drift across time zones, ensuring no single timezone has a consistent advantage.",
  },
  {
    q: "How does the lottery work?",
    a: "Each day, a winner is selected randomly from all USDmore holders, weighted by their balance. The lottery pool (31% of daily fees) is awarded to the winner. Prizes are claimable for 7 days.",
  },
  {
    q: "How do auctions work?",
    a: "The auction pool (69% of daily fees) is auctioned as USDmore tokens. Bidders pay in USDmY, and the winning bid is absorbed into the reserve, increasing the backing ratio for all holders. Each subsequent bid must be at least 10% higher than the previous.",
  },
  {
    q: "What happens to unclaimed prizes?",
    a: "Prizes that aren't claimed within 7 days are sent to the contract owner as USDmY (converted from USDmore). This prevents prizes from being locked forever.",
  },
  {
    q: "Can I use USDm directly?",
    a: "Yes! You can mint USDmore and place bids using either USDmY or USDm. When using USDm, the contract automatically deposits it into the USDmY vault first.",
  },
  {
    q: "What is the minting period?",
    a: "The first 3 days after deployment are an open minting period. After this, the max supply is locked based on total deposits. New mints are only possible when others redeem, creating capacity.",
  },
  {
    q: "How is the backing ratio calculated?",
    a: "Backing ratio = USDmY reserve / USDmore total supply. It can exceed 1.0 because winning auction bids add USDmY to the reserve without minting new USDmore.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-text-muted transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
