import { d as db, R as ResponseError } from "./index4.js";
import { A as APIKEY_SCOPES } from "./index5.js";
import { a as addApiKey, g as getApiKeys } from "./apikey.js";
import { g as getFunctions } from "./function.js";
import { g as getCollections } from "./collection.js";
const updateProject = async ({ name, body }) => {
  const updateObject = {};
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
      db("collections").update({ project: updateObject.name }).where({ project: name }),
      db("keys").update({ project: updateObject.name }).where({ project: name }),
      db("functions").update({ project: updateObject.name }).where({ project: name }),
      db("rows").update({ project: updateObject.name }).where({ project: name })
    ]);
  }
  return updateObject;
};
const addProject = async ({ body }) => {
  body.id = crypto.randomUUID();
  body.env = {};
  const apiKey = await addApiKey({
    project: body.name,
    body: {
      id: crypto.randomUUID(),
      name: "Admin",
      scopes: [APIKEY_SCOPES.PROJECT_ADMIN]
    }
  });
  console.log(body.env);
  await db("projects").insert({
    name: body.name,
    env: JSON.stringify(body.env),
    id: body.id
  });
  body.apiKeys = [apiKey];
  console.log("addProject", body);
  return body;
};
const getProject = async ({ name }) => {
  const project = await db("projects").select("*").where({ name }).first();
  if (!project)
    throw new Error("project not found");
  return {
    ...project,
    env: JSON.parse(project.env ?? {}),
    functions: getFunctions({ project: name }),
    collections: getCollections({ project: name }),
    apiKeys: getApiKeys({ project: name })
  };
};
const getAllProjects = async (_) => {
  return db("projects").select("name", "id");
};
const removeProject = async ({ name }) => {
  await Promise.all([
    db("projects").delete().where({ name }),
    db("keys").delete().where({ project: name }),
    db("collections").delete().where({ project: name }),
    db("rows").delete().where({ project: name }),
    db("functions").delete().where({ project: name })
  ]);
  return true;
};
export {
  addProject as a,
  getProject as b,
  getAllProjects as g,
  removeProject as r,
  updateProject as u
};
