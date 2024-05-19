import { popularTokens } from "@/constants";
import { useBalance } from "@/query/useBalance";
import { useTokenHoldings } from "@/query/useTokenBalances";
import { useTokenMetadata } from "@/query/useTokenMetadata";
import { useAccount, useChain } from "@alchemy/aa-alchemy/react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { useCallback, useState } from "react";

export const SwapField = ({
  title,
  token,
  onTokenChange,
  disabled,
  onInputChange,
  value,
  loading,
}: {
  title: string;
  onTokenChange: (token: Token | NativeCurrency) => void;
  token: Token | NativeCurrency;
  onInputChange?: (amount: number) => void;
  value?: number;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const { chain } = useChain({});
  const { account } = useAccount({
    type: "LightAccount",
  });

  const updateToken = useCallback(
    (token: Token | NativeCurrency) => {
      onTokenChange?.(token);
    },
    [onTokenChange]
  );

  const { balance } = useBalance({
    token,
  });

  const [searchToken, setSearchToken] = useState<string>("");

  const { tokens } = useTokenHoldings({ account });
  const { tokenMetadata, isLoadingTokenMetadata } = useTokenMetadata({
    address: searchToken,
  });

  return (
    <div className="flex flex-col w-full bg-base-200 rounded-lg p-4 gap-2">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="flex flex-row justify-between gap-2 items-center">
        <label className="daisy-input daisy-input-ghost flex items-center gap-2 active:bg-inherit focus:bg-inherit bg-inherit !text-[unset]">
          <input
            type="number"
            className="w-full text-xl flex-1 active:bg-inherit focus:bg-inherit disabled:!text-[unset]"
            placeholder="0"
            step={"any"}
            disabled={disabled}
            value={value === 0 ? "" : value}
            onChange={(e) => onInputChange?.(Number(e.target.value))}
          ></input>
          {loading && (
            <span className="daisy-loading daisy-loading-spinner daisy-loading-xs"></span>
          )}
        </label>
        <div className="daisy-dropdown daisy-dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="m-2 daisy-btn daisy-btn-ghost daisy-btn-sm"
          >
            {token.symbol}
          </div>
          <div
            tabIndex={0}
            className="flex flex-col gap-2 daisy-dropdown-content daisy-card daisy-card-compact z-10"
          >
            <ul className="p-4 shadow daisy-menu daisy-dropdown-content z-[1] bg-base-100 rounded-box w-52 gap-3">
              {/* TODO: add the ability to search for a token */}
              <input
                className="daisy-input daisy-input-bordered daisy-input-sm w-full"
                placeholder="Enter a token address"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
              ></input>
              {isLoadingTokenMetadata ? (
                <span className="daisy-loading daisy-loading-spinner daisy-loading-xs"></span>
              ) : tokenMetadata ? (
                <li>
                  <a
                    onClick={() =>
                      updateToken(
                        new Token(
                          chain.id,
                          searchToken,
                          tokenMetadata.decimals ?? 18,
                          tokenMetadata.symbol ?? undefined,
                          tokenMetadata.name ?? undefined
                        )
                      )
                    }
                  >
                    {tokenMetadata.symbol}
                  </a>
                </li>
              ) : null}
              <div>
                <h3>Popular Tokens</h3>
                {popularTokens[chain.id].map((token) => (
                  <li key={token.symbol}>
                    <a onClick={() => updateToken(token)}>{token.symbol}</a>
                  </li>
                ))}
              </div>
              <div>
                <h3>Your Tokens</h3>
                {tokens?.map((t) => (
                  <li key={t.symbol}>
                    <a
                      onClick={() =>
                        updateToken(
                          new Token(
                            chain.id,
                            t.contractAddress,
                            t.decimals ?? 18,
                            t.symbol,
                            t.name
                          )
                        )
                      }
                    >
                      {t.symbol} ({t.balance ?? "0"})
                    </a>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        Balance: {balance?.formattedBalance ?? "0"}
      </p>
    </div>
  );
};
