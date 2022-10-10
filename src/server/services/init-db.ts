import db from "$server/db";

export async function initDB() {
    await db.schema.dropTable("projects");
    await db.schema.dropTable("collections");
    await db.schema.dropTable("functions");
    await db.schema.dropTable("rows");

  // create projects table
  await db.schema.createTableIfNotExists("projects", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("name").notNullable().unique();
    builder.json("env").notNullable().defaultTo({});
    builder.string("apiKey").notNullable();
  });
  await db.schema.createTableIfNotExists("functions", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("name").notNullable();
    builder.text("code").notNullable();
  });

  await db.schema.createTableIfNotExists("collections", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("name").notNullable();
    builder.json("schema").notNullable().defaultTo([]);
  });

  await db.schema.createTableIfNotExists("rows", (builder) => {
    builder.string("id").notNullable().primary();
    builder.string("project").notNullable();
    builder.string("collection").notNullable();
    builder.json("data").notNullable().defaultTo({});
  });
}
