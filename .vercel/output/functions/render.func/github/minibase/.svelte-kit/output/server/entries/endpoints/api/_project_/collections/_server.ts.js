import { r as respond, R as ResponseError } from "../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../chunks/index5.js";
import { g as getCollections, a as addCollection } from "../../../../../chunks/collection.js";
import { v as validateApiKey } from "../../../../../chunks/apikey.js";
async function GET({ locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.READ_DATA]
  );
  const data = await getCollections({ project: params.project });
  return respond({ data });
}
async function POST({ request, locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.PROJECT_ADMIN],
    [APIKEY_SCOPES.WRITE_DATA]
  );
  const body = await request.json();
  if (!body.project || !body.schema || !body.name)
    throw new ResponseError(
      400,
      "body should have project, schema and name properties"
    );
  const data = await addCollection({ body });
  return respond({ data });
}
export {
  GET,
  POST
};
