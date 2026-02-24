import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

if (!dbName) {
  throw new Error("MONGODB_DB_NAME is not defined in .env");
}

const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectToMongo(): Promise<Db> {
  if (db) return db;

  await client.connect();
  db = client.db(dbName);

  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToMongo() first.");
  }
  return db;
}
