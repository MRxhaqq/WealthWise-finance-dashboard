const TYPE_STYLES = {
  income: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  expense: {
    bg: "bg-red-500/10 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  saving: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/20",
    dot: "bg-indigo-500",
  },
};

function CategoryBadge({ type, category }) {
  const styles = TYPE_STYLES[type] || TYPE_STYLES.expense;

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5
      rounded-full text-xs font-medium border
      ${styles.bg} ${styles.text} ${styles.border}
    `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {category}
    </span>
  );
}

export default CategoryBadge;
