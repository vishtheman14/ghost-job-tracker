"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RemoteType } from "@/lib/types";
import { useSavedJobs } from "@/lib/SavedJobsContext";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Laptop,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Heart,
} from "lucide-react";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    companyId: string;
    company?: { name: string } | null;
    location: string;
    remoteType?: RemoteType;
    techStack: string[];
    salaryMin: number;
    salaryMax: number;
    daysPosted: number;
    ghostScore: number;
    redFlags: string[];
    greenFlags: string[];
  };
  companyName?: string;
  className?: string;
}

function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return "Salary not disclosed";
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

function ghostScoreBgClass(score: number): string {
  if (score >= 8) return "ghost-score-high border";
  if (score >= 4) return "ghost-score-mid border";
  return "ghost-score-low border";
}

function RemoteTypeIcon({ type }: { type: RemoteType }) {
  switch (type) {
    case RemoteType.REMOTE:
      return <Laptop className="size-3.5 shrink-0" />;
    case RemoteType.HYBRID:
      return <Briefcase className="size-3.5 shrink-0" />;
    case RemoteType.ONSITE:
      return <Building2 className="size-3.5 shrink-0" />;
    default:
      return null;
  }
}

function remoteTypeLabel(type: RemoteType): string {
  switch (type) {
    case RemoteType.REMOTE:
      return "Remote";
    case RemoteType.HYBRID:
      return "Hybrid";
    case RemoteType.ONSITE:
      return "Onsite";
    default:
      return "";
  }
}

export function JobCard({ job, companyName, className }: JobCardProps) {
  const displayCompanyName =
    job.company?.name ?? companyName ?? "—";
  const { has, toggle } = useSavedJobs();
  const saved = has(job.id);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-3 pb-2">
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{displayCompanyName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(job.id);
            }}
            className={cn(
              "rounded-full p-1.5 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              saved
                ? "text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={saved ? "Unsave job" : "Save job"}
          >
            <Heart
              className={cn("size-5", saved && "fill-current")}
              strokeWidth={saved ? 0 : 1.5}
            />
          </button>
          <Badge
            variant="outline"
            className={cn(
              "border px-3 py-1 text-base font-semibold tabular-nums",
              ghostScoreBgClass(job.ghostScore)
            )}
          >
            {job.ghostScore}/10
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            {job.location}
          </span>
          {job.remoteType != null && (
            <span className="flex items-center gap-1.5">
              <RemoteTypeIcon type={job.remoteType} />
              {remoteTypeLabel(job.remoteType)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <DollarSign className="size-3.5 shrink-0 text-muted-foreground" />
          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>

        {job.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" />
          <span>
            {job.daysPosted === 0
              ? "Posted today"
              : job.daysPosted === 1
                ? "1 day ago"
                : `${job.daysPosted} days ago`}
          </span>
        </div>

        {(job.redFlags.length > 0 || job.greenFlags.length > 0) && (
          <div className="flex flex-col gap-1.5 pt-1">
            {job.redFlags.map((flag) => (
              <div
                key={flag}
                className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400"
              >
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
            {job.greenFlags.map((flag) => (
              <div
                key={flag}
                className="flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
