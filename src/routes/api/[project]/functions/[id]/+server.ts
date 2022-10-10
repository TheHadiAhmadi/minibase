import {
  editFunction,
  removeFunction,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import type { RequestEvent } from "./$types";

export async function PUT({ params, request }: RequestEvent) {
  const body = await request.json();
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await editFunction({ id: params.id, body });

  return respond({ data });
}

export async function DELETE({ params, request }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await removeFunction({ id: params.id });

  return respond({ data });
}
