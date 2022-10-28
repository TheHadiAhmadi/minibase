import knex from "knex";
const DATABASE_URI = 'mysql://qjwvrw8dqg1bpbmb9wlg:pscale_pw_VZRf1hvZhElhvHFRxiQe6z7GOqbTVxWufeJWlARhVbW@us-east.connect.psdb.cloud/minibase?ssl={"rejectUnauthorized":true}';
const client = "mysql";
const connection = DATABASE_URI;
const db = knex({
  useNullAsDefault: true,
  client,
  connection,
  debug: true
});
async function initDB() {
  const hasProjectsTable = await db.schema.hasTable("projects");
  if (hasProjectsTable)
    return;
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
class ResponseError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.name = "ResponseError";
    this.status = status ?? 500;
  }
}
function respondError(error) {
  if (error instanceof ResponseError)
    return new Response(
      JSON.stringify({
        status: error.status,
        message: error.message ?? "Internal Server Error"
      }),
      { status: error.status ?? 500 }
    );
  return new Response(
    JSON.stringify({
      status: 500,
      message: error.message ?? "Internal Server Error"
    }),
    { status: 500 }
  );
}
function respond(body) {
  const status = body.status ?? 200;
  const headers = body.headers ?? {};
  const data = body.data ?? {};
  return new Response(JSON.stringify({ data, status }), { status, headers });
}
initDB();
export {
  ResponseError as R,
  respondError as a,
  db as d,
  respond as r
};
