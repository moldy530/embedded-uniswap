import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    SEPOLIA_API_KEY: z.string(),
    SEPOLIA_GAS_POLICY_ID: z.string().optional(),
    OPT_MAINNET_API_KEY: z.string(),
    OPT_MAINNET_GAS_POLICY_ID: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPT_MAINNET_API_KEY: process.env.OPT_MAINNET_API_KEY,
    OPT_MAINNET_GAS_POLICY_ID: process.env.OPT_MAINNET_GAS_POLICY_ID,
    SEPOLIA_API_KEY: process.env.SEPOLIA_API_KEY,
    SEPOLIA_GAS_POLICY_ID: process.env.SEPOLIA_GAS_POLICY_ID,
  },
});
