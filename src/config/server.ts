import { serverEnv as env } from "@/env/server.mjs";
import { optimism, sepolia } from "@alchemy/aa-core";

export const chainConfigs = {
  [sepolia.id]: {
    rpcUrl: sepolia.rpcUrls.alchemy.http[0],
    apiKey: env.SEPOLIA_API_KEY,
  },
  [optimism.id]: {
    rpcUrl: optimism.rpcUrls.alchemy.http[0],
    apiKey: env.OPT_MAINNET_API_KEY,
  },
};
