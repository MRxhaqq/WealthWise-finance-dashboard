import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useFinance } from "../context/FinanceContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function BarChart() {
  const { monthlyData, isDark } = useFinance();

  const data = {
    labels: monthlyData.map((m) => m.label),
    datasets: [
      {
        label: "Income",
        data: monthlyData.map((m) => m.income),
        backgroundColor: isDark
          ? "rgba(99,102,241,0.7)"
          : "rgba(99,102,241,0.8)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Expenses",
        data: monthlyData.map((m) => m.expenses),
        backgroundColor: isDark ? "rgba(239,68,68,0.6)" : "rgba(239,68,68,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: { size: 11, weight: "500" },
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
        titleColor: isDark ? "#e2e8f0" : "#1e293b",
        bodyColor: isDark ? "#94a3b8" : "#64748b",
        borderColor: isDark ? "#2e2e52" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => ` $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? "#64748b" : "#94a3b8",
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        },
        ticks: {
          color: isDark ? "#64748b" : "#94a3b8",
          font: { size: 11 },
          callback: (value) => `$${value.toLocaleString()}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-slate-800 dark:text-white font-semibold text-sm">
          Monthly overview
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Income vs expenses — last 6 months
        </p>
      </div>
      <div style={{ height: "220px" }}>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}

export default BarChart;
