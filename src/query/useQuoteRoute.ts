import { fromReadableAmount } from "@/utils";
import { useBundlerClient, useChain } from "@alchemy/aa-alchemy/react";
import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@tanstack/react-query";
import {
  CurrencyAmount,
  NativeCurrency,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapType,
} from "@uniswap/smart-order-router";
import { useMemo } from "react";
import { Address, toHex } from "viem";

type GetQuoteParams = {
  inToken: Token | NativeCurrency;
  outToken: Token | NativeCurrency;
  inTokenAmount: number;
  recipient: Address;
};

export const useQuoteRoute = () => {
  const { chain } = useChain({});
  const bundlerClient = useBundlerClient();

  const router = useMemo(() => {
    return new AlphaRouter({
      chainId: chain.id,
      provider: new Web3Provider(bundlerClient),
    });
  }, [bundlerClient, chain.id]);

  const { mutate, isPending, mutateAsync, data } = useMutation({
    mutationKey: ["get-quote"],
    mutationFn: async ({
      recipient,
      inToken,
      outToken,
      inTokenAmount,
    }: GetQuoteParams) => {
      const routeOptions: SwapOptionsSwapRouter02 = {
        recipient,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      };

      const route = router.route(
        CurrencyAmount.fromRawAmount(
          inToken,
          toHex(fromReadableAmount(inTokenAmount, inToken.decimals))
        ),
        outToken,
        TradeType.EXACT_INPUT,
        routeOptions
      );

      return route;
    },
    retry: false,
  });

  return {
    fetchQuote: mutate,
    fetchQuoteAsync: mutateAsync,
    quote: data,
    isFetchingQuote: isPending,
  };
};
