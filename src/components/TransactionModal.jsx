import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, DollarSign, Calendar, Tag, FileText, Type } from "lucide-react";
import { useFinance, CATEGORIES } from "../context/FinanceContext";
import { generateId } from "../lib/utils";

const EMPTY_FORM = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

const TYPE_OPTIONS = [
  {
    value: "income",
    label: "Income",
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-500",
  },
  {
    value: "expense",
    label: "Expense",
    color: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-500",
  },
  {
    value: "saving",
    label: "Saving",
    color: "text-indigo-600 dark:text-indigo-400",
    activeBg: "bg-indigo-500",
  },
];

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function TransactionModal() {
  const { modalState, closeModal, dispatch } = useFinance();
  const { isOpen, editingTransaction } = modalState;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = !!editingTransaction;

  // When modal opens populate form with existing data if editing
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setForm({
          title: editingTransaction.title,
          amount: editingTransaction.amount.toString(),
          type: editingTransaction.type,
          category: editingTransaction.category,
          date: editingTransaction.date,
          note: editingTransaction.note || "",
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, editingTransaction]);

  // Update a single field in the form
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate all fields before submitting
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const transaction = {
      id: isEditing ? editingTransaction.id : generateId(),
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    };

    dispatch({
      type: isEditing ? "EDIT" : "ADD",
      payload: transaction,
    });

    closeModal();
  };

  const inputClass =
    "w-full bg-surface-50 dark:bg-dark-700 border border-surface-200 dark:border-dark-600 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400/30 transition-all";

  const errorInputClass =
    "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-dark-800 border border-surface-200 dark:border-dark-600 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto max-h-[90vh] flex flex-col">
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-dark-600 flex-shrink-0">
                <div>
                  <h2 className="text-slate-800 dark:text-white font-bold text-base">
                    {isEditing ? "Edit transaction" : "Add transaction"}
                  </h2>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                    {isEditing
                      ? "Update the details below"
                      : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl bg-surface-100 dark:bg-dark-700 border border-surface-200 dark:border-dark-600 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Transaction type selector */}
                <FormField label="Type">
                  <div className="flex gap-2">
                    {TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateField("type", option.value);
                          updateField("category", "");
                        }}
                        className={`
                          flex-1 py-2 rounded-xl text-xs font-semibold
                          border transition-all duration-150
                          ${
                            form.type === option.value
                              ? `${option.activeBg} text-white border-transparent shadow-sm`
                              : `bg-transparent border-surface-200 dark:border-dark-600 ${option.color} hover:border-current`
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Title */}
                <FormField label="Title" icon={Type} error={errors.title}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g. Monthly salary"
                    className={`${inputClass} ${errors.title ? errorInputClass : ""}`}
                  />
                </FormField>

                {/* Amount */}
                <FormField
                  label="Amount"
                  icon={DollarSign}
                  error={errors.amount}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => updateField("amount", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`${inputClass} pl-7 ${errors.amount ? errorInputClass : ""}`}
                    />
                  </div>
                </FormField>

                {/* Category */}
                <FormField label="Category" icon={Tag} error={errors.category}>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={`${inputClass} ${errors.category ? errorInputClass : ""}`}
                  >
                    <option value="">Select a category</option>
                    {(CATEGORIES[form.type] || []).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Date */}
                <FormField label="Date" icon={Calendar} error={errors.date}>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className={`${inputClass} ${errors.date ? errorInputClass : ""}`}
                  />
                </FormField>

                {/* Note — optional */}
                <FormField label="Note (optional)" icon={FileText}>
                  <textarea
                    value={form.note}
                    onChange={(e) => updateField("note", e.target.value)}
                    placeholder="Add a note..."
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </FormField>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 p-6 border-t border-surface-200 dark:border-dark-600 flex-shrink-0">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-dark-600 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-surface-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  {isEditing ? "Save changes" : "Add transaction"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TransactionModal;
