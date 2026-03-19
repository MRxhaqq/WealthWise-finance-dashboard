# WealthWise — Personal Finance Dashboard

A premium personal finance dashboard built with React, Tailwind CSS, and Chart.js.
Track income, expenses, and savings with beautiful charts, full CRUD transaction
management, and light/dark mode — all data saved locally to your browser.

## Live Demo

[View live on Vercel](https://your-deployment-url.vercel.app)

## Features

- Light/dark mode toggle with smooth transition and preference persistence
- 4 animated stat cards — Balance, Income, Expenses, Savings
- Bar chart — 6 months of income vs expenses
- Donut chart — expense breakdown by category with percentages
- Full transaction CRUD — add, edit, delete with animated modal
- Per-field form validation with inline error messages
- Two-step delete confirmation to prevent accidents
- Search and filter transactions by type
- All data persisted to localStorage — survives page refresh
- Fully responsive — mobile sidebar with slide-in overlay
- Custom SVG shield logo — no icon library dependency

## Tech Stack

- React 18
- Tailwind CSS v4
- shadcn/ui
- Chart.js + react-chartjs-2
- Framer Motion
- Vite

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

1. Clone the repository

```bash
   git clone https://github.com/YOUR_USERNAME/wealthwise.git
   cd wealthwise
```

2. Install dependencies

```bash
   npm install
```

3. Start the development server

```bash
   npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173)

## What I Learned

- useReducer for managing complex CRUD state in one predictable place
- useContext for sharing global state without prop drilling
- useMemo for computing expensive values only when dependencies change
- Custom hooks for reusable stateful logic (useLocalStorage)
- Chart.js integration with react-chartjs-2
- Tailwind dark mode with class strategy and smooth transitions
- AnimatePresence for modal entrance and exit animations
- Framer Motion staggered children animations
- SVG as importable React assets
