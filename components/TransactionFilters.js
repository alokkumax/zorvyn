"use client";

import { ALL_CATEGORIES } from "@/data/mockData";
import { useFinance } from "@/context/FinanceContext";

/** Same styling as the nav role dropdown: readable text, custom chevron, focus ring. */
const selectClassName =
  "w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-9 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/25";

const labelClassName =
  "mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

function ChevronDown() {
  return (
    <span
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
      aria-hidden
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  );
}

function FilterSelect({ id, label, value, onChange, children, minWidthClass = "min-w-[11rem]" }) {
  return (
    <div className={minWidthClass}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={onChange} className={selectClassName}>
          {children}
        </select>
        <ChevronDown />
      </div>
    </div>
  );
}

/** Search + dropdown filters + sort controls for the transactions table. */
export default function TransactionFilters() {
  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  } = useFinance();

  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm placeholder:text-zinc-400 transition hover:border-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:hover:border-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/25";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 md:flex-row md:flex-wrap md:items-end">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="search" className={labelClassName}>
          Search
        </label>
        <input
          id="search"
          type="search"
          placeholder="Category or description…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={inputClassName}
        />
      </div>

      <FilterSelect
        id="cat"
        label="Category"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="all">All categories</option>
        {ALL_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="type"
        label="Type"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </FilterSelect>

      <FilterSelect
        id="sort"
        label="Sort by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="date">Date</option>
        <option value="amount">Amount</option>
      </FilterSelect>

      <FilterSelect
        id="dir"
        label="Direction"
        value={sortDir}
        onChange={(e) => setSortDir(e.target.value)}
        minWidthClass="min-w-[14rem]"
      >
        <option value="desc">Newest / largest first</option>
        <option value="asc">Oldest / smallest first</option>
      </FilterSelect>
    </div>
  );
}
