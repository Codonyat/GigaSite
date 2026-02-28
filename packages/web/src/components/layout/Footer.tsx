export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-sm">
        <span>GigaVault - USDmore</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-text-secondary transition-colors">Docs</a>
          <a href="#" className="hover:text-text-secondary transition-colors">GitHub</a>
          <a href="#" className="hover:text-text-secondary transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
