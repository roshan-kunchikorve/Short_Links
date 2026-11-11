import ShortenForm from "@/components/ShortenForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:py-16">
      <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
        Make long links short.
      </h1>
      <p className="mb-10 mt-4 max-w-lg text-lg text-ink/75">
        Paste a link, add an alias if you like, and share it. No account needed.
      </p>
      <ShortenForm />
    </main>
  );
}
