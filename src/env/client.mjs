import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_SEPOLIA_GAS_POLICY_ID: z.string().optional(),
    NEXT_PUBLIC_OPT_MAINNET_GAS_POLICY_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SEPOLIA_GAS_POLICY_ID:
      process.env.NEXT_PUBLIC_SEPOLIA_GAS_POLICY_ID,
    NEXT_PUBLIC_OPT_MAINNET_GAS_POLICY_ID:
      process.env.NEXT_PUBLIC_OPT_MAINNET_GAS_POLICY_ID,
  },
});
