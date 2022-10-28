import { r as respond, R as ResponseError } from "../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../chunks/index5.js";
import { g as getFunctions, a as addFunction } from "../../../../../chunks/function.js";
import { v as validateApiKey } from "../../../../../chunks/apikey.js";
async function GET({ params, locals, request }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.READ_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await getFunctions({ project: params.project });
  return respond({ data });
}
async function POST({ request, locals, params }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const body = await request.json();
  if (!body.name || !body.code)
    throw new ResponseError(400, "Invalid request: name and code are required");
  if (!body.routes)
    body.routes = [];
  const data = await addFunction({ body, project: params.project });
  return respond({ data });
}
export {
  GET,
  POST
};
