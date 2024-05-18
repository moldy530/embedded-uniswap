import { optimism, sepolia } from "@alchemy/aa-core";
import {
  USDC_OPTIMISM,
  USDC_SEPOLIA,
  nativeOnChain,
} from "@uniswap/smart-order-router";
import { Chain } from "viem";

// this assumes the first token is the native currency
export const getDefaultTokenForNetwork = (chain: Chain, dir?: "in" | "out") => {
  if (dir === "out") {
    return popularTokens[chain.id].at(-1)!;
  }

  return nativeOnChain(chain.id);
};

export const popularTokens = {
  [sepolia.id]: [
    nativeOnChain(sepolia.id),
    nativeOnChain(sepolia.id).wrapped,
    USDC_SEPOLIA,
  ],
  [optimism.id]: [
    nativeOnChain(sepolia.id),
    nativeOnChain(sepolia.id).wrapped,
    USDC_OPTIMISM,
  ],
};
