import { Client } from "faunadb";

export const fauna = new Client({
   secret: process.env.FAUNADB_SECRET_KEY,
   domain: "db.fauna.com",
   scheme: "https",
});
