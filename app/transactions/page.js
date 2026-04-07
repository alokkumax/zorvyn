import TransactionFilters from "@/components/TransactionFilters";
import TransactionTable from "@/components/TransactionTable";

export const metadata = {
  title: "Transactions | Finance Dashboard",
};

/**
 * Full transaction list with search, filters, sort, and admin edit tools.
 */
export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Search and filter the same data that powers the dashboard charts.
        </p>
      </div>

      <div className="space-y-6">
        <TransactionFilters />
        <TransactionTable />
      </div>
    </div>
  );
}
