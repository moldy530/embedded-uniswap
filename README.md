# Uniswap AA Demo

This app uses the Alchemy's AA stack and Uniswap v3 SDK to demo swapping of tokens using a Smart Contract Account. Right now, it is configured with Optimism Mainnet and ETH Sepolia for testnet. Routing is done using the SwapRouter to leverage multiple pools for doing swaps.

### Known Issues

- Swapping from ETH <-> WETH throws an error. This seems to be happening within the Uniswap SDK because at some point the generated route contains a swap from WETH -> WETH, which causes an invariant violation. To fix this, I think a good approach is to branch the logic for swaps when going from native token to its wrapped version. The Uniswap SDK contains definitions for which contract is the wrapped token so we can catch this early on. When we see this to happen, we can create our own route for the trade that just uses a singe pool route for ETH <-> WETH. The process for this is outlined [here](https://docs.uniswap.org/sdk/v3/guides/swaps/quoting#computing-the-pools-deployment-address).
- Completing a swap successfully on one chain and then switching chains results in failed UO simulation due to `Account not deployed` errors. This is a bug in the `aa-sdk` introduced when multiple chain configs were added to the `AccountContext`. The root cause is that the config for an account is cached in `Storage` so that refreshes can optimistcally render account info. This is not synced with the `chain` state at the moment and is not being correctly re-generated on chain changes.

## Setup

Create your own `.env` file by copying the `.sample.env` file.

To use the Alchemy Signer in this demo, you will need to:

1. Create an Alchemy App and get your API Key. Go to the [Alchemy Dashboard](https://dashboard.alchemy.com/signup/?a=aa-docs). Create a new app on Ethereum Sepolia. Access your credentials for this app then paste the API KEY in to the `.env` file. If you want to test on Optimism Mainnet, create an App for Optimism as well.

<img src="/images/alchemy-dashboard.png" width="auto" height="auto" alt="Account Kit Overview" style="display: block; margin: auto;">

2. Create a new account config in your [Alchemy Accounts Manager Dashbord](https://dashboard.alchemy.com/accounts). Make sure to set the redirect url to http://localhost:3000 for testing this demo and connect this to the app you made in step 1. If you created an Optimism app as well, then add it to the account config during setup.

<img src="/images/alchemy-accounts-dashboard.png" width="auto" height="auto" alt="Create new embedded account config" style="display: block; margin: auto;">

The account config allows you to customize the signup and login authentication email that will be sent to users when logging in to your dapp. Apply the config to the app your created in the step above.

<img src="/images/create-account-config.png" width="auto" height="auto" alt="Account Kit Overview" style="display: block; margin: auto;">

3. (Optional) Create a Gas Policy for either or both chains in the [Gas Manager](https://dashboard.alchemy.com/gas-manager). Mainnets require a paid subscription, but testnets are free.

## Getting Started

Make sure you are using Node.js version >= 18.17.0.

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
