import type { Metadata } from "next";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Submit a Competition",
  description: "Know a competition we're missing? Submit it here.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Submit a Competition</h1>
      <p className="mb-8 text-zinc-400">
        Know an engineering competition we&apos;re missing? Let us know and we&apos;ll add it.
      </p>

      <form
        action="https://github.com"
        method="GET"
        className="space-y-6"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Competition Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. RoboCup 2026"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Official URL *
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Registration Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 transition-colors focus:border-zinc-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Brief description of the competition..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Your Email <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="for follow-up questions"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          Submit Competition
        </button>

        <p className="text-xs text-zinc-500">
          Submissions are reviewed before being added. We typically respond within 48 hours.
        </p>
      </form>
    </div>
  );
}
