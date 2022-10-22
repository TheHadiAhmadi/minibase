import {
  addCollection,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import type { ProjectCollection } from "$types";
import { getCollections } from "../../../../server/services";
import { APIKEY_SCOPES } from "../../../../types";
import type { RequestEvent } from "./$types";

// return list of collections
export async function GET({ locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.READ_DATA]
  );

  const data = await getCollections({ project: params.project });

  return respond({ data });
}

// add new collection
export async function POST({ request, locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );
  const body = (await request.json()) as ProjectCollection;

  if (!body.project || !body.schema || !body.name)
    throw new ResponseError(
      400,
      "body should have project, schema and name properties"
    );

  const data = await addCollection({ body });
  return respond({ data });
}
