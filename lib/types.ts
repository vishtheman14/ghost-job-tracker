// ─── Enums ─────────────────────────────────────────────────────────────────

export enum RemoteType {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ONSITE = "ONSITE",
}

export enum Seniority {
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  STAFF = "STAFF",
  PRINCIPAL = "PRINCIPAL",
}

// ─── Company ───────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  slug: string;
  ghostScore: number;
  logoUrl: string;
  website?: string;
  description?: string;
}

// ─── Job Posting ───────────────────────────────────────────────────────────

export interface JobPosting {
  id: string;
  title: string;
  companyId: string;
  company?: Company;
  location: string;
  remoteType: RemoteType;
  seniority?: Seniority;
  techStack: string[];
  salaryMin: number;
  salaryMax: number;
  daysPosted: number;
  ghostScore: number;
  redFlags: string[];
  greenFlags: string[];
  description?: string;
  applicationUrl?: string;
}
