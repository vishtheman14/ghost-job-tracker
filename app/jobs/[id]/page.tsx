import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  companies,
  getJobById,
  nameToSlug,
  type JobPosting,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";

function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return "Salary not disclosed";
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

function ghostScoreClass(score: number): string {
  if (score >= 8) return "ghost-score-high border";
  if (score >= 4) return "ghost-score-mid border";
  return "ghost-score-low border";
}

function buildJobDescription(job: JobPosting, companyName: string): string {
  const salary =
    job.salaryMin > 0 || job.salaryMax > 0
      ? formatSalary(job.salaryMin, job.salaryMax)
      : "Competitive salary";
  return `${companyName} is hiring a ${job.title} to join the team. This role is based in ${job.location}.

## Compensation
${salary}

## Tech stack
We use ${job.techStack.join(", ")} in our day-to-day work. Experience with these or similar technologies is a plus.

## What we're looking for
We're seeking a strong fit for our team who can contribute from day one. This position was posted ${job.daysPosted === 0 ? "today" : `${job.daysPosted} days ago`}.`;
}

function DescriptionContent({ text }: { text: string }) {
  const parts = text.split(/\n\n/);
  return (
    <>
      {parts.map((para, i) => {
        if (para.startsWith("## ")) {
          const rest = para.slice(3).trim();
          const [head, ...body] = rest.split("\n");
          return (
            <div key={i} className="mt-4 first:mt-0">
              <p className="font-semibold mb-1">{head}</p>
              {body.length > 0 && (
                <p className="text-muted-foreground text-sm">{body.join("\n")}</p>
              )}
            </div>
          );
        }
        return (
          <p key={i} className="mb-3 last:mb-0">
            {para}
          </p>
        );
      })}
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "Job not found" };
  const company = companies.find((c) => c.id === job.companyId);
  const companyName = company?.name ?? "Company";
  return {
    title: `${job.title} at ${companyName} | GhostCheck`,
    description: `${job.title} – ${companyName}. Ghost score: ${job.ghostScore}/10. ${job.location}.`,
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  const company = companies.find((c) => c.id === job.companyId);
  const companyName = company?.name ?? "Company";
  const companySlug = company ? nameToSlug(company.name) : null;
  const isHighRisk = job.ghostScore <= 4;
  const description = buildJobDescription(job, companyName);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to jobs
        </Link>

        {/* Warning banner when ghost score is low (high risk) */}
        {isHighRisk && (
          <Card className="mb-6 border-red-500/40 bg-red-500/5">
            <CardContent className="flex gap-3 py-4">
              <AlertTriangle className="text-red-600 dark:text-red-400 size-6 shrink-0" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-200">
                  Higher ghosting risk
                </p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  This role has a ghost score of {job.ghostScore}/10. Applicants
                  have reported being ghosted or not hearing back more often than
                  average. Proceed with caution and consider following up
                  proactively.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {job.title}
              </h1>
              {company && (
                <Link
                  href={companySlug ? `/companies/${companySlug}` : "#"}
                  className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1.5 text-sm transition-colors"
                >
                  <Building2 className="size-4" />
                  {companyName}
                </Link>
              )}
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-lg font-semibold tabular-nums px-4 py-1.5",
                ghostScoreClass(job.ghostScore)
              )}
            >
              Ghost score {job.ghostScore}/10
            </Badge>
          </div>
          <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {job.daysPosted === 0
                ? "Posted today"
                : job.daysPosted === 1
                  ? "1 day ago"
                  : `${job.daysPosted} days ago`}
            </span>
          </div>
        </header>

        {/* Risk signals breakdown */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Risk signals</h2>
          <Card>
            <CardContent className="pt-6">
              {job.redFlags.length > 0 ? (
                <div className="mb-4">
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                    Red flags
                  </p>
                  <ul className="space-y-2">
                    {job.redFlags.map((flag) => (
                      <li
                        key={flag}
                        className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300"
                      >
                        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No red flags reported for this role.
                </p>
              )}
              {job.greenFlags.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                    Positive signals
                  </p>
                  <ul className="space-y-2">
                    {job.greenFlags.map((flag) => (
                      <li
                        key={flag}
                        className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Full job description */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Full job description</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <DescriptionContent text={description} />
              </div>
              {job.techStack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Company info */}
        {company && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Company</h2>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg text-lg font-semibold">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{company.name}</CardTitle>
                      <CardDescription>
                        Company ghost score: {company.ghostScore}/10
                      </CardDescription>
                    </div>
                  </div>
                  {companySlug && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/companies/${companySlug}`}>
                        View company
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          </section>
        )}

        {/* Apply CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
            <div>
              <p className="font-medium">Apply for this role</p>
              <p className="text-muted-foreground text-sm">
                Apply on LinkedIn to get in touch with the hiring team.
              </p>
            </div>
            <Button size="lg" asChild>
              <a
                href="https://www.linkedin.com/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Apply on LinkedIn
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
