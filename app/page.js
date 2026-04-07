import Link from "next/link";
import SummaryCards from "@/components/SummaryCards";
import DashboardCharts from "@/components/DashboardCharts";
import Insights from "@/components/Insights";

/**
 * Main dashboard: summaries, two charts, insights, link to full transaction list.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Mock numbers for learning layout, charts, and role-based UI.
          </p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          View all transactions →
        </Link>
      </div>

      <div className="space-y-8">
        <div className="animate-fade-up">
          <SummaryCards />
        </div>

        <div className="animate-fade-up">
          <DashboardCharts />
        </div>

        <div className="animate-fade-up">
          <Insights />
        </div>
      </div>
    </div>
  );
}
