import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore } from "@gigasite/shared";
import { StatusChip } from "../shared/StatusChip";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/lottery", label: "Lottery" },
  { to: "/auctions", label: "Auctions" },
  { to: "/faq", label: "FAQ" },
];

export function Header() {
  const { pathname } = useLocation();
  const { data } = useGlobalContractData();

  return (
    <header className="border-b border-border px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-heading text-xl font-bold text-secondary">
            GigaVault
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.to ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {data && (
            <div className="hidden lg:flex items-center gap-3">
              <StatusChip label="TVL" value={`$${formatUSDmore(data.reserve)}`} color="secondary" />
              <StatusChip
                label="Backing"
                value={`${data.backingRatio}x`}
                color={data.backingRatio >= "1.0000" ? "secondary" : "primary"}
              />
              <StatusChip label="Holders" value={String(data.holderCount)} color="text-secondary" />
            </div>
          )}
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}
