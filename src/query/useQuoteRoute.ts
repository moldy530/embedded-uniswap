import { fromReadableAmount } from "@/utils";
import {
  UseSmartAccountClientResult,
  useBundlerClient,
  useChain,
} from "@alchemy/aa-alchemy/react";
import { Web3Provider } from "@ethersproject/providers";
import { useMutation } from "@tanstack/react-query";
import {
  CurrencyAmount,
  NativeCurrency,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import { AlphaRouter, SwapRoute, SwapType } from "@uniswap/smart-order-router";
import { useMemo } from "react";
import {
  Address,
  Hex,
  encodeFunctionData,
  erc20Abi,
  fromHex,
  toHex,
} from "viem";

type GetQuoteParams = {
  inToken: Token | NativeCurrency;
  outToken: Token | NativeCurrency;
  inTokenAmount: number;
  recipient: Address;
};

type UseQuoteRouteProps = {
  smartAccountClient: UseSmartAccountClientResult["client"];
};

export const buildUserOperationForRoute = (
  route: SwapRoute,
  inToken: Token | NativeCurrency,
  amount: number
) => {
  if (!route.methodParameters) return;

  const rawAmount = fromReadableAmount(amount, inToken.decimals);
  const approve = inToken.isToken
    ? {
        target: inToken.address as Address,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [route.methodParameters.to as Address, rawAmount],
        }),
      }
    : null;

  const swap = {
    target: route.methodParameters.to as Address,
    data: route.methodParameters.calldata as Hex,
    value: fromHex(route.methodParameters.value as Hex, "bigint"),
  };

  return approve ? [approve, swap] : swap;
};

/**
 * This function will return a function for generating a quote.
 *
 * Generating a quote first fetches the trade route for the tokens,
 * and then builds a user operation. Building a user operation will
 * effectively simulate the execution.
 *
 * It will throw if there is not enough balance for gas or for the trade.
 *
 * TODO: the error is not user friendly AT ALL. clean that up and handle
 * those cases better
 */
export const useQuoteRoute = ({ smartAccountClient }: UseQuoteRouteProps) => {
  const { chain } = useChain({});
  const bundlerClient = useBundlerClient();

  const router = useMemo(() => {
    return new AlphaRouter({
      chainId: chain.id,
      provider: new Web3Provider(bundlerClient),
    });
  }, [bundlerClient, chain.id]);

  const { mutate, isPending, mutateAsync, data, error } = useMutation({
    mutationKey: ["get-quote"],
    mutationFn: async ({
      recipient,
      inToken,
      outToken,
      inTokenAmount,
    }: GetQuoteParams) => {
      if (!smartAccountClient) return null;

      const routeOptions = {
        recipient,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.UNIVERSAL_ROUTER,
      };

      const rawAmount = fromReadableAmount(inTokenAmount, inToken.decimals);
      const route = await router.route(
        CurrencyAmount.fromRawAmount(inToken, toHex(rawAmount)),
        outToken,
        TradeType.EXACT_INPUT,
        routeOptions
      );

      if (!route) return null;

      const toSend = buildUserOperationForRoute(route, inToken, inTokenAmount);

      if (!toSend) return null;

      // build a batch UO
      // NOTE: if using a gas manager policy, this does result in a pending UO which costs towards the limit
      const uo = await smartAccountClient
        .buildUserOperation({
          uo: toSend,
        })
        .catch((err) => new Error("Failed to build UO", { cause: err }));

      return {
        route,
        uo,
        sponsored:
          "paymaster" in uo ||
          ("paymasterAndData" in uo && uo.paymasterAndData !== "0x"),
      };
    },
    retry: false,
  });

  return {
    fetchQuote: mutate,
    fetchQuoteAsync: mutateAsync,
    quote: data,
    quoteError: error,
    isFetchingQuote: isPending,
  };
};
