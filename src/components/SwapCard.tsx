"use client";

import { gasPolicies } from "@/config/client";
import { getDefaultTokenForNetwork } from "@/constants";
import { fromReadableAmount } from "@/utils";
import {
  useBundlerClient,
  useChain,
  useSmartAccountClient,
} from "@alchemy/aa-alchemy/react";
import { Web3Provider } from "@ethersproject/providers";
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
import { useEffect, useMemo, useState } from "react";
import { toHex } from "viem";
import { ChainPicker } from "./ChainPicker";
import { TokenPicker, TokenPickerProps } from "./TokenPicker";

const SwapField = ({
  title,
  defaultToken,
  onTokenChange,
  disabled,
  onInputChange,
  value,
}: {
  title: string;
  onTokenChange: TokenPickerProps["onChange"];
  onInputChange?: (amount: number) => void;
  value?: number;
  disabled?: boolean;
} & Omit<TokenPickerProps, "onChange">) => {
  return (
    <div className="flex flex-col w-full bg-base-200 rounded-lg p-4 gap-2">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="flex flex-row justify-between gap-2 items-center">
        <input
          type="number"
          className="daisy-input daisy-input-ghost w-full text-xl flex-1 active:bg-inherit focus:bg-inherit disabled:text-[var(--fallback-bc)]"
          placeholder="0"
          disabled={disabled}
          value={value === 0 ? "" : value}
          onChange={(e) => onInputChange?.(Number(e.target.value))}
        ></input>
        <TokenPicker defaultToken={defaultToken} onChange={onTokenChange} />
      </div>
    </div>
  );
};

export const SwapCard = () => {
  const { chain } = useChain({});
  const gasManagerConfig = useMemo(() => {
    const policyId = gasPolicies[chain.id]?.policyId;
    if (!policyId) return undefined;

    return {
      policyId,
    };
  }, [chain.id]);

  const bundlerClient = useBundlerClient();
  const { client, address } = useSmartAccountClient({
    type: "LightAccount",
    gasManagerConfig,
  });

  const [inToken, setInToken] = useState<Token | NativeCurrency>(
    getDefaultTokenForNetwork(chain)
  );

  const [inAmount, setInAmount] = useState(0);

  const [outToken, setOutToken] = useState<Token | NativeCurrency>(
    getDefaultTokenForNetwork(chain, "out")
  );
  const [outAmount, setOutAmount] = useState(0);

  const router = useMemo(() => {
    return new AlphaRouter({
      chainId: chain.id,
      provider: new Web3Provider(bundlerClient),
    });
  }, [bundlerClient, chain.id]);

  useEffect(() => {
    setInToken(getDefaultTokenForNetwork(chain));
    setOutToken(getDefaultTokenForNetwork(chain, "out"));
  }, [chain]);

  useEffect(() => {
    // TODO: need to debounce this
    if (!router || !address || inAmount === 0) return;

    const routeOptions: SwapOptionsSwapRouter02 = {
      recipient: address,
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
    };

    const route = router.route(
      CurrencyAmount.fromRawAmount(
        inToken,
        toHex(fromReadableAmount(inAmount, inToken.decimals))
      ),
      outToken,
      TradeType.EXACT_INPUT,
      routeOptions
    );

    route.catch(console.error).then((x) => {
      if (!x) return;

      setOutAmount(Number(x.quote.toSignificant()));
    });
  }, [address, inAmount, inToken, outToken, router]);

  return (
    <div className="daisy-card bg-base-100 shadow-xl w-[500px] max-w-[500px]">
      <div className="daisy-card-body gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h2 className="daisy-card-title">Swap</h2>
            <ChainPicker />
          </div>
          <div>{address ? `Address: ${address}` : ""}</div>
        </div>
        <div className="flex flex-col gap-1 relative">
          <SwapField
            title="You pay"
            defaultToken={getDefaultTokenForNetwork(chain)}
            onTokenChange={setInToken}
            onInputChange={setInAmount}
            value={inAmount}
          />
          <SwapField
            title="You receive"
            defaultToken={getDefaultTokenForNetwork(chain, "out")}
            onTokenChange={setOutToken}
            value={outAmount}
            disabled
          />
        </div>
      </div>
    </div>
  );
};
