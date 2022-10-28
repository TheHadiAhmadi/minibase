import db from "$server/db";
import type { Project } from "$types";
import { ResponseError } from "$server/services";
import type {
  ServiceAddProject,
  ServiceGetAllProjects,
  ServiceGetPorject,
  ServiceRemoveProject,
  ServiceUpdateProject,
} from "$types/services/project.types";
import { nanoid } from "nanoid";
import { getCollections, getFunctions } from ".";
import { APIKEY_SCOPES } from "../../types";
import { addApiKey, getApiKeys } from "./apikey";

export const updateProject: ServiceUpdateProject = async ({ name, body }) => {
  const updateObject: any = {};

  if (body.env) {
    updateObject.env = JSON.stringify(body.env);
  }

  if (body.name) {
    updateObject.name = body.name;
  }

  try {
    await db("projects").update(updateObject).where({ name });
  } catch (err) {
    throw new ResponseError(409, "this name is not available");
  }

  if (updateObject.name) {
    await Promise.all([
      db("collections")
        .update({ project: updateObject.name })
        .where({ project: name }),
      db("keys")
        .update({ project: updateObject.name })
        .where({ project: name }),
      db("functions")
        .update({ project: updateObject.name })
        .where({ project: name }),
      db("rows")
        .update({ project: updateObject.name })
        .where({ project: name }),
    ]);
  }

  return updateObject;
};

export const addProject: ServiceAddProject = async ({ body }) => {
  body.id = crypto.randomUUID();
  body.env = {};

  const apiKey = await addApiKey({
    project: body.name,
    body: {
      id: crypto.randomUUID(),
      name: "Admin",
      scopes: [APIKEY_SCOPES.PROJECT_ADMIN],
    },
  });

  console.log(body.env);
  await db("projects").insert({
    name: body.name,
    env: JSON.stringify(body.env),
    id: body.id,
  });

  body.apiKeys = [apiKey];
  console.log("addProject", body);
  return body;
};

export const getProject: ServiceGetPorject = async ({ name }) => {
  const project = await db("projects").select("*").where({ name }).first();

  if (!project) throw new Error("project not found");

  return {
    ...project,
    env: JSON.parse(project.env ?? {}),
    functions: getFunctions({ project: name }),
    collections: getCollections({ project: name }),
    apiKeys: getApiKeys({ project: name }),
  };
};

export const getAllProjects: ServiceGetAllProjects = async (_) => {
  return db("projects").select("name", "id");
};

export const removeProject: ServiceRemoveProject = async ({ name }) => {
  await Promise.all([
    db("projects").delete().where({ name }),
    db("keys").delete().where({ project: name }),
    db("collections").delete().where({ project: name }),
    db("rows").delete().where({ project: name }),
    db("functions").delete().where({ project: name }),
  ]);
  return true;
};
