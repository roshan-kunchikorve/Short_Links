import { MongoClient } from "mongodb";

const DB_NAME = "ShortLinks";

// Connect once and reuse the connection:
// in dev it survives hot reloads, on Vercel it is reused while the function stays warm.
function getClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to .env.local and to your Vercel project settings.");
  }
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(process.env.MONGODB_URI)
      .connect()
      .catch((error) => {
        global._mongoClientPromise = undefined; // allow a retry on the next request
        throw error;
      });
  }
  return global._mongoClientPromise;
}

// Returns the database and makes sure the indexes exist (runs once per server instance).
export async function getDb() {
  const client = await getClient();
  const db = client.db(DB_NAME);

  if (!global._indexesReady) {
    global._indexesReady = Promise.all([
      // two links can never share one code, even when requests arrive at the same moment
      db.collection("url").createIndex({ shorturl: 1 }, { unique: true }),
      // rate-limit counters delete themselves once expireAt has passed
      db.collection("ratelimits").createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection("ratelimits").createIndex({ key: 1 }, { unique: true }),
    ]).catch((error) => console.error("Index setup failed:", error));
  }
  await global._indexesReady;

  return db;
}
