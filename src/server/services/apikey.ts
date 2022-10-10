import db from "$server/db";
import type { ApiKeyScopes } from "$types/services";
import {
  ServiceAddApiKey,
  ServiceGetApiKey,
  ServiceRemoveApiKey,
  ServiceUpdateApiKey,
} from "../../types/services/apikey.types";
import { ResponseError } from "./utils";

export const addApiKey: ServiceAddApiKey = async ({ body }) => {
  // add apiKey to list
  console.log({ body });
  const id = crypto.randomUUID();

  const apiKey = {
    id,
    project: body.project,
    name: body.name,
    value: body.value,
    scopes: body.scopes ?? [],
  };

  await db("keys").insert({ ...apiKey, scopes: JSON.stringify(apiKey.scopes) });

  return apiKey;
};

export const getApiKey: ServiceGetApiKey = async ({ project, value }) => {
  const key = await db("keys").select("*").where({ project, value }).first();

  return key;
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
  await db("keys").delete.where({ id, project });

  return true;
};

export async function validateApiKey(
  project: string,
  apiKey: string | null = "",
  ...scopeGroups: ApiKeyScopes[]
): Promise<boolean> {
  const key = await getApiKey({ project, value: apiKey ?? "" });

//   if (!key) throw new ResponseError(401, "ApiKey is invalid");
    
  const keyScopes = (key && key.scopes) || [];

  let hasAccess = false;
  for (let scopes in scopeGroups) {
    for (let i = 0; i < scopes.length; i++) {
      if (!keyScopes.includes(scopes[i] as ApiKeyScopes)) {
        continue;
      }
    }
    hasAccess = true;
    break;
  }
  if (!hasAccess) throw new ResponseError(401, "You don't have access");

  return true;
}
