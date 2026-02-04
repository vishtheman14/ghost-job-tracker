import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCompanyBySlug,
  getJobsByCompanyId,
  type JobPosting,
} from "@/lib/mockData";
import { RemoteType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Briefcase, Calendar, TrendingUp } from "lucide-react";

function inferRemoteType(location: string): RemoteType {
  const loc = location.toLowerCase();
  if (loc.includes("hybrid")) return RemoteType.HYBRID;
  if (loc.includes("remote")) return RemoteType.REMOTE;
  return RemoteType.ONSITE;
}

function ghostScoreClass(score: number): string {
  if (score >= 8) return "ghost-score-high border";
  if (score >= 4) return "ghost-score-mid border";
  return "ghost-score-low border";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Company not found" };
  return {
    title: `${company.name} | GhostCheck`,
    description: `Open roles and hiring activity at ${company.name}. Ghost score: ${company.ghostScore}/10.`,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const jobs = getJobsByCompanyId(company.id);

  const avgDaysPosted =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((sum, j) => sum + j.daysPosted, 0) / jobs.length
        )
      : 0;
  const avgGhostScore =
    jobs.length > 0
      ? (
          jobs.reduce((sum, j) => sum + j.ghostScore, 0) / jobs.length
        ).toFixed(1)
      : "—";
  const fillRate = Math.min(
    95,
    Math.max(60, 55 + company.ghostScore * 4 + (jobs.length % 7))
  );
  const timeline = [...jobs].sort((a, b) => a.daysPosted - b.daysPosted);

  const jobForCard = (j: JobPosting) => ({
    ...j,
    company: { name: company.name },
    remoteType: inferRemoteType(j.location),
  });

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

        {/* Company header */}
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-xl text-2xl font-bold"
              aria-hidden
            >
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {company.name}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {jobs.length} open position{jobs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl border px-8 py-4 text-3xl font-bold tabular-nums",
              ghostScoreClass(company.ghostScore)
            )}
          >
            <span className="text-muted-foreground mr-2 text-base font-medium">
              Ghost score
            </span>
            {company.ghostScore}/10
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main: jobs + timeline */}
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="text-lg font-semibold mb-4">Open roles</h2>
              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="text-muted-foreground mb-3 size-10" />
                    <p className="text-muted-foreground text-sm">
                      No open positions right now.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ul className="flex flex-col gap-4">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <JobCard job={jobForCard(job)} companyName={company.name} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Hiring activity</h2>
              <Card>
                <CardContent className="p-0">
                  {timeline.length === 0 ? (
                    <p className="text-muted-foreground px-6 py-8 text-sm">
                      No recent activity.
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {timeline.map((job, i) => (
                        <li
                          key={job.id}
                          className="flex items-center gap-4 px-6 py-4"
                        >
                          <span
                            className={cn(
                              "bg-primary/10 text-primary size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-medium",
                              i === 0 && "bg-primary text-primary-foreground"
                            )}
                          >
                            {timeline.length - i}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{job.title}</p>
                            <p className="text-muted-foreground text-sm">
                              {job.daysPosted === 0
                                ? "Posted today"
                                : job.daysPosted === 1
                                  ? "1 day ago"
                                  : `${job.daysPosted} days ago`}
                            </p>
                          </div>
                          <Calendar className="text-muted-foreground size-4 shrink-0" />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar: metrics */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="size-4" />
                  Company metrics
                </CardTitle>
                <CardDescription>Based on current open roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-xs">Open roles</p>
                  <p className="text-xl font-semibold tabular-nums">
                    {jobs.length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Avg. posting duration
                  </p>
                  <p className="text-xl font-semibold tabular-nums">
                    {avgDaysPosted} days
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Avg. role ghost score
                  </p>
                  <p className="text-xl font-semibold tabular-nums">
                    {avgGhostScore}/10
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Est. fill rate (last 6 mo)
                  </p>
                  <p className="text-xl font-semibold tabular-nums">
                    {fillRate}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
