import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import BarChart from "./components/BarChart";
import DonutChart from "./components/DonutChart";
import TransactionList from "./components/TransactionList";
import TransactionModal from "./components/TransactionModal";
import { formatCurrency } from "./lib/utils";

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// Overview tab — the main dashboard view
function OverviewTab() {
  return (
    <motion.div
      key="overview"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChart />
        </div>
        <div>
          <DonutChart />
        </div>
      </div>
      <TransactionList />
    </motion.div>
  );
}

// Transactions tab — focused on the transaction list
function TransactionsTab() {
  const { stats } = useFinance();

  return (
    <motion.div
      key="transactions"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Quick summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total income",
            value: stats.income,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Total expenses",
            value: stats.expenses,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-500/10",
          },
          {
            label: "Net balance",
            value: stats.balance,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-500/10",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-4 shadow-sm"
          >
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className={`text-xl font-bold ${item.color}`}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Full transaction list */}
      <TransactionList />
    </motion.div>
  );
}

// Categories tab — focused on spending breakdown
function CategoriesTab() {
  const { categoryBreakdown, stats } = useFinance();

  const categories = Object.entries(categoryBreakdown).sort(
    (a, b) => b[1] - a[1],
  );

  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
    "#ec4899",
    "#14b8a6",
  ];

  return (
    <motion.div
      key="categories"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart — larger on this tab */}
        <DonutChart />

        {/* Category breakdown table */}
        <div className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-1">
            Spending by category
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-5">
            Ranked by total amount spent
          </p>

          {categories.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">
              No expense data yet
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map(([category, amount], index) => {
                const pct =
                  stats.expenses > 0
                    ? ((amount / stats.expenses) * 100).toFixed(1)
                    : 0;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                          {category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 dark:text-slate-500 text-xs">
                          {pct}%
                        </span>
                        <span className="text-slate-800 dark:text-white text-sm font-semibold">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-surface-100 dark:bg-dark-700 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        className="h-1.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Analytics tab — focused on monthly trends
function AnalyticsTab() {
  const { monthlyData, stats, transactions } = useFinance();

  const savingsRate =
    stats.income > 0
      ? (((stats.income - stats.expenses) / stats.income) * 100).toFixed(1)
      : 0;

  const avgTransaction =
    transactions.length > 0
      ? stats.expenses / transactions.filter((t) => t.type === "expense").length
      : 0;

  const highestMonth = monthlyData.reduce(
    (max, month) => (month.income > max.income ? month : max),
    monthlyData[0] || { label: "N/A", income: 0 },
  );

  return (
    <motion.div
      key="analytics"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Savings rate",
            value: `${savingsRate}%`,
            sub: "Of total income saved",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Avg expense",
            value: formatCurrency(avgTransaction),
            sub: "Per transaction",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-500/10",
          },
          {
            label: "Best month",
            value: highestMonth.label,
            sub: `${formatCurrency(highestMonth.income)} income`,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-500/10",
          },
          {
            label: "Transactions",
            value: transactions.length,
            sub: "Total recorded",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm"
          >
            <div
              className={`w-8 h-8 ${metric.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
              {metric.label}
            </p>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
              {metric.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart — full width on analytics tab */}
      <BarChart />

      {/* Monthly breakdown table */}
      <div className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm">
        <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-1">
          Monthly breakdown
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs mb-5">
          Income, expenses and net for the last 6 months
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-dark-600">
                {["Month", "Income", "Expenses", "Net"].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3 pr-4"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, i) => {
                const net = month.income - month.expenses;
                return (
                  <tr
                    key={i}
                    className="border-b border-surface-100 dark:border-dark-700 last:border-0"
                  >
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      {month.label}
                    </td>
                    <td className="py-3 pr-4 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                      {formatCurrency(month.income)}
                    </td>
                    <td className="py-3 pr-4 text-red-600 dark:text-red-400 text-sm font-semibold">
                      {formatCurrency(month.expenses)}
                    </td>
                    <td
                      className={`py-3 text-sm font-bold ${
                        net >= 0
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {net >= 0 ? "+" : ""}
                      {formatCurrency(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// Tab content map
function TabContent({ activeTab }) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === "overview" && <OverviewTab key="overview" />}
      {activeTab === "transactions" && <TransactionsTab key="transactions" />}
      {activeTab === "categories" && <CategoriesTab key="categories" />}
      {activeTab === "analytics" && <AnalyticsTab key="analytics" />}
    </AnimatePresence>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-dark-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <TabContent activeTab={activeTab} />
          </div>
        </main>
      </div>

      <TransactionModal />
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}

export default App;
