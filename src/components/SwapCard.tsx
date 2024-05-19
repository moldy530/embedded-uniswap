"use client";

import { gasPolicies } from "@/config/client";
import { getDefaultTokenForNetwork } from "@/constants";
import { useQuoteRoute } from "@/query/useQuoteRoute";
import { useChain, useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { useEffect, useMemo, useState } from "react";
import { ChainPicker } from "./ChainPicker";
import { TokenPicker, TokenPickerProps } from "./TokenPicker";

const SwapField = ({
  title,
  defaultToken,
  onTokenChange,
  disabled,
  onInputChange,
  value,
  loading,
}: {
  title: string;
  onTokenChange: TokenPickerProps["onChange"];
  onInputChange?: (amount: number) => void;
  value?: number;
  disabled?: boolean;
  loading?: boolean;
} & Omit<TokenPickerProps, "onChange">) => {
  return (
    <div className="flex flex-col w-full bg-base-200 rounded-lg p-4 gap-2">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="flex flex-row justify-between gap-2 items-center">
        <label className="daisy-input daisy-input-ghost flex items-center gap-2 active:bg-inherit focus:bg-inherit bg-inherit !text-[unset]">
          <input
            type="number"
            className="w-full text-xl flex-1 active:bg-inherit focus:bg-inherit disabled:!text-[unset]"
            placeholder="0"
            disabled={disabled}
            value={value === 0 ? "" : value}
            onChange={(e) => onInputChange?.(Number(e.target.value))}
          ></input>
          {loading && (
            <span className="daisy-loading daisy-loading-spinner daisy-loading-xs"></span>
          )}
        </label>

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

  const { fetchQuoteAsync, isFetchingQuote } = useQuoteRoute();

  useEffect(() => {
    setInToken(getDefaultTokenForNetwork(chain));
    setOutToken(getDefaultTokenForNetwork(chain, "out"));
  }, [chain]);

  useEffect(() => {
    if (inAmount === 0) {
      setOutAmount(0);
      return;
    }

    if (!address) return;

    // debounces the input
    const timeout = setTimeout(() => {
      fetchQuoteAsync({
        inToken,
        outToken,
        recipient: address,
        inTokenAmount: inAmount,
      }).then((x) => {
        if (!x) return;

        setOutAmount(Number(x.quote.toExact()));
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [address, fetchQuoteAsync, inAmount, inToken, outToken]);

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
            loading={isFetchingQuote}
          />
        </div>
      </div>
    </div>
  );
};
