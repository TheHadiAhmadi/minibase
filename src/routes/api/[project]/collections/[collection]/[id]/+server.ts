import {
  respond,
  ResponseError,
  validateApiKey,
  editData,
  deleteData,
  getData,
} from "$server/services";
import type { RequestEvent } from "./$types";

// get data
export async function GET({ request, params }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await getData({
    project: params.project,
    collection: params.collection,
    id: params.id,
  });
  return respond({ data });
}

// edit data
export async function PUT({ request, params }: RequestEvent) {
  const body = await request.json();
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  if (!body) throw new ResponseError(400, "body should be an object");
  const data = await editData({
    project: params.project,
    collection: params.collection,
    id: params.id,
    body,
  });
  return respond({ data });
}

// delete data
export async function DELETE({ request, params }: RequestEvent) {
  await validateApiKey(params.project, request.headers.get("ApiKey"));

  const data = await deleteData({
    project: params.project,
    collection: params.collection,
    id: params.id,
  });
  return respond({ data });
}
