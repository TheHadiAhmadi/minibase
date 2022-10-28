import { d as db, R as ResponseError } from "./index4.js";
const getCollections = async ({ project }) => {
  const result = await db("collections").where({ project });
  console.log("DB", "collections", result);
  return result.map((r) => ({
    ...r,
    schema: JSON.parse(r.schema)
  }));
};
const addCollection = async ({ body }) => {
  body.id = crypto.randomUUID();
  try {
    await db("collections").insert({
      ...body,
      schema: JSON.stringify(body.schema)
    });
    return body;
  } catch (err) {
    throw new ResponseError(409, "Collection with this name already exists");
  }
};
const removeCollection = async ({
  project,
  name
}) => {
  await Promise.all([
    db("collections").delete().where({ project, name }),
    db("rows").delete().where({ project, collection: name })
  ]);
  return true;
};
const editCollection = async ({ name, body }) => {
  await db("collections").update({ ...body, schema: JSON.stringify(body.schema) }).where({ name, project: body.project });
  console.log("editCollection", { body, name });
  if (body.name) {
    await db("rows").update({ collection: body.name }).where({ project: body.project, collection: name });
  }
  return body;
};
export {
  addCollection as a,
  editCollection as e,
  getCollections as g,
  removeCollection as r
};
