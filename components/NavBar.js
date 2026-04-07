"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";

/**
 * Top navigation + role switcher + dark mode.
 * Stays simple: one row on desktop, wraps on small screens.
 */
export default function NavBar() {
  const pathname = usePathname();
  const {
    role,
    setRole,
    darkMode,
    toggleDarkMode,
  } = useFinance();

  const linkClass = (href) => {
    const active = pathname === href;
    return [
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-emerald-600 text-white"
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
    ].join(" ");
  };

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Finance Dashboard
          </span>
          <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 sm:inline">
            mock data
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          <Link href="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link href="/transactions" className={linkClass("/transactions")}>
            Transactions
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role: custom-styled select so light/dark text stays readable and focus ring is visible */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span
              id="role-label"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Role
            </span>
            <div className="relative">
              <select
                id="role-select"
                aria-labelledby="role-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="min-w-[11rem] cursor-pointer appearance-none rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/25"
              >
                <option value="viewer">Viewer — view only</option>
                <option value="admin">Admin — full edit</option>
              </select>
              <span
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                aria-hidden
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-pressed={darkMode}
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </header>
  );
}
