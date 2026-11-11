import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="border-b border-mist">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          ShortLinks
        </Link>
        <ul className="flex items-center gap-6 font-medium">
          <li>
            <Link href="/" className="hover:text-signal">Create</Link>
          </li>
          <li>
            <Link href="/links" className="hover:text-signal">My links</Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
