import { useBundlerClient, useChain } from "@alchemy/aa-alchemy/react";
import { useQuery } from "@tanstack/react-query";
import { Alchemy } from "alchemy-sdk";
import { useMemo } from "react";
import { isAddress } from "viem";

type Props = {
  address?: string;
};

export const useTokenMetadata = ({ address }: Props) => {
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
    data: tokenMetadata,
    isLoading: isLoadingTokenMetadata,
    error: errorLoadingTokenMetadata,
  } = useQuery({
    queryKey: ["token", chain.id, address],
    queryFn: async () => {
      if (!address || !isAddress(address, { strict: true })) return null;

      const metadata = await alchemySdk.core.getTokenMetadata(address);

      if (
        !metadata ||
        (metadata.decimals == null &&
          metadata.logo == null &&
          metadata.name == "" &&
          metadata.symbol == "")
      )
        return null;

      return metadata;
    },
  });

  return {
    tokenMetadata,
    isLoadingTokenMetadata,
    errorLoadingTokenMetadata,
  };
};
