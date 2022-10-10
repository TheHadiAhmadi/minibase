import db from "$server/db";
import type {
  ServiceDeleteData,
  ServiceEditData,
  ServiceGetData,
  ServiceGetRows,
  ServiceInsertData,
} from "$types/services/data.types";

export const getRows: ServiceGetRows = async ({ project, collection }) => {
  const rows = await db("rows")
    .select("data", "id")
    .where({ project, collection });

  return rows.map((row) => row.data);
};

export const editData: ServiceEditData = async ({
  project,
  collection,
  id,
  body: data,
}) => {
  await db("rows").update({ data }).where({ project, collection, id });
  return data;
};

export const deleteData: ServiceDeleteData = async ({
  project,
  collection,
  id,
}) => {
  await db("rows").delete().where({ project, collection, id });
  return true;
};

export const getData: ServiceGetData = async ({ project, collection, id }) => {
  const result = await db("rows")
    .select("id", "data")
    .where({ project, collection, id })
    .first();

  return result.data;
};

export const insertData: ServiceInsertData = async ({
  project,
  collection,
  body: data,
}) => {
  if (Array.isArray(data)) {
    const d = data.map((dat) => {
      const id = crypto.randomUUID();
      dat.id = id;

      return {
        project,
        collection,
        data: dat,
        id,
      };
    });
    await db("rows").insert(d);

    return d.map((dd) => dd.data);
  }

  const id = crypto.randomUUID();
  data.id = id;
  await db("rows").insert({ project, collection, data, id });

  return data;
};