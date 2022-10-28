import { d as db, R as ResponseError } from "./index4.js";
import { nanoid } from "nanoid";
const addApiKey = async ({ project, body }) => {
  const id = crypto.randomUUID();
  const apiKey = {
    id,
    project,
    name: body.name,
    value: "mb_" + nanoid(32),
    scopes: body.scopes ?? []
  };
  console.log("insert to db", {
    ...apiKey,
    scopes: JSON.stringify(apiKey.scopes)
  });
  await db("keys").insert({ ...apiKey, scopes: JSON.stringify(apiKey.scopes) });
  return apiKey;
};
const getApiKey = async ({ project, value }) => {
  console.log(project);
  const key = await db("keys").select("*").where({ project, value }).first();
  return {
    ...key,
    scopes: JSON.parse(key.scopes)
  };
};
const getApiKeys = async ({ project }) => {
  const keys = await db("keys").select("id", "name", "scopes").where({ project });
  return keys.map((k) => ({ ...k, scopes: JSON.parse(k.scopes) }));
};
const removeApiKey = async ({ id, project }) => {
  await db("keys").delete().where({ id, project });
  return true;
};
const validateApiKey = async (project, apiKey = "", ...scopeGroups) => {
  const key = await getApiKey({ project, value: apiKey ?? "" });
  const keyScopes = key && key.scopes || [];
  const accesses = scopeGroups.map((scopes) => {
    for (let i = 0; i < scopes.length; i++) {
      if (!keyScopes.includes(scopes[i])) {
        return false;
      }
    }
    return true;
  });
  const hasAccess = accesses.some((value) => value === true);
  if (!hasAccess)
    throw new ResponseError(401, "You don't have access");
  return keyScopes;
};
export {
  addApiKey as a,
  getApiKeys as g,
  removeApiKey as r,
  validateApiKey as v
};
