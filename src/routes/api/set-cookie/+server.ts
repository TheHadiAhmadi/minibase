import { respond } from "$server/services";
import type { RequestEvent } from "./$types";

export async function POST({ cookies, request }: RequestEvent) {
  const body = await request.json();

  cookies.set(body.name, body.value, { path: "/", httpOnly: true, maxAge: 10 * 365 * 24 * 60 * 60 });
  return respond({ success: true });
}
