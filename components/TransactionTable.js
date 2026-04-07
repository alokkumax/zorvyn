"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatDate, formatMoney } from "@/lib/format";
import TransactionFormModal from "@/components/TransactionFormModal";

/** Table of transactions with admin actions when role is admin. */
export default function TransactionTable() {
  const { filteredTransactions, isAdmin, removeTransaction } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div>
      {!isAdmin && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
          You are in <strong>Viewer</strong> mode (read-only). Use the role menu in the header
          to switch to <strong>Admin</strong> to add, edit, or delete rows.
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {filteredTransactions.length} row(s)
        </p>
        {isAdmin && (
          <button
            type="button"
            onClick={openAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Add transaction
          </button>
        )}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No transactions match your filters. Try clearing search or setting filters to
          &quot;All&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                  Amount
                </th>
                {isAdmin && (
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    {formatDate(t.date)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {t.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{t.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        t.type === "income"
                          ? "rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800 dark:bg-sky-900/50 dark:text-sky-200"
                          : "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                      }
                    >
                      {t.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                      t.type === "income"
                        ? "text-sky-700 dark:text-sky-300"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {formatMoney(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="mr-2 text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Delete this transaction?")) {
                            removeTransaction(t.id);
                          }
                        }}
                        className="text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionFormModal open={modalOpen} onClose={closeModal} editing={editing} />
    </div>
  );
}
