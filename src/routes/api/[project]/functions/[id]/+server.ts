import {
  editFunction,
  removeFunction,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import { APIKEY_SCOPES } from "../../../../../types";
import type { RequestEvent } from "./$types";

// edit function
export async function PUT({ params, locals, request }: RequestEvent) {
  console.log({locals})
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const body = await request.json();

  const data = await editFunction({ id: params.id, body });

  return respond({ data });
}

// Delete function
export async function DELETE({ params, locals, request }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const data = await removeFunction({ id: params.id });

  return respond({ data });
}
