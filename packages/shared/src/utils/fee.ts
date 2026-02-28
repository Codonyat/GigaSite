import { FEE_PERCENT, BASIS_POINTS } from "../constants/contract.js";

export function calculateFee(amount: bigint): bigint {
  return (amount * FEE_PERCENT) / BASIS_POINTS;
}

export function calculateMintOutput(collateralAmount: bigint, totalSupply: bigint, reserve: bigint): bigint {
  if (totalSupply === 0n || reserve === 0n) {
    return collateralAmount;
  }
  const tokensToMint = (collateralAmount * totalSupply) / reserve;
  const fee = calculateFee(tokensToMint);
  return tokensToMint - fee;
}

export function calculateRedemptionOutput(amount: bigint, totalSupply: bigint, reserve: bigint): bigint {
  const fee = calculateFee(amount);
  const netTokens = amount - fee;
  return (netTokens * reserve) / totalSupply;
}
