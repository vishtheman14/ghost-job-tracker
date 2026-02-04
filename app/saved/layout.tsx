import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved jobs | GhostCheck",
  description: "Your saved job listings.",
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
