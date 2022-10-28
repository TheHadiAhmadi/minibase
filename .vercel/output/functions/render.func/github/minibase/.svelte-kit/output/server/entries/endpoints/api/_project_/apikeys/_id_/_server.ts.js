import { r as respond } from "../../../../../../chunks/index4.js";
import { A as APIKEY_SCOPES } from "../../../../../../chunks/index5.js";
import { v as validateApiKey, r as removeApiKey } from "../../../../../../chunks/apikey.js";
async function DELETE({ params, locals }) {
  await validateApiKey(params.project, locals.apiKey, [
    APIKEY_SCOPES.PROJECT_ADMIN
  ]);
  const data = await removeApiKey({ id: params.id, project: params.project });
  return respond({ data });
}
export {
  DELETE
};
