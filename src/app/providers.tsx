"use client";
import { config, queryClient, uiConfig } from "@/config/client";
import { AlchemyClientState } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountProvider } from "@alchemy/aa-alchemy/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";

export const Providers = ({
  intialData,
  children,
}: PropsWithChildren<{ intialData?: AlchemyClientState }>) => {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider
          config={config}
          queryClient={queryClient}
          uiConfig={uiConfig}
          initialState={intialData}
        >
          {children}
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
