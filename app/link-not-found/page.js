import Link from "next/link";

export const metadata = { title: "Link not found | ShortLinks" };

export default function LinkNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">This link no longer works</h1>
      <p className="mt-4 max-w-lg text-lg text-ink/75">
        It may have been deleted, mistyped or expired. Check the address, or make a new short link.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-ink px-6 py-3 font-semibold text-paper hover:bg-signal"
      >
        Create a short link
      </Link>
    </main>
  );
}
