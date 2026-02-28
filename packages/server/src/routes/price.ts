import { Hono } from "hono";
import { TTLCache } from "../services/cache.js";
import type { PriceResponse } from "@gigasite/shared";

export const priceRouter = new Hono();

const priceCache = new TTLCache<PriceResponse>();
const PRICE_CACHE_TTL = 60_000; // 1 minute

priceRouter.get("/api/price", async (c) => {
  const cached = priceCache.get("usdm");
  if (cached) return c.json(cached);

  try {
    // USDm is a stablecoin pegged to $1. For now return 1.0.
    // Replace with actual price feed if needed.
    const price: PriceResponse = { usdm: 1.0, timestamp: Math.floor(Date.now() / 1000) };
    priceCache.set("usdm", price, PRICE_CACHE_TTL);
    return c.json(price);
  } catch (error) {
    console.error("[price] Error:", error);
    return c.json({ error: "Failed to fetch price" }, 500);
  }
});
