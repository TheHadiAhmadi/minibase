import type { RequestEvent } from "./$types";

export async function GET({ params }: RequestEvent) {
  const code = await fetch(`https://cloud-3.domcloud.io/${params.project}/cdn.js`).then(
    (res) => res.text()
  );

  return new Response(code, {
    headers: { "Content-Type": "text/javascript" },
  });
}
