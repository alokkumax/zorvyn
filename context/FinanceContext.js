"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initialTransactions } from "@/data/mockData";

// Keys for localStorage — keep them in one place so we do not typo strings.
const STORAGE_TRANSACTIONS = "finance-dashboard-transactions";
const STORAGE_ROLE = "finance-dashboard-role";
const STORAGE_THEME = "finance-dashboard-theme";

const FinanceContext = createContext(null);

/** Create a new id in the browser without extra libraries. */
function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return String(Date.now());
}

/**
 * Build dashboard numbers from the raw transaction list.
 * Kept as a plain function so it is easy to test and read.
 */
function buildStats(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCategory = {};

  for (const t of transactions) {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      expenseByCategory[t.category] =
        (expenseByCategory[t.category] || 0) + t.amount;
    }
  }

  const totalBalance = totalIncome - totalExpense;

  // Highest spending category (expenses only).
  let highestCategory = null;
  let highestAmount = 0;
  for (const [name, value] of Object.entries(expenseByCategory)) {
    if (value > highestAmount) {
      highestAmount = value;
      highestCategory = name;
    }
  }

  // Compare this calendar month vs the previous one.
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  let incomeThisMonth = 0;
  let expenseThisMonth = 0;
  let incomeLastMonth = 0;
  let expenseLastMonth = 0;

  for (const t of transactions) {
    const d = new Date(t.date);
    const m = d.getMonth();
    const y = d.getFullYear();
    if (m === thisMonth && y === thisYear) {
      if (t.type === "income") incomeThisMonth += t.amount;
      else expenseThisMonth += t.amount;
    }
    if (m === prevMonth && y === prevYear) {
      if (t.type === "income") incomeLastMonth += t.amount;
      else expenseLastMonth += t.amount;
    }
  }

  // Balance over time: one point per month, cumulative balance.
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const netByMonthKey = {};
  const monthOrder = [];

  for (const t of sorted) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (netByMonthKey[key] === undefined) {
      netByMonthKey[key] = 0;
      monthOrder.push(key);
    }
    if (t.type === "income") netByMonthKey[key] += t.amount;
    else netByMonthKey[key] -= t.amount;
  }

  let running = 0;
  const balanceOverTime = monthOrder.map((key) => {
    running += netByMonthKey[key];
    const [y, m] = key.split("-");
    const label = `${monthNames[Number(m) - 1]} ${y}`;
    return { month: label, balance: running };
  });

  // Pie / bar data for category chart.
  const categoryChartData = Object.entries(expenseByCategory).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    highestCategory,
    highestAmount,
    incomeThisMonth,
    expenseThisMonth,
    incomeLastMonth,
    expenseLastMonth,
    balanceOverTime,
    categoryChartData,
  };
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState("viewer");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const [darkMode, setDarkMode] = useState(false);
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrating from localStorage on mount is a valid external-system sync */
  useEffect(() => {
    try {
      const rawTx = localStorage.getItem(STORAGE_TRANSACTIONS);
      if (rawTx) {
        const parsed = JSON.parse(rawTx);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
      const rawRole = localStorage.getItem(STORAGE_ROLE);
      if (rawRole === "admin" || rawRole === "viewer") {
        setRole(rawRole);
      }
      const rawTheme = localStorage.getItem(STORAGE_THEME);
      if (rawTheme === "dark") {
        setDarkMode(true);
      }
    } catch {
      // If storage is broken, we just keep defaults.
    }
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save whenever state changes (after first load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      /* ignore */
    }
  }, [transactions, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_ROLE, role);
    } catch {
      /* ignore */
    }
  }, [role, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_THEME, darkMode ? "dark" : "light");
    } catch {
      /* ignore */
    }
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, ready]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  const addTransaction = useCallback((partial) => {
    const item = {
      id: newId(),
      date: partial.date,
      amount: Number(partial.amount),
      category: partial.category,
      type: partial.type,
      description: partial.description || "",
    };
    setTransactions((prev) => [item, ...prev]);
  }, []);

  const updateTransaction = useCallback((id, partial) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...partial,
              amount:
                partial.amount !== undefined ? Number(partial.amount) : t.amount,
            }
          : t,
      ),
    );
  }, []);

  const removeTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const inCat = t.category.toLowerCase().includes(q);
        const inDesc = (t.description || "").toLowerCase().includes(q);
        return inCat || inDesc;
      });
    }

    if (filterCategory !== "all") {
      list = list.filter((t) => t.category === filterCategory);
    }

    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") {
        cmp = new Date(a.date) - new Date(b.date);
      } else {
        cmp = a.amount - b.amount;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [
    transactions,
    searchQuery,
    filterCategory,
    filterType,
    sortBy,
    sortDir,
  ]);

  const stats = useMemo(
    () => buildStats(transactions),
    [transactions],
  );

  const value = {
    transactions,
    role,
    setRole,
    isAdmin: role === "admin",
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
    filteredTransactions,
    stats,
    addTransaction,
    updateTransaction,
    removeTransaction,
    darkMode,
    toggleDarkMode,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used inside FinanceProvider");
  }
  return ctx;
}
