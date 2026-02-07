"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RemoteType } from "@/lib/types";
import { cn } from "@/lib/utils";

const TECH_OPTIONS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Node.js",
  "Go",
  "Ruby",
  ".NET",
  "Java",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Kubernetes",
  "GraphQL",
  "Rust",
  "Django",
];

const REMOTE_OPTIONS = [
  { value: "all", label: "All" },
  { value: RemoteType.REMOTE, label: "Remote" },
  { value: RemoteType.HYBRID, label: "Hybrid" },
  { value: RemoteType.ONSITE, label: "Onsite" },
] as const;

export type RemoteFilter = "all" | RemoteType;

export interface JobSearchFilters {
  keywords: string;
  location: string;
  techStack: string[];
  maxGhostScore: number;
  remoteType: RemoteFilter;
}

const defaultFilters: JobSearchFilters = {
  keywords: "",
  location: "",
  techStack: [],
  maxGhostScore: 10,
  remoteType: "all",
};

export function JobSearch({
  onSearch,
  className,
}: {
  onSearch?: (filters: JobSearchFilters) => void;
  className?: string;
}) {
  const [keywords, setKeywords] = useState(defaultFilters.keywords);
  const [location, setLocation] = useState(defaultFilters.location);
  const [techStack, setTechStack] = useState<string[]>(defaultFilters.techStack);
  const [maxGhostScore, setMaxGhostScore] = useState(
    defaultFilters.maxGhostScore
  );
  const [remoteType, setRemoteType] = useState<RemoteFilter>(
    defaultFilters.remoteType
  );
  const [techOpen, setTechOpen] = useState(false);
  const techRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (techRef.current && !techRef.current.contains(event.target as Node)) {
        setTechOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleTech(tech: string) {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.({
      keywords,
      location,
      techStack,
      maxGhostScore,
      remoteType,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="keywords" className="text-sm font-medium">
            Job title / Keywords
          </label>
          <Input
            id="keywords"
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="e.g. San Francisco or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2" ref={techRef}>
          <label className="text-sm font-medium">Tech stack</label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full justify-between px-3 font-normal"
              onClick={() => setTechOpen((o) => !o)}
            >
              <span className="truncate">
                {techStack.length === 0
                  ? "Select technologies..."
                  : techStack.join(", ")}
              </span>
            </Button>
            {techOpen && (
              <div className="border-input bg-popover absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border p-1 shadow-md">
                {TECH_OPTIONS.map((tech) => (
                  <label
                    key={tech}
                    className="focus:bg-accent hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={techStack.includes(tech)}
                      onChange={() => toggleTech(tech)}
                      className="border-input size-4 rounded border"
                    />
                    {tech}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="remote" className="text-sm font-medium">
            Remote type
          </label>
          <Select
            value={remoteType}
            onValueChange={(v) => setRemoteType(v as RemoteFilter)}
          >
            <SelectTrigger id="remote" className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {REMOTE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="ghost-score" className="text-sm font-medium">
            Max ghost score: {maxGhostScore}
          </label>
          <input
            id="ghost-score"
            type="range"
            min={0}
            max={10}
            step={1}
            value={maxGhostScore}
            onChange={(e) => setMaxGhostScore(Number(e.target.value))}
            className="border-input h-2 w-full cursor-pointer appearance-none rounded-full border bg-transparent accent-primary"
          />
        </div>
      </div>

      <Button type="submit">Search</Button>
    </form>
  );
}
