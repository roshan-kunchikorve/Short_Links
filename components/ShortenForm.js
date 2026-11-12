"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { saveLink } from "@/lib/savedLinks";

const inputStyle =
  "w-full rounded-lg border-2 border-ink bg-surface px-4 py-3.5 text-base outline-none focus-visible:border-signal focus-visible:ring-4 focus-visible:ring-signal/25";

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [days, setDays] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { origin, code }
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setQr("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, shorturl: alias, expiresInDays: days }),
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      const origin = window.location.origin;
      saveLink({ shorturl: data.shorturl, manageKey: data.manageKey });
      setResult({ origin, code: data.shorturl });
      QRCode.toDataURL(`${origin}/${data.shorturl}`, { width: 240, margin: 1 })
        .then(setQr)
        .catch(() => setQr(""));
      setUrl("");
      setAlias("");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${result.origin}/${result.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="url" className="font-semibold">Long URL</label>
          <input
            id="url"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/a/very/long/link?with=many&parameters=attached"
            className={`${inputStyle} font-mono`}
            required
          />
        </div>

        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="alias" className="font-semibold">
              Custom alias <span className="font-normal text-ink/70">(optional)</span>
            </label>
            <input
              id="alias"
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="my-link"
              maxLength={30}
              className={`${inputStyle} font-mono`}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <label htmlFor="days" className="font-semibold">Expires after</label>
            <select id="days" value={days} onChange={(e) => setDays(e.target.value)} className={inputStyle}>
              <option value="0">Never</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-lg bg-ink px-7 py-3.5 font-semibold text-paper transition-colors hover:bg-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten link"}
        </button>

        {error && (
          <p role="alert" className="font-medium text-danger">{error}</p>
        )}
      </form>

      {result && (
        <section
          aria-live="polite"
          className="flex flex-col gap-6 rounded-xl border-2 border-dashed border-ink bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-4">
            <p className="font-semibold">Your short link is ready</p>
            <p className="break-all font-mono text-2xl sm:text-3xl">
              {result.origin}/<mark className="rounded-sm bg-marker px-1.5 text-black">{result.code}</mark>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyLink}
                className="rounded-lg bg-ink px-5 py-2.5 font-semibold text-paper hover:bg-signal"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={`${result.origin}/${result.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-ink px-5 py-2 font-semibold hover:border-signal hover:text-signal"
              >
                Open link
              </a>
            </div>
          </div>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`QR code for ${result.origin}/${result.code}`} width={120} height={120} className="shrink-0" />
          )}
        </section>
      )}
    </div>
  );
}
