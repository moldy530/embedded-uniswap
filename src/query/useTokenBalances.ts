import { SupportedAccountTypes } from "@alchemy/aa-alchemy/config";
import {
  UseAccountResult,
  useBundlerClient,
  useChain,
} from "@alchemy/aa-alchemy/react";
import { useQuery } from "@tanstack/react-query";
import { Alchemy } from "alchemy-sdk";
import { useMemo } from "react";

type UseTokenHoldingsProps = {
  account: UseAccountResult<SupportedAccountTypes>["account"];
};

/**
 * A hook for fetching known ERC20 tokens for an address
 */
export const useTokenHoldings = ({ account }: UseTokenHoldingsProps) => {
  const { chain } = useChain({});
  const bundlerClient = useBundlerClient();
  // TODO: we should create a singleton of this by chain or have it live in a context somewhere
  const alchemySdk = useMemo(
    () =>
      new Alchemy({
        url: bundlerClient.transport.url,
      }),
    [bundlerClient.transport.url]
  );

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    error: errorLoadingTokens,
  } = useQuery({
    queryKey: ["tokens", chain.id, account?.address],
    queryFn: async () => {
      if (!account) return null;
      const tokens = await alchemySdk.core.getTokensForOwner(account?.address);
      return tokens.tokens;
    },
  });

  return {
    tokens,
    isLoadingTokens,
    errorLoadingTokens,
  };
};
