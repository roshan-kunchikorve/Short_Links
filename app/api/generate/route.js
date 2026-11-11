import { getDb } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { checkUrl, checkAlias, randomCode, randomKey, hashKey } from "@/lib/links";

const EXPIRY_CHOICES = [0, 1, 7, 30]; // in days, 0 = never

function fail(message, status) {
  return Response.json({ success: false, error: true, message }, { status });
}

export async function POST(request) {
  try {
    // 1. Rate limit: 10 new links per minute per visitor
    const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!(await rateLimit(ip, 10, 60))) {
      return fail("Too many links created. Please wait a minute and try again.", 429);
    }

    // 2. Read and validate the input
    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid request.", 400);
    }
    if (!body || typeof body !== "object") return fail("Invalid request.", 400);

    const urlResult = checkUrl(body.url, new URL(request.url).host);
    if (urlResult.error) return fail(urlResult.error, 400);

    const alias = String(body.shorturl || "").trim();
    if (alias) {
      const aliasError = checkAlias(alias);
      if (aliasError) return fail(aliasError, 400);
    }

    const days = Number(body.expiresInDays) || 0;
    if (!EXPIRY_CHOICES.includes(days)) return fail("Invalid expiry option.", 400);

    // 3. Save to MongoDB
    const db = await getDb();
    const manageKey = randomKey(); // shown to the creator once, only its hash is stored
    const doc = {
      url: urlResult.url,
      manageKeyHash: hashKey(manageKey),
      clicks: 0,
      createdAt: new Date(),
      expiresAt: days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null,
    };

    // A custom alias gets one try. A random code is retried if it happens to exist already.
    const attempts = alias ? 1 : 5;
    for (let i = 0; i < attempts; i++) {
      const code = alias || randomCode();
      try {
        await db.collection("url").insertOne({ ...doc, shorturl: code });
        return Response.json({
          success: true,
          error: false,
          message: "Short link created",
          shorturl: code,
          manageKey,
          expiresAt: doc.expiresAt,
        });
      } catch (error) {
        if (error.code !== 11000) throw error; // 11000 = duplicate key (code already used)
      }
    }

    return alias
      ? fail("That alias is already taken. Try another one.", 409)
      : fail("Could not create a unique code. Please try again.", 500);
  } catch (error) {
    console.error(error);
    return fail("Failed to create the short link.", 500);
  }
}
