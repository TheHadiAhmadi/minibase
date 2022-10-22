import db from "$server/db";
import type {
  ServiceAddFunction,
  ServiceEditFunction,
  ServiceGetFunctions,
  ServiceRemoveFunction,
} from "$types/services/function.types";
import { ResponseError } from ".";

export const addFunction: ServiceAddFunction = async ({ project, body }) => {
  body.id = crypto.randomUUID();

  try {
    await db("functions").insert({
      id: body.id,
      project,
      name: body.name,
      code: body.code,
      routes: body.routes.join(" "),
    });
  } catch (err) {
    console.log(err);
    throw new ResponseError(409, "Function with this name already exists");
  }
  return body;
};

export const getFunctions: ServiceGetFunctions = async ({ project }) => {
  const result = await db("functions").select("*").where({ project });

  return result.map((r) => ({
    ...r,
    routes: r.routes.split(" ").filter((r) => !!r),
  }));
};

export const editFunction: ServiceEditFunction = async ({ id, body }) => {
  await db("functions")
    .update({ ...body, routes: body.routes.join(" ") ?? null })
    .where({ id });

  return body;
};

export const removeFunction: ServiceRemoveFunction = async ({ id }) => {
  await db("functions").delete().where({ id });

  return true;
};
