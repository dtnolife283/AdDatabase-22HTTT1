import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export const db = knex({
  client: "mssql",
  connection: {
    server: process.env.SERVER,
    database: process.env.DATABASE,
    user: process.env.USR,
    password: process.env.PASSWORD,
    options: {
      port: parseInt(process.env.PORT),
    },
  },
});
