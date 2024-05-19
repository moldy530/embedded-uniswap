import { clientEnv } from "@/env/client.mjs";
import { cookieStorage, createConfig } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountsProviderProps } from "@alchemy/aa-alchemy/react";
import { optimism, sepolia } from "@alchemy/aa-core";
import { QueryClient } from "@tanstack/react-query";

export const gasPolicies = {
  [sepolia.id]: {
    policyId: clientEnv.NEXT_PUBLIC_SEPOLIA_GAS_POLICY_ID,
  },
  [optimism.id]: {
    policyId: clientEnv.NEXT_PUBLIC_OPT_MAINNET_GAS_POLICY_ID,
  },
};

export const config = createConfig({
  // required
  chain: optimism,
  connections: [
    {
      chain: sepolia,
      rpcUrl: `/api/node-rpc/${sepolia.id}`,
    },
    {
      chain: optimism,
      rpcUrl: `/api/node-rpc/${optimism.id}`,
    },
  ],
  signerConnection: {
    rpcUrl: `/api/signer-rpc`,
  },
  storage: cookieStorage,
  ssr: true,
});

export const uiConfig: AlchemyAccountsProviderProps["uiConfig"] = {
  auth: {
    sections: [[{ type: "email" }], [{ type: "passkey" }]],
    addPasskeyOnSignup: true,
  },
};

export const queryClient = new QueryClient();
