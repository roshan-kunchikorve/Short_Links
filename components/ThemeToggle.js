"use client";

// The theme lives on <html data-theme="light|dark"> and in localStorage.
// Both labels are always rendered; CSS shows the right one, so there is no flicker.
export default function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked: the theme still changes for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-lg border-2 border-ink px-3 py-1 text-sm font-semibold hover:border-signal hover:text-signal"
    >
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}
