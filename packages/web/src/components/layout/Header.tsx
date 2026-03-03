import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGlobalContractData } from "../../hooks/useGlobalContractData";
import { formatUSDmore, shortenAddress } from "@gigasite/shared";
import { StatusChip } from "../shared/StatusChip";
import "./Header.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/lottery", label: "Lottery" },
  { to: "/auctions", label: "Auctions" },
  { to: "/faq", label: "FAQ" },
];

export function Header() {
  const { pathname } = useLocation();
  const { data } = useGlobalContractData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <div className="logo-text-container">
            <span className="logo-text">GigaVault</span>
            <span className="logo-subtitle">USDmore</span>
          </div>
        </Link>

        {data && (
          <div className="status-chips">
            <StatusChip label="TVL" value={`$${formatUSDmore(data.reserve)}`} color="secondary" />
            <StatusChip
              label="Backing"
              value={`${data.backingRatio}x`}
              color={data.backingRatio >= "1.0000" ? "secondary" : "primary"}
            />
            <StatusChip label="Holders" value={String(data.holderCount)} color="text-secondary" />
          </div>
        )}

        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${pathname === link.to ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const connected = mounted && account && chain;

              if (!mounted) {
                return (
                  <button className="wallet-connect-btn" disabled>
                    <span style={{ position: "relative", zIndex: 1 }}>Loading...</span>
                  </button>
                );
              }

              if (!connected) {
                return (
                  <button className="wallet-connect-btn" onClick={openConnectModal}>
                    <span style={{ position: "relative", zIndex: 1 }}>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button className="wallet-wrong-network-btn" onClick={openChainModal}>
                    <span className="warning-icon">⚠</span>
                    Wrong Network
                  </button>
                );
              }

              return (
                <button className="wallet-connected-btn" onClick={openAccountModal}>
                  <span className="wallet-address-display">
                    {shortenAddress(account.address)}
                  </span>
                </button>
              );
            }}
          </ConnectButton.Custom>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`menu-icon${mobileMenuOpen ? " open" : ""}`} />
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="nav-mobile">
            {data && (
              <div className="nav-mobile-stats">
                <StatusChip label="TVL" value={`$${formatUSDmore(data.reserve)}`} color="secondary" />
                <StatusChip
                  label="Backing"
                  value={`${data.backingRatio}x`}
                  color={data.backingRatio >= "1.0000" ? "secondary" : "primary"}
                />
              </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${pathname === link.to ? " active" : ""}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
