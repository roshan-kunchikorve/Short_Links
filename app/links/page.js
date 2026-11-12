"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedLinks, removeSavedLink } from "@/lib/savedLinks";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function clicksText(item) {
  const count = item.clicks || 0;
  if (count === 0) return "No clicks yet";
  const word = count === 1 ? "click" : "clicks";
  return `${count} ${word}, last on ${formatDate(item.lastClickedAt)}`;
}

function expiryText(item) {
  if (!item.expiresAt) return "Never expires";
  if (new Date(item.expiresAt) < new Date()) return "Expired";
  return `Expires ${formatDate(item.expiresAt)}`;
}

export default function MyLinks() {
  const [links, setLinks] = useState(null); // null means "still loading"
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    async function loadLinks() {
      const saved = getSavedLinks();
      if (saved.length === 0) {
        setLinks([]);
        return;
      }
      const codes = saved.map((item) => item.shorturl).join(",");
      const response = await fetch(`/api/links?codes=${encodeURIComponent(codes)}`);
      const data = await response.json();
      setLinks(data.links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }

    loadLinks().catch(() => {
      setMessage("Could not load your links. Please refresh the page.");
      setLinks([]);
    });
  }, []);

  async function handleCopy(code) {
    await navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  }

  async function handleDelete(code) {
    if (!window.confirm(`Delete /${code}? Visitors will no longer be redirected.`)) return;

    const saved = getSavedLinks().find((item) => item.shorturl === code);
    const response = await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shorturl: code, manageKey: saved ? saved.manageKey : "" }),
    });
    const data = await response.json();

    setMessage(data.message);
    if (data.success) {
      removeSavedLink(code);
      setLinks(links.filter((item) => item.shorturl !== code));
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">My links</h1>
      <p className="mt-3 max-w-lg text-ink/75">
        This list lives in this browser only. Your short links keep working even if you clear it.
      </p>

      {message && <p role="status" className="mt-6 font-medium">{message}</p>}

      {links === null && <p className="mt-10">Loading your links...</p>}

      {links && links.length === 0 && (
        <p className="mt-10">
          You have not created any links in this browser yet.{" "}
          <Link href="/" className="font-semibold underline hover:text-signal">Create your first one</Link>
        </p>
      )}

      {links && links.length > 0 && (
        <ul className="mt-10 divide-y divide-mist border-y border-mist">
          {links.map((item) => (
            <li key={item.shorturl} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-lg font-bold">/{item.shorturl}</p>
                <p className="truncate text-sm text-ink/70" title={item.url}>{item.url}</p>
                <p className="mt-1 text-sm">{clicksText(item)}. {expiryText(item)}.</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(item.shorturl)}
                  className="rounded-lg border-2 border-ink px-4 py-2 font-semibold hover:border-signal hover:text-signal"
                >
                  {copiedCode === item.shorturl ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.shorturl)}
                  className="rounded-lg border-2 border-danger px-4 py-2 font-semibold text-danger hover:bg-danger hover:text-paper"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
