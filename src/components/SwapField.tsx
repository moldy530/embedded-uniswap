import { popularTokens } from "@/constants";
import { useBalance } from "@/query/useBalance";
import { useChain } from "@alchemy/aa-alchemy/react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { useCallback } from "react";

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

  const updateToken = useCallback(
    (token: Token | NativeCurrency) => {
      onTokenChange?.(token);
    },
    [onTokenChange]
  );

  const { balance } = useBalance({
    token,
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
          <ul
            tabIndex={0}
            className="p-2 shadow daisy-menu daisy-dropdown-content z-[1] bg-base-100 rounded-box w-52"
          >
            {popularTokens[chain.id].map((token) => (
              <li key={token.symbol}>
                <a onClick={() => updateToken(token)}>{token.symbol}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        Balance: {balance?.formattedBalance ?? "0"}
      </p>
    </div>
  );
};
