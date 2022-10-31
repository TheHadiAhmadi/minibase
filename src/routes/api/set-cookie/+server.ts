import type { RequestEvent } from "./$types";

export async function POST({ request, cookies }: RequestEvent) {
  const body = await request.json();
  const value = body.value;
  cookies.set("apiKey", value, { path: "/" });
  return new Response();
}
