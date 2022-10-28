import db from "$server/db";
import type {
  ServiceAddCollection,
  ServiceEditCollection,
  ServiceGetCollections,
  ServiceRemoveCollection,
} from "$types/services/collection.types";
import { ResponseError } from ".";

export const getCollections: ServiceGetCollections = async ({ project }) => {
  const result = await db("collections").where({ project });
  console.log("DB", "collections", result);

  return result.map((r) => ({
    ...r,
    schema: JSON.parse(r.schema),
  }));
};

export const addCollection: ServiceAddCollection = async ({ body }) => {
  body.id = crypto.randomUUID();

  try {
    await db("collections").insert({
      ...body,
      schema: JSON.stringify(body.schema),
    });

    return body;
  } catch (err) {
    throw new ResponseError(409, "Collection with this name already exists");
  }
};

export const removeCollection: ServiceRemoveCollection = async ({
  project,
  name,
}) => {
  await Promise.all([
    db("collections").delete().where({ project, name }),
    db("rows").delete().where({ project, collection: name }),
  ]);

  return true;
};

export const editCollection: ServiceEditCollection = async ({ name, body }) => {
  await db("collections")
    .update({ ...body, schema: JSON.stringify(body.schema) })
    .where({ name, project: body.project });

  console.log("editCollection", { body, name });
  if (body.name) {
    await db("rows")
      .update({ collection: body.name })
      .where({ project: body.project, collection: name });
  }

  return body;
};
