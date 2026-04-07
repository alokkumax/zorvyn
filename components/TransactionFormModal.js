"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/data/mockData";
import { useFinance } from "@/context/FinanceContext";

function getInitialForm(editing) {
  if (editing) {
    return {
      date: editing.date,
      amount: String(editing.amount),
      category: editing.category,
      type: editing.type,
      description: editing.description || "",
    };
  }
  return {
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    category: "Food",
    type: "expense",
    description: "",
  };
}

/**
 * Inner form — mounted with a `key` from the parent so state resets when add vs edit changes.
 */
function TransactionFormInner({ editing, onClose }) {
  const { addTransaction, updateTransaction } = useFinance();
  const [form, setForm] = useState(() => getInitialForm(editing));

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      date: form.date,
      amount: form.amount,
      category: form.category,
      type: form.type,
      description: form.description,
    };
    if (editing) {
      updateTransaction(editing.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      <h2 id="tx-modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {editing ? "Edit transaction" : "Add transaction"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="tx-date" className="text-sm text-zinc-600 dark:text-zinc-400">
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            required
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label htmlFor="tx-amount" className="text-sm text-zinc-600 dark:text-zinc-400">
            Amount (USD)
          </label>
          <input
            id="tx-amount"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label htmlFor="tx-cat" className="text-sm text-zinc-600 dark:text-zinc-400">
            Category
          </label>
          <select
            id="tx-cat"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Type</span>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="income"
                checked={form.type === "income"}
                onChange={() => handleChange("type", "income")}
              />
              Income
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={form.type === "expense"}
                onChange={() => handleChange("type", "expense")}
              />
              Expense
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="tx-desc" className="text-sm text-zinc-600 dark:text-zinc-400">
            Description (optional)
          </label>
          <input
            id="tx-desc"
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {editing ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Modal shell for add + edit. Viewer should not open this — parent controls that.
 * `key` on the inner form remounts state when switching between new row and an existing id.
 */
export default function TransactionFormModal({ open, onClose, editing }) {
  if (!open) return null;

  const formKey = editing ? editing.id : "new";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <TransactionFormInner key={formKey} editing={editing} onClose={onClose} />
    </div>
  );
}
