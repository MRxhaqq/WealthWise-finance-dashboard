import { motion } from "framer-motion";
import { Sun, Moon, Plus, Menu } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function Header({ onMenuClick }) {
  const { isDark, toggleTheme, openAddModal } = useFinance();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-surface-200 dark:border-dark-600"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left — mobile menu + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right — theme toggle + add button */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-surface-100 dark:bg-dark-700 border border-surface-200 dark:border-dark-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all duration-200"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Add transaction button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus size={15} />
            <span className="hidden sm:block">Add transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
