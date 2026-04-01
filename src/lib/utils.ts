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

  // 1. Event already ended → closed
  if (comp.endDate && new Date(comp.endDate) < now) return "closed";

  // 2. Has registration deadline → use it for primary logic
  if (comp.registrationDeadline) {
    const days = getDaysUntil(comp.registrationDeadline);
    if (days !== null) {
      if (days < 0) {
        // Registration closed — is the event still upcoming/running?
        if (comp.endDate && new Date(comp.endDate) > now) return "ongoing";
        if (comp.startDate && new Date(comp.startDate) > now) return "ongoing";
        return "closed";
      }
      if (days <= 7) return "closing_soon";
      return "open";
    }
  }

  // 3. No registration deadline but has start date
  if (comp.startDate) {
    const startDays = getDaysUntil(comp.startDate);
    if (startDays !== null) {
      if (startDays > 30) return "upcoming";
      if (startDays > 0) return "open";
      // Start date passed
      if (comp.endDate && new Date(comp.endDate) > now) return "ongoing";
      return "closed";
    }
  }

  // 4. Has registrationOpen → check if not yet open
  if (comp.registrationOpen && new Date(comp.registrationOpen) > now)
    return "upcoming";

  // 5. No dates at all → preserve JSON status as-is
  return comp.status;
}

export function computeWorkshopStatus(w: Workshop): Status {
  const now = new Date();

  // 1. Workshop already happened → closed
  if (w.workshopDate && new Date(w.workshopDate) < now) return "closed";

  // 2. Has submission deadline
  if (w.submissionDeadline) {
    const days = getDaysUntil(w.submissionDeadline);
    if (days !== null) {
      if (days < 0) {
        if (w.workshopDate && new Date(w.workshopDate) > now) return "ongoing";
        return "closed";
      }
      if (days <= 7) return "closing_soon";
      return "open";
    }
  }

  // 3. No submission deadline but has workshop date
  if (w.workshopDate) {
    const wDays = getDaysUntil(w.workshopDate);
    if (wDays !== null && wDays > 30) return "upcoming";
    if (wDays !== null && wDays > 0) return "open";
  }

  // 4. No dates → preserve JSON status
  return w.status;
}
