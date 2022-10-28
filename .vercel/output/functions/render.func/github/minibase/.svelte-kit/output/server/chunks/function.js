import { d as db, R as ResponseError } from "./index4.js";
const addFunction = async ({ project, body }) => {
  body.id = crypto.randomUUID();
  try {
    await db("functions").insert({
      id: body.id,
      project,
      name: body.name,
      code: body.code,
      routes: body.routes.join(" ")
    });
  } catch (err) {
    console.log(err);
    throw new ResponseError(409, "Function with this name already exists");
  }
  return body;
};
const getFunctions = async ({ project }) => {
  const result = await db("functions").select("*").where({ project });
  return result.map((r) => ({
    ...r,
    routes: r.routes.split(" ").filter((r2) => !!r2)
  }));
};
const editFunction = async ({ id, body }) => {
  await db("functions").update({ ...body, routes: body.routes.join(" ") ?? null }).where({ id });
  return body;
};
const removeFunction = async ({ id }) => {
  await db("functions").delete().where({ id });
  return true;
};
export {
  addFunction as a,
  editFunction as e,
  getFunctions as g,
  removeFunction as r
};
