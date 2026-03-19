import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../lib/utils";

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatCurrency(count)}</span>;
}

const CARD_CONFIG = [
  {
    key: "balance",
    label: "Total balance",
    icon: Wallet,
    iconBg: "bg-brand-500/10 dark:bg-brand-500/20",
    iconColor: "text-brand-500",
    valueColor: "text-brand-600 dark:text-brand-400",
    trend: null,
  },
  {
    key: "income",
    label: "Total income",
    icon: TrendingUp,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    valueColor: "text-emerald-600 dark:text-emerald-400",
    trend: "up",
  },
  {
    key: "expenses",
    label: "Total expenses",
    icon: TrendingDown,
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-500",
    valueColor: "text-red-600 dark:text-red-400",
    trend: "down",
  },
  {
    key: "savings",
    label: "Total savings",
    icon: PiggyBank,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500",
    valueColor: "text-purple-600 dark:text-purple-400",
    trend: "up",
  },
];

function StatCard({ config, value, index }) {
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}
        >
          <Icon size={18} className={config.iconColor} />
        </div>
        {config.trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              config.trend === "up"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {config.trend === "up" ? "↑" : "↓"} This month
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        {config.label}
      </p>
      <p className={`text-2xl font-bold tracking-tight ${config.valueColor}`}>
        <AnimatedCounter value={value} />
      </p>
    </motion.div>
  );
}

function StatCards() {
  const { stats } = useFinance();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map((config, index) => (
        <StatCard
          key={config.key}
          config={config}
          value={stats[config.key]}
          index={index}
        />
      ))}
    </div>
  );
}

export default StatCards;
