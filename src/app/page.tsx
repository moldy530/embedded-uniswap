"use client";

import { uiConfig } from "@/config/client";
import { AuthCard, useSignerStatus, useUser } from "@alchemy/aa-alchemy/react";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const signerStatus = useSignerStatus();
  const user = useUser();
  const { push } = useRouter();

  if (user) {
    redirect("/swap");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center">
      {signerStatus.isInitializing ? (
        <span className="daisy-loading daisy-loading-ring daisy-loading-lg"></span>
      ) : (
        <div className="daisy-card bg-base-100 shadow-xl w-[420px] max-w-[420px]">
          <div className="daisy-card-body">
            <AuthCard {...uiConfig?.auth} onAuthSuccess={() => push("/swap")} />
          </div>
        </div>
      )}
    </main>
  );
}
