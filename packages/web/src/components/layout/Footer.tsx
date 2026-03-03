import { useState } from "react";
import { FileText, BookOpen, Github, Twitter, Send, Copy, Check, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS, getExplorerAddressUrl } from "../../config/contract";
import { shortenAddress } from "@gigasite/shared";
import "./Footer.css";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-subtitle">About USDmore</h3>
          <p className="footer-description">
            USDmore is an ERC20 token backed by USDmY with a 1% fee that fuels daily lottery prizes and auction rewards for all holders.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-subtitle">Contract</h3>
          <div className="contract-module">
            <div className="contract-address">
              <span className="address-text">{shortenAddress(CONTRACT_ADDRESS)}</span>
              <button className="copy-button" onClick={handleCopy} title="Copy address">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <a
              href={getExplorerAddressUrl(CONTRACT_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
            >
              <ExternalLink size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              View on Explorer
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-subtitle">Links</h3>
          <div className="footer-links">
            <a href="#" className="footer-link"><FileText size={14} /> Whitepaper</a>
            <a href="#" className="footer-link"><BookOpen size={14} /> Docs</a>
            <a href="#" className="footer-link"><Github size={14} /> GitHub</a>
            <a href="#" className="footer-link"><Twitter size={14} /> Twitter</a>
            <a href="#" className="footer-link"><Send size={14} /> Telegram</a>
          </div>
        </div>
      </div>

      <div className="footer-disclaimer">
        <p>
          USDmore is experimental software. Use at your own risk. This is not financial advice.
          The protocol is unaudited. Always DYOR before interacting with any smart contract.
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} GigaVault. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
