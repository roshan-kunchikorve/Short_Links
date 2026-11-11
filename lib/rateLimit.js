import { getDb } from "@/lib/mongodb";
import { hashKey } from "@/lib/links";

// Fixed-window rate limiter stored in MongoDB.
// Every visitor gets one counter per time window; a TTL index deletes old counters.
export async function rateLimit(ip, limit = 10, windowSeconds = 60) {
  try {
    const db = await getDb();
    const windowNumber = Math.floor(Date.now() / (windowSeconds * 1000));
    const key = `${hashKey(ip).slice(0, 16)}:${windowNumber}`; // a hash, not the raw IP

    const counter = await db.collection("ratelimits").findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expireAt: new Date(Date.now() + windowSeconds * 1000) } },
      { upsert: true, returnDocument: "after" }
    );
    return counter.count <= limit;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return true; // if the limiter itself breaks, do not block real users
  }
}
