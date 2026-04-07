"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";

/** Line chart: cumulative balance at the end of each month. */
export default function BalanceChart() {
  const { stats } = useFinance();
  const data = stats.balanceOverTime;

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700">
        Add transactions to see balance over time.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        Balance over time
      </h2>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Running total after each month (from your transaction list).
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
