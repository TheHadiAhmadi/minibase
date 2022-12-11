import { PUBLIC_API_URL } from "$env/static/public";
import type { RequestEvent } from "./$types";

export async function GET({ params }: RequestEvent) {
  const code = await fetch(`${PUBLIC_API_URL}/${params.project}/mod.js`).then(
    (res) => res.text()
  );

  return new Response(code, {
    headers: { "Content-Type": "text/javascript" },
  });
}
