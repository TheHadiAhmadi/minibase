import { DATABASE_URI } from "$env/static/private";
import knex from "knex";

const db = knex({
  useNullAsDefault: true,
  client: "pg",
  connection: DATABASE_URI,
  debug: true,
});

export default db;
