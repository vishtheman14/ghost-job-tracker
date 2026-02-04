import Link from "next/link";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-neutral-900 transition-opacity hover:opacity-80"
        >
          GhostCheck
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
