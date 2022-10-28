import db from "$server/db";

export async function initDB() {
  const hasProjectsTable = await db.schema.hasTable("projects");
  if (hasProjectsTable) return;

  // create projects table
  await db.schema.createTable("projects", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("name").notNullable().unique();
    builder.json("env").notNullable().defaultTo({});
  });

  await db.schema.createTable("functions", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.text("routes").notNullable();
    builder.string("name").notNullable();
    builder.text("code").notNullable();
  });

  await db.schema.createTable("collections", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("name").notNullable();
    builder.json("schema").notNullable().defaultTo([]);
  });

  await db.schema.createTable("rows", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("collection").notNullable();
    builder.json("data").notNullable().defaultTo({});
  });

  await db.schema.createTable("keys", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("name").notNullable();
    builder.string("value").notNullable();
    builder.json("scopes").notNullable();
  });
}
