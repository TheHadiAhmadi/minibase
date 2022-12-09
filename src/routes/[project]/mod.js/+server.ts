import type { RequestEvent } from "./$types";

export async function GET({ params }: RequestEvent) {
  const code = await fetch(
    `https://minibase-api.onrender.com/${params.project}/mod.js`
  ).then((res) => res.text());

  return new Response(code, {
    headers: { "Content-Type": "text/javascript" },
  });
}
