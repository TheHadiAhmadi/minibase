import {
  respond,
  ResponseError,
  validateApiKey,
  editData,
  deleteData,
  getData,
} from "$server/services";
import { APIKEY_SCOPES } from "../../../../../../types";
import type { RequestEvent } from "./$types";

// get data
export async function GET({ locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const data = await getData({
    project: params.project,
    collection: params.collection,
    id: params.id,
  });
  return respond({ data });
}

// edit data
export async function PUT({ request, locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );

  const body = await request.json();

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
export async function DELETE({ locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );

  const data = await deleteData({
    project: params.project,
    collection: params.collection,
    id: params.id,
  });
  return respond({ data });
}
