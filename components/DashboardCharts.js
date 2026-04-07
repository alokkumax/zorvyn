"use client";

import dynamic from "next/dynamic";

// Recharts needs a real browser size — load after mount (client-only).
const BalanceChart = dynamic(() => import("@/components/BalanceChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800" />
  ),
});

const CategoryChart = dynamic(() => import("@/components/CategoryChart"), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800" />
  ),
});

/** Two-chart row for the dashboard (kept in one client file for dynamic import rules). */
export default function DashboardCharts() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <BalanceChart />
      <CategoryChart />
    </div>
  );
}
