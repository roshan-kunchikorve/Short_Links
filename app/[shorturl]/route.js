import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";

async function countClick(shorturl) {
  const db = await getDb();
  await db
    .collection("url")
    .updateOne({ shorturl }, { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } });
}

export async function GET(request, { params }) {
  const { shorturl } = await params;

  // ignore junk requests such as /apple-touch-icon.png before touching the database
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(shorturl)) {
    return new Response("Not found", { status: 404 });
  }

  const notFound = () => NextResponse.redirect(new URL("/link-not-found", request.url));

  const db = await getDb();
  const doc = await db.collection("url").findOne({ shorturl });
  if (!doc) return notFound();
  if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) return notFound();

  let target;
  try {
    target = new URL(doc.url);
  } catch {
    return notFound(); // old documents without a valid URL
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") return notFound();

  // Count the click AFTER the redirect is sent, so the visitor never waits for the database write.
  after(() => countClick(shorturl).catch(console.error));

  // 307 = temporary redirect. A permanent 301 would be cached by browsers and hide future clicks.
  return NextResponse.redirect(target);
}
