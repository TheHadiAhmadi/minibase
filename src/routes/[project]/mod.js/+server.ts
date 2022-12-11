import { API_URL } from "$env/static/private";
import type { RequestEvent } from "./$types";

export async function GET({ params }: RequestEvent) {
  const code = await fetch(`${API_URL}/${params.project}/mod.js`).then((res) =>
    res.text()
  );

  return new Response(code, {
    headers: { "Content-Type": "text/javascript" },
  });
}
