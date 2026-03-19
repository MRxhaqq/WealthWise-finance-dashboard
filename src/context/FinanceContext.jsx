import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../lib/utils";

// Step 1 — Create the context object
// This is the "bank" — it holds everything
export const FinanceContext = createContext(null);

// Step 2 — Sample transactions to start with
// So the dashboard isn't empty on first load
const SAMPLE_TRANSACTIONS = [
  {
    id: generateId(),
    title: "Monthly salary",
    amount: 5200,
    type: "income",
    category: "Work",
    date: "2026-03-01",
    note: "March salary payment",
  },
  {
    id: generateId(),
    title: "Rent payment",
    amount: 1200,
    type: "expense",
    category: "Housing",
    date: "2026-03-02",
    note: "",
  },
  {
    id: generateId(),
    title: "Grocery shopping",
    amount: 180,
    type: "expense",
    category: "Food",
    date: "2026-03-04",
    note: "Weekly groceries",
  },
  {
    id: generateId(),
    title: "Netflix subscription",
    amount: 15,
    type: "expense",
    category: "Entertainment",
    date: "2026-03-05",
    note: "",
  },
  {
    id: generateId(),
    title: "Freelance project",
    amount: 800,
    type: "income",
    category: "Freelance",
    date: "2026-03-06",
    note: "Logo design project",
  },
  {
    id: generateId(),
    title: "Savings transfer",
    amount: 500,
    type: "saving",
    category: "Savings",
    date: "2026-03-07",
    note: "Monthly savings goal",
  },
  {
    id: generateId(),
    title: "Electric bill",
    amount: 95,
    type: "expense",
    category: "Utilities",
    date: "2026-03-08",
    note: "",
  },
  {
    id: generateId(),
    title: "Gym membership",
    amount: 45,
    type: "expense",
    category: "Health",
    date: "2026-03-10",
    note: "",
  },
  {
    id: generateId(),
    title: "Uber rides",
    amount: 62,
    type: "expense",
    category: "Transport",
    date: "2026-03-12",
    note: "",
  },
  {
    id: generateId(),
    title: "Online course",
    amount: 29,
    type: "expense",
    category: "Education",
    date: "2026-03-14",
    note: "React advanced course",
  },
];

// Step 3 — The reducer function
// This is the "teller" — handles every possible operation
// state = current array of transactions
// action = { type: 'ADD' | 'EDIT' | 'DELETE', payload: data }
function transactionReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // Prepend new transaction so it appears at the top of the list
      return [action.payload, ...state];

    case "EDIT":
      // Find the transaction with matching id and replace it
      return state.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction,
      );

    case "DELETE":
      // Remove the transaction with matching id
      return state.filter((transaction) => transaction.id !== action.payload);

    case "SET_ALL":
      // Replace entire state — used when loading from localStorage
      return action.payload;

    default:
      return state;
  }
}

// Step 4 — The categories available for transactions
export const CATEGORIES = {
  income: [
    "Work",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other Income",
  ],
  expense: [
    "Housing",
    "Food",
    "Transport",
    "Health",
    "Entertainment",
    "Education",
    "Utilities",
    "Shopping",
    "Travel",
    "Other",
  ],
  saving: ["Savings", "Investment", "Emergency Fund", "Retirement", "Goal"],
};

// Step 5 — The Provider component
// This wraps the entire app and makes everything available globally
export function FinanceProvider({ children }) {
  // Load transactions from localStorage
  // If nothing saved yet use the sample data
  const [savedTransactions, setSavedTransactions] = useLocalStorage(
    "wealthwise-transactions",
    SAMPLE_TRANSACTIONS,
  );

  // useReducer takes the reducer function and the initial state
  // Initial state comes from localStorage via useLocalStorage
  const [transactions, dispatch] = useReducer(
    transactionReducer,
    savedTransactions,
  );

  // Dark mode state
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // Modal state — which modal is open and which transaction is being edited
  const [modalState, setModalState] = useState({
    isOpen: false,
    editingTransaction: null,
  });

  // Whenever transactions change save them to localStorage
  useEffect(() => {
    setSavedTransactions(transactions);
  }, [transactions]);

  // Dark mode toggle function
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("wealthwise-theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("wealthwise-theme", "dark");
    }
    setIsDark(!isDark);
  };

  // Modal helpers
  const openAddModal = () => {
    setModalState({ isOpen: true, editingTransaction: null });
  };

  const openEditModal = (transaction) => {
    setModalState({ isOpen: true, editingTransaction: transaction });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, editingTransaction: null });
  };

  // useMemo — computed values that only recalculate when
  // transactions array changes. This keeps the UI fast.
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = transactions
      .filter((t) => t.type === "saving")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, savings, balance };
  }, [transactions]);

  // useMemo — category breakdown for the donut chart
  // Groups expenses by category and sums the amounts
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });
    return breakdown;
  }, [transactions]);

  // useMemo — monthly data for the bar chart
  // Gets last 6 months of income vs expense data
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", { month: "short" });

      const monthIncome = transactions
        .filter((t) => t.type === "income" && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      const monthExpenses = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        label: monthLabel,
        income: monthIncome,
        expenses: monthExpenses,
      });
    }

    return months;
  }, [transactions]);

  // Everything the context exposes to the whole app
  const value = {
    // Data
    transactions,
    stats,
    categoryBreakdown,
    monthlyData,

    // CRUD operations
    dispatch,

    // Theme
    isDark,
    toggleTheme,

    // Modal
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

// Step 6 — Custom hook for consuming the context
// Instead of importing both useContext and FinanceContext
// in every component, they just import useFinance
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider");
  }
  return context;
}
