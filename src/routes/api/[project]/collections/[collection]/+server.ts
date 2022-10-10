import {
  getRows,
  insertData,
  removeCollection,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import type { RequestEvent } from "./$types";

// get rows of collection
export async function GET({ request, params }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await getRows({
    project: params.project,
    collection: params.collection,
  });

  return respond({ data });
}

// insert data
export async function POST({ request, params }: RequestEvent) {
  const body = await request.json();
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  if (!body) throw new ResponseError(400, "body should be an object");

  const data = await insertData({
    project: params.project,
    collection: params.collection,
    body,
  });

  return respond({ data });
}

// delete collection
export async function DELETE({ request, params }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await removeCollection({
    project: params.project,
    name: params.collection,
  });

  return respond({ data });
}
