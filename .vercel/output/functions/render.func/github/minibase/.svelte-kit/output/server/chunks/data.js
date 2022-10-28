import { d as db } from "./index4.js";
const getRows = async ({ project, collection }) => {
  const rows = await db("rows").select("data", "id").where({ project, collection });
  return rows.map((row) => ({ ...row.data, id: row.id }));
};
const editData = async ({
  project,
  collection,
  id,
  body: data
}) => {
  await db("rows").update({ data }).where({ project, collection, id });
  return { ...data, id };
};
const deleteData = async ({
  project,
  collection,
  id
}) => {
  await db("rows").delete().where({ project, collection, id });
  return true;
};
const getData = async ({ project, collection, id }) => {
  const result = await db("rows").select("id", "data").where({ project, collection, id }).first();
  return { ...JSON.parse(result.data), id: result.id };
};
const insertData = async ({
  project,
  collection,
  body: data
}) => {
  if (Array.isArray(data)) {
    const d = data.map((dat) => {
      const id2 = crypto.randomUUID();
      return {
        project,
        collection,
        data: JSON.stringify(dat),
        id: id2
      };
    });
    await db("rows").insert(d);
    return d.map((dd) => ({ ...JSON.parse(dd.data), id: dd.id }));
  }
  const id = crypto.randomUUID();
  await db("rows").insert({
    project,
    collection,
    data: JSON.stringify(data),
    id
  });
  return { ...data, id };
};
export {
  getData as a,
  deleteData as d,
  editData as e,
  getRows as g,
  insertData as i
};
