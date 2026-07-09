import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __codequestPgClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set — copy .env.example to .env.local");
}

// Reuse the connection across hot reloads in development.
const client =
  global.__codequestPgClient ??
  postgres(connectionString, { prepare: false, max: 10 });

if (process.env.NODE_ENV !== "production") {
  global.__codequestPgClient = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;
