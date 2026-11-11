import { randomBytes, createHash, timingSafeEqual } from "node:crypto";

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Aliases that would clash with real pages of this app
const RESERVED = ["api", "links", "link-not-found", "shorten", "about", "contact", "login", "signup", "admin", "dashboard", "_next"];

// 7 characters from 62 options = about 3.5 trillion possible codes
export function randomCode(length = 7) {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[bytes[i] % CHARS.length];
  }
  return code;
}

// A secret that proves "I created this link". The browser keeps it, the database stores only its hash.
export function randomKey() {
  return randomBytes(16).toString("hex");
}

export function hashKey(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function keyMatches(key, storedHash) {
  if (typeof key !== "string" || !storedHash) return false;
  const a = Buffer.from(hashKey(key));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Returns { url } when the link is fine, or { error } with a message for the user.
export function checkUrl(input, ownHost) {
  let text = String(input || "").trim();
  if (!text) return { error: "Please enter a URL." };
  if (text.length > 2048) return { error: "That URL is too long (maximum 2048 characters)." };

  // forgot the https:// ? add it for them
  if (!/^https?:\/\//i.test(text)) text = "https://" + text;

  let parsed;
  try {
    parsed = new URL(text);
  } catch {
    return { error: "That does not look like a valid URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { error: "Only http and https links are allowed." };
  }
  if (parsed.username || parsed.password) {
    return { error: "Links that contain a username or password are not allowed." };
  }
  if (!parsed.hostname.includes(".")) {
    return { error: "That does not look like a valid URL." };
  }
  if (parsed.host === ownHost) {
    return { error: "That link already points to this site." };
  }
  return { url: parsed.href };
}

// Returns "" when the alias is fine, or a message for the user.
export function checkAlias(alias) {
  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) {
    return "Alias must be 3 to 30 characters: letters, numbers, - or _.";
  }
  if (RESERVED.includes(alias.toLowerCase())) {
    return "That alias is reserved. Try another one.";
  }
  return "";
}
