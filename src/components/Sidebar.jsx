import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowUpDown,
  PieChart,
  TrendingUp,
  X,
} from "lucide-react";
import Logo from "./Logo";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: ArrowUpDown, label: "Transactions", id: "transactions" },
  { icon: PieChart, label: "Categories", id: "categories" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
];

function SidebarContent({ activeTab, setActiveTab, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-dark-600">
        <div className="flex items-center gap-2.5">
          <Logo size={36} />
          <div>
            <span className="text-slate-800 dark:text-white font-bold text-sm tracking-tight">
              WealthWise
            </span>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              Personal Finance
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-3 px-2">
          Menu
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose && onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-150 text-left
                  ${
                    isActive
                      ? "bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-dark-700 hover:text-slate-800 dark:hover:text-white"
                  }
                `}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom — quick stats */}
      <div className="p-4 border-t border-surface-200 dark:border-dark-600">
        <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium opacity-80 mb-1">March 2026</p>
          <p className="text-lg font-bold">Tracking active</p>
          <p className="text-xs opacity-70 mt-1">
            All transactions saved locally
          </p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Desktop sidebar — always visible on large screens */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-dark-800 border-r border-surface-200 dark:border-dark-600 h-screen sticky top-0">
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={null}
        />
      </aside>

      {/* Mobile sidebar — slides in as overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            />
            {/* Panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-dark-800 border-r border-surface-200 dark:border-dark-600 z-40 lg:hidden flex flex-col"
            >
              <SidebarContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onClose={() => setIsMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
