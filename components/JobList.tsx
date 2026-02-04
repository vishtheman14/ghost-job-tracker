"use client";

import { useState, useMemo } from "react";
import { JobCard, type JobCardProps } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 12;

export type JobListItem = JobCardProps["job"];

export interface JobListProps {
  jobs: JobListItem[];
  loading?: boolean;
  companyMap?: Record<string, string>;
  pageSize?: number;
  className?: string;
}

function JobCardSkeleton() {
  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border py-6 shadow-sm">
      <div className="flex flex-row items-start justify-between gap-3 px-6">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-8 w-14 animate-pulse rounded-full" />
      </div>
      <div className="space-y-3 px-6">
        <div className="bg-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted h-6 w-16 animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function JobList({
  jobs,
  loading = false,
  companyMap,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
}: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { totalPages, effectivePage, paginatedJobs } = useMemo(() => {
    const total = jobs.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, currentPage), pages);
    const start = (page - 1) * pageSize;
    const slice = jobs.slice(start, start + pageSize);
    return { totalPages: pages, effectivePage: page, paginatedJobs: slice };
  }, [jobs, currentPage, pageSize]);


  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-6 text-center",
          className
        )}
      >
        <Briefcase className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Try adjusting your filters or search terms to find more postings.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {paginatedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            companyName={companyMap?.[job.companyId]}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={effectivePage <= 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-muted-foreground px-2 text-sm">
            Page {effectivePage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={effectivePage >= totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}