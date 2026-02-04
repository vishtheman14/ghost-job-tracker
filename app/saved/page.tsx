"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { useSavedJobs } from "@/lib/SavedJobsContext";
import { companies, getJobsByIds } from "@/lib/mockData";
import { RemoteType } from "@/lib/types";
import { ArrowLeft, Heart } from "lucide-react";

function inferRemoteType(location: string): RemoteType {
  const loc = location.toLowerCase();
  if (loc.includes("hybrid")) return RemoteType.HYBRID;
  if (loc.includes("remote")) return RemoteType.REMOTE;
  return RemoteType.ONSITE;
}

const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));

export default function SavedPage() {
  const { savedIds } = useSavedJobs();

  const jobs = useMemo(() => {
    const list = getJobsByIds(savedIds);
    return list.map((job) => ({
      ...job,
      company: { name: companyMap[job.companyId] ?? "—" },
      remoteType: inferRemoteType(job.location),
    }));
  }, [savedIds]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to jobs
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Saved jobs</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {jobs.length === 0
            ? "No saved jobs yet. Save roles from the job list to see them here."
            : `${jobs.length} saved job${jobs.length !== 1 ? "s" : ""}`}
        </p>

        {jobs.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-6 text-center">
            <Heart className="text-muted-foreground mb-4 size-12" />
            <p className="text-muted-foreground max-w-sm text-sm">
              Click the heart on any job card to save it. Your saved jobs are
              stored in this browser and persist across refreshes.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} companyName={companyMap[job.companyId]} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
