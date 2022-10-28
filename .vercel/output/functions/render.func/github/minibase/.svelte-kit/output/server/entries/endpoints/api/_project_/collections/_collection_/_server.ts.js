import { r as respond, R as ResponseError } from "../../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../../chunks/index5.js";
import { g as getRows, i as insertData } from "../../../../../../chunks/data.js";
import { e as editCollection, r as removeCollection } from "../../../../../../chunks/collection.js";
import { v as validateApiKey } from "../../../../../../chunks/apikey.js";
async function GET({ locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await getRows({
    project: params.project,
    collection: params.collection
  });
  return respond({ data });
}
async function POST({ locals, request, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const body = await request.json();
  if (!body)
    throw new ResponseError(400, "body should be an object");
  const data = await insertData({
    project: params.project,
    collection: params.collection,
    body
  });
  return respond({ data });
}
async function PUT({ locals, request, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const body = await request.json();
  if (!body)
    throw new ResponseError(400, "Body should be an object");
  const data = await editCollection({ name: params.collection, body });
  return respond({ data });
}
async function DELETE({ locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await removeCollection({
    project: params.project,
    name: params.collection
  });
  return respond({ data });
}
export {
  DELETE,
  GET,
  POST,
  PUT
};
