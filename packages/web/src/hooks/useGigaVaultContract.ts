import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { gigavaultAbi } from "@gigasite/shared";
import { CONTRACT_ADDRESS } from "../config/contract";
import { useState, useCallback } from "react";

type TxState = {
  hash?: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
};

function useTxState() {
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const { writeContractAsync, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  return { hash, setHash, error, setError, writeContractAsync, isPending, isConfirming, isSuccess };
}

export function useGigaVaultContract() {
  const tx = useTxState();

  const mint = useCallback(
    async (collateralAmount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "mint",
          args: [collateralAmount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const mintWithUSDm = useCallback(
    async (usdmAmount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "mintWithUSDm",
          args: [usdmAmount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const redeem = useCallback(
    async (amount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "redeem",
          args: [amount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const redeemToUSDm = useCallback(
    async (amount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "redeemToUSDm",
          args: [amount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const bid = useCallback(
    async (bidAmount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "bid",
          args: [bidAmount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const bidWithUSDm = useCallback(
    async (usdmAmount: bigint) => {
      tx.setError(null);
      try {
        const hash = await tx.writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: gigavaultAbi,
          functionName: "bidWithUSDm",
          args: [usdmAmount],
        });
        tx.setHash(hash);
        return hash;
      } catch (err) {
        tx.setError(err as Error);
        throw err;
      }
    },
    [tx],
  );

  const executeLottery = useCallback(async () => {
    tx.setError(null);
    try {
      const hash = await tx.writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: gigavaultAbi,
        functionName: "executeLottery",
      });
      tx.setHash(hash);
      return hash;
    } catch (err) {
      tx.setError(err as Error);
      throw err;
    }
  }, [tx]);

  const claim = useCallback(async () => {
    tx.setError(null);
    try {
      const hash = await tx.writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: gigavaultAbi,
        functionName: "claim",
      });
      tx.setHash(hash);
      return hash;
    } catch (err) {
      tx.setError(err as Error);
      throw err;
    }
  }, [tx]);

  return {
    mint, mintWithUSDm, redeem, redeemToUSDm,
    bid, bidWithUSDm, executeLottery, claim,
    txHash: tx.hash,
    isPending: tx.isPending,
    isConfirming: tx.isConfirming,
    isSuccess: tx.isSuccess,
    error: tx.error,
  };
}
