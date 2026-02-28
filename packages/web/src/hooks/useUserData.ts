import { useAccount, useReadContracts } from "wagmi";
import { gigavaultAbi, erc20Abi, USDMY, USDM } from "@gigasite/shared";
import type { UserData } from "@gigasite/shared";
import { CONTRACT_ADDRESS } from "../config/contract";
import { useMemo } from "react";

export function useUserData(): {
  userData: UserData | null;
  isLoading: boolean;
  isConnected: boolean;
  address: `0x${string}` | undefined;
  refetch: () => void;
} {
  const { address, isConnected } = useAccount();

  const { data, isLoading, refetch } = useReadContracts({
    contracts: address
      ? [
          { address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "balanceOf", args: [address] },
          { address: USDMY, abi: erc20Abi, functionName: "balanceOf", args: [address] },
          { address: USDM, abi: erc20Abi, functionName: "balanceOf", args: [address] },
          { address: USDMY, abi: erc20Abi, functionName: "allowance", args: [address, CONTRACT_ADDRESS] },
          { address: USDM, abi: erc20Abi, functionName: "allowance", args: [address, CONTRACT_ADDRESS] },
          { address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "getMyClaimableAmount" },
          { address: CONTRACT_ADDRESS, abi: gigavaultAbi, functionName: "getAllUnclaimedPrizes" },
        ]
      : [],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15_000,
    },
  });

  const userData = useMemo<UserData | null>(() => {
    if (!data || data.length < 7 || data.some((r) => r.status === "failure")) return null;

    const prizes = data[6]!.result as readonly [
      readonly `0x${string}`[],
      readonly bigint[],
      readonly `0x${string}`[],
      readonly bigint[],
    ];

    return {
      usdmoreBalance: data[0]!.result as bigint,
      usdmyBalance: data[1]!.result as bigint,
      usdmBalance: data[2]!.result as bigint,
      usdmyAllowance: data[3]!.result as bigint,
      usdmAllowance: data[4]!.result as bigint,
      claimableAmount: data[5]!.result as bigint,
      unclaimedPrizes: {
        lotteryWinners: prizes[0],
        lotteryAmounts: prizes[1],
        auctionWinners: prizes[2],
        auctionAmounts: prizes[3],
      },
    };
  }, [data]);

  return { userData, isLoading, isConnected, address, refetch };
}
