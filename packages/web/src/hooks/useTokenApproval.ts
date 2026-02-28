import { useCallback, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "@gigasite/shared";
import { CONTRACT_ADDRESS } from "../config/contract";
import type { Address } from "viem";

export function useTokenApproval(tokenAddress: Address) {
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const approve = useCallback(
    async (amount: bigint) => {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, amount],
      });
      setTxHash(hash);
      return hash;
    },
    [tokenAddress, writeContractAsync],
  );

  return {
    approve,
    isApproving: isWriting || isConfirming,
    isApproved: isSuccess,
    txHash,
  };
}
