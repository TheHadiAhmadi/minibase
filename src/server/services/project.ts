import db from "$server/db";
import type { Project } from "$types";
import type {
  ServiceAddProject,
  ServiceGetAllProjects,
  ServiceGetPorject,
  ServiceUpdateProject,
} from "$types/services/project.types";
import { nanoid } from "nanoid";
import { getCollections, getFunctions } from ".";
import { APIKEY_SCOPES } from "../../types";
import { addApiKey } from "./apikey";

export const updateProject: ServiceUpdateProject = async ({ name, body }) => {
  const updateObject: Partial<Project> = {};

  if (body.env) {
    updateObject.env = body.env;
  }

  await db("projects").update({ env: body.env }).where({ name });

  return updateObject;
};

export const addProject: ServiceAddProject = async ({ body }) => {
  body.id = crypto.randomUUID();
  body.env = {};

  const apiKey = await addApiKey({
    body: {
      project: body.name,
      id: crypto.randomUUID(),
      name: "Admin",
      value: "mb_" + nanoid(32),
      scopes: [
        APIKEY_SCOPES.READ_DATA,
        APIKEY_SCOPES.WRITE_DATA,
        APIKEY_SCOPES.READ_FUNCTION,
        APIKEY_SCOPES.WRITE_FUNCTION,
        APIKEY_SCOPES.READ_ENV,
        APIKEY_SCOPES.WRITE_ENV,
      ],
    },
  });

  await db("projects").insert(body);

  body.apiKeys = [apiKey];
  console.log("addProject", body);
  return body;
};

export const getProject: ServiceGetPorject = async ({ name }) => {
  const project = await db("projects").select("*").where({ name }).first();

  if (!project) throw new Error("project not found");

  return {
    ...project,
    functions: getFunctions({ project: name }),
    collections: getCollections({ project: name }),
  };
};

export const getAllProjects: ServiceGetAllProjects = async ({} = {}) => {
  return db("projects").select("name", "id");
};
