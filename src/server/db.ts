import { dev } from "$app/environment";
import { DATABASE_URI } from "$env/static/private";
import knex from "knex";

const client = dev ? "sqlite" : "pg";
const connection = dev ? "./minibase.db" : DATABASE_URI;

const db = knex({
  useNullAsDefault: true,
  client,
  connection,
  debug: true,
});

export default db;
