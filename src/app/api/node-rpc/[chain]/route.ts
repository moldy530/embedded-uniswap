import { NextResponse } from "next/server";

import { chainConfigs } from "@/config/server";

export async function POST(
  req: Request,
  { params }: { params: { chain: string } }
) {
  const body = await req.json();

  const chainCofig = chainConfigs[Number(params.chain)];
  const res = await fetch(chainCofig.rpcUrl + `/${chainCofig.apiKey}`, {
    method: "POST",
    headers: {
      ...req.headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json(await res.json().catch((e) => ({})), {
      status: res.status,
    });
  }

  return NextResponse.json(await res.json());
}
