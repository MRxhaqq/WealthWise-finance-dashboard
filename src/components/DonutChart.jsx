import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useFinance } from "../context/FinanceContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = [
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

function DonutChart() {
  const { categoryBreakdown, isDark } = useFinance();

  const labels = Object.keys(categoryBreakdown);
  const values = Object.values(categoryBreakdown);
  const total = values.reduce((sum, v) => sum + v, 0);

  if (labels.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm flex items-center justify-center h-full">
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          No expense data yet
        </p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: CATEGORY_COLORS.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#1e293b",
        bodyColor: isDark ? "#94a3b8" : "#64748b",
        borderColor: isDark ? "#2e2e52" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => {
            const pct = ((context.parsed / total) * 100).toFixed(1);
            return ` $${context.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-slate-800 dark:text-white font-semibold text-sm">
          Expense breakdown
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Spending by category
        </p>
      </div>

      {/* Donut chart */}
      <div className="relative" style={{ height: "160px" }}>
        <Doughnut data={data} options={options} />
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-slate-400 dark:text-slate-500 text-xs">Total</p>
          <p className="text-slate-800 dark:text-white font-bold text-base">
            ${total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {labels.map((label, i) => {
          const pct = ((values[i] / total) * 100).toFixed(1);
          return (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[i] }}
                />
                <span className="text-slate-600 dark:text-slate-400 text-xs">
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 text-xs">
                  {pct}%
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">
                  ${values[i].toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default DonutChart;
