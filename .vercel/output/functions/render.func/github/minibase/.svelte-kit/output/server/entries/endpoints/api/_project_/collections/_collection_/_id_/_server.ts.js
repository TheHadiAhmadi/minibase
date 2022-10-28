import { r as respond, R as ResponseError } from "../../../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../../../chunks/index5.js";
import { a as getData, e as editData, d as deleteData } from "../../../../../../../chunks/data.js";
import { v as validateApiKey } from "../../../../../../../chunks/apikey.js";
async function GET({ locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_DATA],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await getData({
    project: params.project,
    collection: params.collection,
    id: params.id
  });
  return respond({ data });
}
async function PUT({ request, locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );
  const body = await request.json();
  if (!body)
    throw new ResponseError(400, "body should be an object");
  const data = await editData({
    project: params.project,
    collection: params.collection,
    id: params.id,
    body
  });
  return respond({ data });
}
async function DELETE({ locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );
  const data = await deleteData({
    project: params.project,
    collection: params.collection,
    id: params.id
  });
  return respond({ data });
}
export {
  DELETE,
  GET,
  PUT
};
