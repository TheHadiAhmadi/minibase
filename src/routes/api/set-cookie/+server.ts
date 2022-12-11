import type { RequestEvent } from "./$types";

export async function POST({ request, cookies }: RequestEvent) {
  const body = await request.json();
  const value = body.value;
  console.log("set cookie", { body });
  cookies.set("apiKey", value, { path: "/" });

  console.log(cookies.get("apiKey"));
  return new Response();
}
