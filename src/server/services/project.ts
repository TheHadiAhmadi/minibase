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

export const updateProject: ServiceUpdateProject = async ({ name, body }) => {
  // only update env
  // TODO: Later also apiKey
  const updateObject: Partial<Project> = {};

  if (body.env) {
    updateObject.env = body.env;
  }
  // if (body.apiKeys) {
  //   updateObject.apiKeys = body.apiKeys;
  // }

  const result = await db("projects").update({ env: body.env }).where({ name });

  return updateObject;
};

export const addProject: ServiceAddProject = async ({ body }) => {
  body.apiKey = "mb_" + nanoid(32);
  body.id = crypto.randomUUID();

  await db("projects").insert(body);

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
