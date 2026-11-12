import { getDb } from "@/lib/mongodb";
import { keyMatches } from "@/lib/links";

// GET /api/links?codes=abc,xyz  ->  stats for those codes
export async function GET(request) {
  try {
    const codes = (new URL(request.url).searchParams.get("codes") || "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
      .slice(0, 50);

    const db = await getDb();
    const links = await db
      .collection("url")
      .find({ shorturl: { $in: codes } }, { projection: { _id: 0, manageKeyHash: 0 } })
      .toArray();

    return Response.json({ success: true, links });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to load links." }, { status: 500 });
  }
}

// DELETE /api/links  with { shorturl, manageKey }  ->  only the creator's browser knows the key
export async function DELETE(request) {
  try {
    const { shorturl, manageKey } = await request.json();
    if (typeof shorturl !== "string") {
      return Response.json({ success: false, message: "Invalid request." }, { status: 400 });
    }

    const db = await getDb();
    const doc = await db.collection("url").findOne({ shorturl });
    if (!doc) {
      return Response.json({ success: false, message: "Link not found." }, { status: 404 });
    }
    if (!keyMatches(manageKey, doc.manageKeyHash)) {
      return Response.json(
        { success: false, message: "You can only delete links created in this browser." },
        { status: 403 }
      );
    }

    await db.collection("url").deleteOne({ shorturl });
    return Response.json({ success: true, message: "Link deleted." });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to delete the link." }, { status: 500 });
  }
}
