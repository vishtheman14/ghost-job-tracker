"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { JobSearch, type JobSearchFilters } from "@/components/JobSearch";
import { JobList, type JobListItem } from "@/components/JobList";
import { companies, jobPostings } from "@/lib/mockData";
import { RemoteType } from "@/lib/types";

function inferRemoteType(location: string): RemoteType {
  const loc = location.toLowerCase();
  if (loc.includes("hybrid")) return RemoteType.HYBRID;
  if (loc.includes("remote")) return RemoteType.REMOTE;
  return RemoteType.ONSITE;
}

function applyFilters(
  jobs: Array<{
    id: string;
    title: string;
    companyId: string;
    location: string;
    techStack: string[];
    salaryMin: number;
    salaryMax: number;
    daysPosted: number;
    ghostScore: number;
    redFlags: string[];
    greenFlags: string[];
  }>,
  companyNames: Record<string, string>,
  filters: JobSearchFilters
): JobListItem[] {
  const kw = filters.keywords.trim().toLowerCase();
  const loc = filters.location.trim().toLowerCase();

  return jobs
    .filter((job) => {
      if (kw && !job.title.toLowerCase().includes(kw)) return false;
      if (loc && !job.location.toLowerCase().includes(loc)) return false;
      if (filters.techStack.length > 0) {
        const jobTech = new Set(job.techStack.map((t) => t.toLowerCase()));
        const hasAll = filters.techStack.every((t) =>
          jobTech.has(t.toLowerCase())
        );
        if (!hasAll) return false;
      }
      if (job.ghostScore > filters.maxGhostScore) return false;
      if (filters.remoteType !== "all") {
        const jobRemote = inferRemoteType(job.location);
        if (jobRemote !== filters.remoteType) return false;
      }
      return true;
    })
    .map((job) => ({
      ...job,
      company: { name: companyNames[job.companyId] ?? "—" },
      remoteType: inferRemoteType(job.location),
    }));
}

const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));

export default function Home() {
  const [filters, setFilters] = useState<JobSearchFilters>({
    keywords: "",
    location: "",
    techStack: [],
    maxGhostScore: 10,
    remoteType: "all",
  });

  const filteredJobs = useMemo(
    () => applyFilters(jobPostings, companyMap, filters),
    [filters]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Find jobs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Filter by role, location, tech stack, and ghost score.
          </p>
          <div className="mt-6">
            <JobSearch onSearch={setFilters} />
          </div>
        </section>
        <section>
          <JobList jobs={filteredJobs} companyMap={companyMap} />
        </section>
      </main>
    </div>
  );
}
