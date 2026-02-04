"use client";

import Link from "next/link";
import { useSavedJobs } from "@/lib/SavedJobsContext";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  const { count } = useSavedJobs();

  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-neutral-900 transition-opacity hover:opacity-80 dark:text-neutral-50"
        >
          GhostCheck
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/saved"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50 relative inline-flex items-center gap-1.5"
          >
            Saved
            {count > 0 && (
              <span className="bg-primary text-primary-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
