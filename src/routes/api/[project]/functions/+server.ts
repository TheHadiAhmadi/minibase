import {
  addFunction,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";

import type { ProjectInfoPromise } from "$types";
import type { RequestEvent } from "./$types";

export async function GET({ params, request }: RequestEvent) {
  const key = request.headers.get("ApiKey") ?? "";

  const project = await validateApiKey(params.project, key);

  if (!project) throw new ResponseError(401, "ApiKey in not valid");

  return respond({ data: await project.functions });
}

// Add Function
export async function POST({ request, params }: RequestEvent) {
  const body = await request.json();

  if (!body.name || !body.code)
    throw new ResponseError(400, "Invalid request: name and code are required");

  // apiKey
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const result = await addFunction({ body, project: params.project });

  return respond({ data: result });
}
