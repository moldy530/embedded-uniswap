import {
  useAccount,
  useBundlerClient,
  useChain,
} from "@alchemy/aa-alchemy/react";
import { useQuery } from "@tanstack/react-query";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { Address, erc20Abi, formatEther, formatUnits } from "viem";

type UseBalanceProps = {
  token: Token | NativeCurrency;
};

export const useBalance = ({ token }: UseBalanceProps) => {
  const { account } = useAccount({
    type: "LightAccount",
  });
  const bundlerClient = useBundlerClient();

  const { chain } = useChain({});
  const { data: balance, isLoading } = useQuery({
    queryKey: ["balance", token.symbol, chain.id, account?.address],
    queryFn: async () => {
      if (!account) return null;

      if (token.isNative) {
        const balance = await bundlerClient.getBalance({
          address: account.address,
        });

        return {
          rawBalance: balance,
          formattedBalance: formatEther(balance),
        };
      } else {
        const balance = await bundlerClient.readContract({
          address: token.address as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account.address],
        });

        return {
          rawBalance: balance,
          formattedBalance: formatUnits(balance, token.decimals),
        };
      }
    },
    refetchInterval: 10000,
  });

  return {
    balance,
    isLoadingBalance: isLoading,
  };
};
