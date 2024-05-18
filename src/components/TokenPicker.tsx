import { popularTokens } from "@/constants";
import { useChain } from "@alchemy/aa-alchemy/react";
import { NativeCurrency, Token } from "@uniswap/sdk-core";
import { useCallback, useState } from "react";

export type TokenPickerProps = {
  onChange?: (token: Token | NativeCurrency) => void;
  defaultToken?: Token | NativeCurrency;
};

export const TokenPicker = ({ onChange, defaultToken }: TokenPickerProps) => {
  const { chain } = useChain({});
  const [selectedToken, setSelectedToken] = useState<Token | NativeCurrency>(
    () => defaultToken ?? popularTokens[chain.id][0]
  );

  const updateToken = useCallback(
    (token: Token | NativeCurrency) => {
      setSelectedToken(token);
      onChange?.(token);
    },
    [onChange]
  );

  return (
    <div className="daisy-dropdown daisy-dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="m-2 daisy-btn daisy-btn-ghost daisy-btn-sm"
      >
        {selectedToken.symbol}
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
  );
};
