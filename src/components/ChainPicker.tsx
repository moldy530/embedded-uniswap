import OptimismLogo from "@/logos/optimism";
import SepoliaLogo from "@/logos/sepolia";
import { useChain } from "@alchemy/aa-alchemy/react";
import { optimism, sepolia } from "@alchemy/aa-core";

const chains = [sepolia, optimism];
const logos = {
  [sepolia.id]: <SepoliaLogo height={16} width={16} />,
  [optimism.id]: <OptimismLogo height={16} width={16} />,
};

export const ChainPicker = () => {
  const { chain, setChain } = useChain({});
  return (
    <div className="daisy-dropdown daisy-dropdown-end">
      <div tabIndex={0} role="button" className="m-2 daisy-btn daisy-btn-sm">
        {logos[chain.id]}
        {chain.name}
      </div>
      <ul
        tabIndex={0}
        className="p-2 shadow daisy-menu daisy-dropdown-content z-[1] bg-base-100 rounded-box w-52"
      >
        {chains.map((c) => (
          <li key={c.id}>
            <a onClick={() => setChain({ chain: c })}>
              {logos[c.id]}
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
