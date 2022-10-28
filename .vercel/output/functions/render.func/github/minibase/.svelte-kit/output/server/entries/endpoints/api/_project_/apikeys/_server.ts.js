import { r as respond, R as ResponseError } from "../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../chunks/index5.js";
import { v as validateApiKey, g as getApiKeys, a as addApiKey } from "../../../../../chunks/apikey.js";
async function GET({ params, locals }) {
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN
  ]);
  const data = await getApiKeys({ project: params.project });
  return respond({ data });
}
async function POST({ request, params, locals }) {
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN
  ]);
  const body = await request.json();
  if (!body.name || !body.scopes) {
    throw new ResponseError(400, "body should have name and scopes field");
  }
  const data = await addApiKey({ project: params.project, body });
  return respond({ data });
}
export {
  GET,
  POST
};
