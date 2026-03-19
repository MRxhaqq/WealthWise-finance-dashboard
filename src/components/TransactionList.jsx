import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Pencil, Filter } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../lib/utils";
import CategoryBadge from "./CategoryBadge";
import EmptyState from "./EmptyState";

const FILTER_OPTIONS = ["All", "Income", "Expense", "Saving"];

const TYPE_AMOUNT_COLOR = {
  income: "text-emerald-600 dark:text-emerald-400",
  expense: "text-red-600 dark:text-red-400",
  saving: "text-indigo-600 dark:text-indigo-400",
};

const TYPE_ICON = {
  income: "+",
  expense: "-",
  saving: "→",
};

function TransactionRow({ transaction, index }) {
  const { dispatch, openEditModal } = useFinance();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      dispatch({ type: "DELETE", payload: transaction.id });
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-start gap-3 p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-dark-700/50 transition-colors group"
    >
      {/* Type indicator */}
      <div
        className={`
        w-9 h-9 rounded-xl flex items-center justify-center
        text-base font-bold flex-shrink-0 mt-0.5
        ${
          transaction.type === "income"
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : transaction.type === "saving"
              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
        }
      `}
      >
        {TYPE_ICON[transaction.type]}
      </div>

      {/* Main content — takes all remaining space */}
      <div className="flex-1 min-w-0">
        {/* Top row — title + amount */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-slate-800 dark:text-white font-medium text-sm truncate flex-1">
            {transaction.title}
          </p>
          <p
            className={`font-bold text-sm flex-shrink-0 ${TYPE_AMOUNT_COLOR[transaction.type]}`}
          >
            {TYPE_ICON[transaction.type]}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Bottom row — date + badge */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <p className="text-slate-400 dark:text-slate-500 text-xs flex-shrink-0">
            {formatDate(transaction.date)}
          </p>
          <CategoryBadge
            type={transaction.type}
            category={transaction.category}
          />
        </div>

        {/* Note — only shows if present, on its own line */}
        {transaction.note && (
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 truncate">
            {transaction.note}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => openEditModal(transaction)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={handleDelete}
          className={`p-1.5 rounded-lg transition-all text-xs ${
            confirmDelete
              ? "bg-red-500 text-white px-2"
              : "text-slate-400 hover:text-red-500 hover:bg-red-500/10"
          }`}
        >
          {confirmDelete ? "Confirm?" : <Trash2 size={13} />}
        </button>
      </div>
    </motion.div>
  );
}

function TransactionList() {
  const { transactions } = useFinance();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Derived state — filter and search without extra useState
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || t.type === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, activeFilter]);

  const isFiltered = searchQuery !== "" || activeFilter !== "All";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl shadow-sm"
    >
      {/* Header */}
      <div className="p-5 border-b border-surface-200 dark:border-dark-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm">
              Transactions
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
              {filteredTransactions.length} of {transactions.length} shown
            </p>
          </div>
          <Filter size={15} className="text-slate-400 dark:text-slate-500" />
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-surface-50 dark:bg-dark-700 border border-surface-200 dark:border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400/30 transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                border transition-all duration-150
                ${
                  activeFilter === filter
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                    : "bg-transparent border-surface-200 dark:border-dark-500 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction rows */}
      <div className="p-2">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <EmptyState isFiltered={isFiltered} />
          ) : (
            filteredTransactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default TransactionList;
