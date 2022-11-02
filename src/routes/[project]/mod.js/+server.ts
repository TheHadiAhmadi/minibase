import { getClientSideCode } from "$services/client-side-code";
import type { RequestEvent } from "./$types";

export async function GET({ params }: RequestEvent) {
  const code = await getClientSideCode(params.project);

  return new Response(code, {
    headers: { "Content-Type": "text/javascript" },
  });
}
