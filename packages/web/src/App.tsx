import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./config/wagmi";
import { Header } from "./components/layout/Header";
import { DataStrip } from "./components/layout/DataStrip";
import { Footer } from "./components/layout/Footer";
import { Landing } from "./pages/Landing";
import { Lottery } from "./pages/Lottery";
import { Auctions } from "./pages/Auctions";
import { FAQ } from "./pages/FAQ";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000 } },
});

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#31F0FF",
            accentColorForeground: "#050813",
            borderRadius: "medium",
          })}
        >
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <DataStrip />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/lottery" element={<Lottery />} />
                  <Route path="/auctions" element={<Auctions />} />
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
