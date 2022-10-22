import {
  addFunction,
  respond,
  ResponseError,
  validateApiKey,
  getFunctions,
} from "$server/services";
import { APIKEY_SCOPES } from "../../../../types";

import type { RequestEvent } from "./$types";

export async function GET({ params, locals, request }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await getFunctions({ project: params.project });

  return respond({ data });
}

// Add Function
export async function POST({ request, locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const body = await request.json();

  if (!body.name || !body.code)
    throw new ResponseError(400, "Invalid request: name and code are required");

  if (!body.routes) body.routes = [];

  const data = await addFunction({ body, project: params.project });

  return respond({ data });
}
