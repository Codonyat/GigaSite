export function calculateMinBid(currentBid: bigint, storedMinBid: bigint): bigint {
  if (currentBid === 0n) return storedMinBid;
  return (currentBid * 110n) / 100n;
}
