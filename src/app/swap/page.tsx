"use client";
import { SwapCard } from "@/components/SwapCard";
import { useUser } from "@alchemy/aa-alchemy/react";
import { redirect } from "next/navigation";

function Swap() {
  const user = useUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center">
      <SwapCard />
    </main>
  );
}

export default Swap;
