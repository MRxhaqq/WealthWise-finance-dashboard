import { motion } from "framer-motion";
import { SearchX, PlusCircle } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function EmptyState({ isFiltered }) {
  const { openAddModal } = useFinance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {isFiltered ? (
        <>
          <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-dark-700 flex items-center justify-center mb-4">
            <SearchX size={24} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
            No results found
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Try a different search term or filter
          </p>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <PlusCircle size={24} className="text-indigo-500" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
            No transactions yet
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">
            Add your first transaction to get started
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Add transaction
          </button>
        </>
      )}
    </motion.div>
  );
}

export default EmptyState;
