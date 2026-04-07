"use client";

import { useFinance } from "@/context/FinanceContext";
import { formatMoney } from "@/lib/format";

/** Short text insights derived from the same data as the charts. */
export default function Insights() {
  const { stats } = useFinance();

  const {
    highestCategory,
    highestAmount,
    incomeThisMonth,
    expenseThisMonth,
    incomeLastMonth,
    expenseLastMonth,
    totalBalance,
  } = stats;

  const netThisMonth = incomeThisMonth - expenseThisMonth;
  const netLastMonth = incomeLastMonth - expenseLastMonth;

  const expenseDelta = expenseLastMonth
    ? ((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100
    : null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Insights
      </h2>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Plain numbers your manager might ask for in a standup.
      </p>

      <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        <li className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Highest spending category:{" "}
          </span>
          {highestCategory ? (
            <>
              <span>{highestCategory}</span>
              <span className="text-zinc-500"> — </span>
              <span>{formatMoney(highestAmount)}</span>
            </>
          ) : (
            <span className="text-zinc-500">No expenses recorded.</span>
          )}
        </li>

        <li className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            This month vs last month (expenses):{" "}
          </span>
          {expenseLastMonth > 0 && expenseDelta !== null ? (
            <span>
              {formatMoney(expenseThisMonth)} now vs {formatMoney(expenseLastMonth)}{" "}
              last month
              <span
                className={
                  expenseDelta > 0
                    ? " text-amber-600 dark:text-amber-400"
                    : " text-emerald-600 dark:text-emerald-400"
                }
              >
                {" "}
                ({expenseDelta > 0 ? "+" : ""}
                {expenseDelta.toFixed(1)}%)
              </span>
            </span>
          ) : (
            <span className="text-zinc-500">
              Not enough history to compare two full months.
            </span>
          )}
        </li>

        <li className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Net this month (income − expenses):{" "}
          </span>
          {formatMoney(netThisMonth)}
        </li>

        <li className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/80">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            Net last month:{" "}
          </span>
          {formatMoney(netLastMonth)}
        </li>

        <li className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/40">
          <span className="font-medium text-emerald-900 dark:text-emerald-100">
            All-time balance:{" "}
          </span>
          {formatMoney(totalBalance)}
        </li>
      </ul>
    </section>
  );
}
