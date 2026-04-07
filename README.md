# Finance Dashboard (Next.js)

A small **Finance Dashboard** built for learning: mock data only, **React Context** for state, and a **role switcher** (viewer vs admin) with no backend.

## Setup

1. Install dependencies (already done if you cloned with `node_modules`):

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

4. Production build:

   ```bash
   npm run build
   npm start
   ```

## Features

- **Dashboard** (`/`): summary cards (balance, income, expenses), **balance over time** (line chart), **expenses by category** (bar chart), and an **insights** panel (highest category, month-to-month comparisons).
- **Transactions** (`/transactions`): searchable table with **category** and **type** filters, **sort** by date or amount, and **viewer/admin** behavior.
- **Roles (frontend only)**:
  - **Viewer**: read-only — no add/edit/delete.
  - **Admin**: can add, edit, and delete transactions.
- **Persistence**: transactions, role, and light/dark preference are saved in **localStorage** (after the first client load).
- **Dark mode**: toggle in the header (stored in localStorage).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for charts
- React **Context API** + `useState` / `useMemo` (no heavy state libraries)

## Approach (brief)

- **`data/mockData.js`** — initial transaction list and category list.
- **`context/FinanceContext.js`** — one provider holds transactions, filters, sort, role, and theme; exposes helpers like `addTransaction` and computed `stats`.
- **`components/`** — small, focused UI pieces (nav, cards, charts, table, modal) so a junior can open one file at a time.
- **Charts** are loaded from `components/DashboardCharts.js` using `next/dynamic` and `ssr: false` so Recharts can measure the browser container (Next.js requires this inside a Client Component).

## Folder structure

```
app/
  layout.js          # Root layout + FinanceProvider + NavBar
  page.js            # Dashboard
  transactions/
    page.js          # Transactions list
components/          # UI building blocks (includes DashboardCharts for client-only charts)
context/
  FinanceContext.js
data/
  mockData.js
lib/
  format.js          # Currency / date helpers
```

## License

Private / educational use.

# zorvyn
