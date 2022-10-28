import { r as respond } from "../../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../../chunks/index5.js";
import { e as editFunction, r as removeFunction } from "../../../../../../chunks/function.js";
import { v as validateApiKey } from "../../../../../../chunks/apikey.js";
async function PUT({ params, locals, request }) {
  console.log({ locals });
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const body = await request.json();
  const data = await editFunction({ id: params.id, body });
  return respond({ data });
}
async function DELETE({ params, locals, request }) {
  await validateApiKey(
    params.project,
    locals.apiKey,
    [APIKEY_SCOPES.WRITE_FUNCTION],
    [APIKEY_SCOPES.PROJECT_ADMIN]
  );
  const data = await removeFunction({ id: params.id });
  return respond({ data });
}
export {
  DELETE,
  PUT
};
