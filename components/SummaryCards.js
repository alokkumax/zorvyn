"use client";

import { useFinance } from "@/context/FinanceContext";
import { formatMoney } from "@/lib/format";

/** Three summary tiles for the dashboard hero area. */
export default function SummaryCards() {
  const { stats } = useFinance();
  const { totalBalance, totalIncome, totalExpense } = stats;

  const cards = [
    {
      title: "Total balance",
      value: formatMoney(totalBalance),
      hint: "Income minus expenses (all time)",
      accent: "border-l-4 border-l-emerald-500",
    },
    {
      title: "Total income",
      value: formatMoney(totalIncome),
      hint: "Sum of every income row",
      accent: "border-l-4 border-l-sky-500",
    },
    {
      title: "Total expenses",
      value: formatMoney(totalExpense),
      hint: "Sum of every expense row",
      accent: "border-l-4 border-l-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.title}
          className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${c.accent}`}
        >
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {c.title}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {c.value}
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {c.hint}
          </p>
        </div>
      ))}
    </div>
  );
}
