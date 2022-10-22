import db from "$server/db";
import type { ApiKeyScopes } from "$types/services";
import { nanoid } from "nanoid";
import type {
  ServiceAddApiKey,
  ServiceGetApiKey,
  ServiceRemoveApiKey,
  ServiceUpdateApiKey,
  ServiceGetApiKeys,
} from "../../types/services/apikey.types";
import { ResponseError } from "./utils";

export const addApiKey: ServiceAddApiKey = async ({ project, body }) => {
  // add apiKey to list

  const id = crypto.randomUUID();

  const apiKey = {
    id,
    project,
    name: body.name,
    value: "mb_" + nanoid(32),
    scopes: body.scopes ?? [],
  };

  console.log("insert to db", {
    ...apiKey,
    scopes: JSON.stringify(apiKey.scopes),
  });
  await db("keys").insert({ ...apiKey, scopes: JSON.stringify(apiKey.scopes) });

  return apiKey;
};

export const getApiKey: ServiceGetApiKey = async ({ project, value }) => {
  console.log(project);
  const key = await db("keys").select("*").where({ project, value }).first();

  return key;
};

export const getApiKeys: ServiceGetApiKeys = async ({ project }) => {
  const keys = await db("keys")
    .select("id", "name", "scopes")
    .where({ project });

  return keys;
};

export const updateApiKey: ServiceUpdateApiKey = async ({
  id,
  project,
  body,
}) => {
  body.id = id;
  body.project = project;

  await db("keys").update(body).where({ id, project });

  return body;
};

export const removeApiKey: ServiceRemoveApiKey = async ({ id, project }) => {
  await db("keys").delete().where({ id, project });

  return true;
};

export type ServiceValidateApiKey = (
  project: string,
  apiKey: string | null,
  ...scopeGroups: ApiKeyScopes[]
) => Promise<ApiKeyScopes[]>;

export const validateApiKey: ServiceValidateApiKey = async (
  project,
  apiKey = "",
  ...scopeGroups
) => {
  const key = await getApiKey({ project, value: apiKey ?? "" });

  //   if (!key) throw new ResponseError(401, "ApiKey is invalid");

  const keyScopes = (key && key.scopes) || [];

  const accesses = scopeGroups.map((scopes) => {
    for (let i = 0; i < scopes.length; i++) {
      if (!keyScopes.includes(scopes[i] as ApiKeyScopes)) {
        return false;
      }
    }
    return true;
  });

  const hasAccess = accesses.some((value) => value === true);

  if (!hasAccess) throw new ResponseError(401, "You don't have access");

  return keyScopes;
};
