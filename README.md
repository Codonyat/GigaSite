# GigaSite

Full-stack DeFi application for **USDmore** — a token built on MegaETH that combines daily lottery and auction mechanics. Users deposit collateral (USDmY/USDm) to mint USDmore tokens. A 1% daily fee is split between a lottery pool (31%) and an auction pool (69%).

## Monorepo Structure

```
packages/
├── web/       # React frontend (Vite, Wagmi, RainbowKit, TailwindCSS)
├── server/    # Backend API + WebSocket (Hono, Viem, Socket.io)
├── shared/    # ABIs, types, constants, utilities
└── subgraph/  # Graph Protocol subgraph (Goldsky)
```

## Tech Stack

| Layer        | Technologies                                       |
| ------------ | -------------------------------------------------- |
| Frontend     | React 19, Vite 6, TailwindCSS 4, Wagmi, RainbowKit |
| Backend      | Node.js 22, Hono, Viem, Socket.io                  |
| Blockchain   | MegaETH (chain ID 6342), Alchemy RPC               |
| Build        | Turborepo, pnpm workspaces, TypeScript 5.7          |
| Indexing     | Graph Protocol, Goldsky                             |
| Deployment   | Docker (Alpine), Railway                            |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Setup

```bash
pnpm install
```

Copy environment files and fill in values:

```bash
cp packages/server/.env.example packages/server/.env
cp packages/web/.env.example packages/web/.env
```

**Server** (`packages/server/.env`):

| Variable          | Description                      |
| ----------------- | -------------------------------- |
| `RPC_URL`         | Alchemy HTTPS RPC endpoint       |
| `RPC_WSS_URL`     | Alchemy WebSocket RPC endpoint   |
| `CONTRACT_ADDRESS` | GigaVault contract address      |
| `SUBGRAPH_URL`    | Goldsky subgraph URL (optional)  |
| `PORT`            | Server port (default: `8080`)    |
| `FRONTEND_URLS`   | Allowed CORS origins             |

**Web** (`packages/web/.env`):

| Variable                        | Description                  |
| ------------------------------- | ---------------------------- |
| `VITE_CONTRACT_ADDRESS`         | GigaVault contract address   |
| `VITE_SERVER_URL`               | Backend URL                  |
| `VITE_CHAIN_ID`                 | MegaETH chain ID (`6342`)    |
| `VITE_CHAIN_NAME`               | Chain display name           |
| `VITE_EXPLORER_URL`             | Block explorer URL           |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID     |

### Development

```bash
pnpm dev
```

This starts all packages concurrently via Turborepo:
- **Web** → `http://localhost:5173` (proxies `/api` to the server)
- **Server** → `http://localhost:8080`

### Build

```bash
pnpm build
```

### Subgraph

The subgraph indexes on-chain events for historical queries (transactions, lottery draws, auction rounds, bids, user stats, daily metrics).

```bash
cd packages/subgraph
```

Before building, fill in the placeholders:

| Placeholder | File | Description |
| --- | --- | --- |
| Contract address | `subgraph.yaml` | Replace `0x0000...` with the deployed GigaVault address |
| `startBlock` | `subgraph.yaml` | Set to the contract deployment block number |
| `DEPLOYMENT_TIME` | `src/helpers.ts` | Set to the `deploymentTime()` value from the contract |

```bash
pnpm codegen    # Generate AssemblyScript types from schema + ABI
pnpm build      # Compile to WASM
pnpm deploy     # Deploy to Goldsky
```

### Other Commands

```bash
pnpm lint                    # Lint all packages
pnpm clean                   # Remove all dist/ folders
```

## Architecture

### Data Flow

1. **Server** listens for on-chain events (Minted, LotteryWon, BidPlaced, etc.) via WebSocket RPC
2. Events are broadcast to connected clients through Socket.io
3. **Web** frontend displays real-time updates in the activity feed and updates UI state
4. **Subgraph** indexes all events for historical queries (auction history, lottery draws, user stats)
5. Contract stats are fetched via `/api/stats` (cached with 15s TTL)
6. RPC calls from the frontend are proxied through `/api/rpc`

### Contract Mechanics

- **Pseudo-day**: 25 hours (90,000 seconds)
- **Fee**: 1% on mint/redeem, split 31% lottery / 69% auction
- **Lottery**: Random winner selected each pseudo-day
- **Auction**: Minimum bid increases by 110% increments; highest bidder wins daily
