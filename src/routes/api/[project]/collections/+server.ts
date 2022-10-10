import {
  addCollection,
  getCollections,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import type { ProjectCollection } from "$types";
import type { RequestEvent } from "./$types";

export async function GET({ request, params }: RequestEvent) {
  const project = await validateApiKey(
    params.project,
    request.headers.get("ApiKey")
  );

  const data = await project.collections;
  return respond({ data });
}

export async function POST({ request, params }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));
  const body = (await request.json()) as ProjectCollection;

  if (!body.project || !body.schema || !body.name)
    throw new ResponseError(
      400,
      "body should have project, schema and name properties"
    );

  const data = await addCollection({ body });
  return respond({ data });
}
