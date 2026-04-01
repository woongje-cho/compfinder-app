import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Competition, Workshop, Status } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───
export function getDaysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDday(dateStr?: string): string {
  const days = getDaysUntil(dateStr);
  if (days === null) return "";
  if (days < 0) return "Closed";
  if (days === 0) return "D-Day";
  return `D-${days}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return "";
  if (start && !end) return formatDate(start);
  if (!start && end) return `~ ${formatDate(end)}`;
  const s = new Date(start!);
  const e = new Date(end!);
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

// ─── Prize Formatting ───
export function formatPrize(amount?: number, currency?: string): string {
  if (!amount) return "";
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });
  return fmt.format(amount);
}

export function formatPrizeShort(amount?: number): string {
  if (!amount) return "";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

// ─── Status Computation ───
export function computeStatus(comp: Competition): Status {
  const now = new Date();
  if (comp.endDate && new Date(comp.endDate) < now) return "closed";
  if (comp.registrationDeadline) {
    const days = getDaysUntil(comp.registrationDeadline);
    if (days !== null) {
      if (days < 0) {
        // Registration closed — check if competition is still running
        if (comp.endDate && new Date(comp.endDate) > now) return "ongoing";
        if (comp.startDate && new Date(comp.startDate) > now) return "ongoing";
        return "closed";
      }
      if (days <= 7) return "closing_soon";
    }
  }
  if (comp.registrationOpen && new Date(comp.registrationOpen) > now)
    return "upcoming";
  return "open";
}

export function computeWorkshopStatus(w: Workshop): Status {
  const now = new Date();
  if (w.workshopDate && new Date(w.workshopDate) < now) return "closed";
  if (w.submissionDeadline) {
    const days = getDaysUntil(w.submissionDeadline);
    if (days !== null) {
      if (days < 0) {
        // Submission closed but workshop hasn't happened yet
        if (w.workshopDate && new Date(w.workshopDate) > now) return "ongoing";
        return "closed";
      }
      if (days <= 7) return "closing_soon";
    }
  }
  return "open";
}
