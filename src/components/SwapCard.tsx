"use client";

import { gasPolicies } from "@/config/client";
import { getDefaultTokenForNetwork } from "@/constants";
import SwapArrows from "@/logos/swap-arrow";
import { useBalance } from "@/query/useBalance";
import {
  buildUserOperationForRoute,
  useQuoteRoute,
} from "@/query/useQuoteRoute";
import { fromReadableAmount } from "@/utils";
import {
  useChain,
  useSendUserOperation,
  useSmartAccountClient,
} from "@alchemy/aa-alchemy/react";
import { UserOperationStruct } from "@alchemy/aa-core";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { nativeOnChain } from "@uniswap/smart-order-router";
import { useEffect, useMemo, useState } from "react";
import { ChainPicker } from "./ChainPicker";
import { SwapField } from "./SwapField";

const getGasCost = (uo: UserOperationStruct) => {
  const { callGasLimit, preVerificationGas, verificationGasLimit } = uo;

  return (
    BigInt(callGasLimit ?? "0x0") +
    BigInt(preVerificationGas ?? "0x0") +
    BigInt(verificationGasLimit ?? "0x0")
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

  const { isSendingUserOperation, sendUserOperation, sendUserOperationResult } =
    useSendUserOperation({
      client,
      onError: console.error,
      waitForTxn: true,
    });

  const [inToken, setInToken] = useState<Token | NativeCurrency>(
    getDefaultTokenForNetwork(chain)
  );

  const [inAmount, setInAmount] = useState(0);

  const [outToken, setOutToken] = useState<Token | NativeCurrency>(
    getDefaultTokenForNetwork(chain, "out")
  );
  const [outAmount, setOutAmount] = useState(0);

  const { fetchQuoteAsync, isFetchingQuote, quote, quoteError } = useQuoteRoute(
    {
      smartAccountClient: client,
    }
  );

  const { balance, isLoadingBalance } = useBalance({
    token: inToken,
  });

  const { balance: nativeBalance } = useBalance({
    token: nativeOnChain(chain.id),
  });

  const canSubmit = useMemo(() => {
    if (
      isLoadingBalance ||
      isFetchingQuote ||
      !quote ||
      !balance ||
      !nativeBalance
    ) {
      return false;
    }

    // don't allow submissions if not enough balance
    const rawInAmount = fromReadableAmount(inAmount, inToken.decimals);
    if (balance.rawBalance < rawInAmount) {
      return false;
    }

    if (quote.uo instanceof Error) {
      return false;
    }

    const nativeCost =
      getGasCost(quote.uo) + BigInt(inToken.isNative ? rawInAmount : 0);

    if (!quote.sponsored && nativeBalance.rawBalance < nativeCost) {
      return false;
    }

    return true;
  }, [
    balance,
    inAmount,
    inToken.decimals,
    inToken.isNative,
    isFetchingQuote,
    isLoadingBalance,
    nativeBalance,
    quote,
  ]);

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

        setOutAmount(Number(x.route.quote.toExact()));
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
          <div>{address ? `Account Address: ${address}` : ""}</div>
        </div>
        <div className="flex flex-col gap-1 relative">
          <SwapField
            title="You pay"
            token={inToken}
            onTokenChange={setInToken}
            onInputChange={setInAmount}
          />
          <SwapField
            title="You receive"
            token={outToken}
            onTokenChange={setOutToken}
            value={outAmount}
            disabled
            loading={isFetchingQuote}
          />
          <button
            className="daisy-btn daisy-btn-square absolute self-end top-[114px] right-[24px] border-white border-2"
            onClick={() => {
              setInToken(outToken);
              setOutToken(inToken);
            }}
          >
            <SwapArrows />
          </button>
        </div>
        {(quoteError || quote?.uo instanceof Error) && (
          <details className="daisy-collapse daisy-collapse-arrow rounded-lg bg-red-100 text-red-700 text-sm">
            <summary className="daisy-collapse-title font-medium !flex !flex-row items-center">
              {quoteError ? "Error getting quote" : "Error in simulating UO"}
            </summary>
            <div className="daisy-collapse-content break-all">
              <span>
                {quoteError?.message ??
                  // @ts-ignore
                  (quote?.uo as Error | undefined)?.cause?.message}
              </span>
            </div>
          </details>
        )}
        {quote && !(quote.uo instanceof Error) && (
          <p className="text-sm text-slate-500">
            Gas Cost: {quote.sponsored ? 0 : getGasCost(quote.uo).toString()}
          </p>
        )}
        <button
          className="daisy-btn w-full"
          disabled={!canSubmit || isSendingUserOperation}
          onClick={() => {
            if (!quote) return;

            const uo = buildUserOperationForRoute(
              quote.route,
              inToken,
              inAmount
            );
            if (!uo) return;

            sendUserOperation({
              uo,
            });
          }}
        >
          {isSendingUserOperation && (
            <span className="daisy-loading daisy-loading-spinner daisy-loading-xs"></span>
          )}
          Swap
        </button>
        {sendUserOperationResult && (
          <p className="text-sm text-slate-500">
            tx: {sendUserOperationResult.hash}
          </p>
        )}
      </div>
    </div>
  );
};
