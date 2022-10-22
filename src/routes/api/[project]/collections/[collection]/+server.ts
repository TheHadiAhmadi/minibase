import {
  editCollection,
  getRows,
  insertData,
  removeCollection,
  respond,
  ResponseError,
  validateApiKey,
} from "$server/services";
import { APIKEY_SCOPES } from "../../../../../types";
import type { RequestEvent } from "./$types";

// get rows of collection
export async function GET({ locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const data = await getRows({
    project: params.project,
    collection: params.collection,
  });

  return respond({ data });
}

// insert data
export async function POST({ locals, request, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const body = await request.json();

  if (!body) throw new ResponseError(400, "body should be an object");

  const data = await insertData({
    project: params.project,
    collection: params.collection,
    body,
  });

  return respond({ data });
}

// edit collection
export async function PUT({ locals, request, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const body = await request.json();

  if (!body) throw new ResponseError(400, "Body should be an object");

  const data = await editCollection({ name: params.collection, body });
  return respond({ data });
}

// delete collection
export async function DELETE({ locals, params }: RequestEvent) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );

  const data = await removeCollection({
    project: params.project,
    name: params.collection,
  });

  return respond({ data });
}
