'use client';

import { useEffect, useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SummaryCards from '@/components/SummaryCards';
import type { Expense, ExpensePayload, Summary } from '@/lib/api';
import { createExpense, deleteExpense, getExpenses, getSummary } from '@/lib/api';

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expenseData, summaryData] = await Promise.all([getExpenses(), getSummary()]);
      setExpenses(expenseData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expense data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (payload: ExpensePayload) => {
    setError(null);
    await createExpense(payload);
    await refresh();
  };

  const handleDelete = async (id: number) => {
    setError(null);
    await deleteExpense(id);
    await refresh();
  };

  return (
    <main>
      <header>
        <h1>Expense Tracker</h1>
        <p>Log purchases, categorize spending, and stay on top of your money.</p>
      </header>

      {error && <div className="error">{error}</div>}

      <section>
        <h2>Add expense</h2>
        <ExpenseForm onSubmit={handleCreate} />
      </section>

      <section>
        <h2>Insights</h2>
        {loading ? <p>Loading summary...</p> : <SummaryCards summary={summary} />}
      </section>

      <section>
        <h2>History</h2>
        {loading ? <p>Loading expenses...</p> : <ExpenseList expenses={expenses} onDelete={handleDelete} />}
      </section>
    </main>
  );
}
