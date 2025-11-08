'use client';

import type { Summary } from '@/lib/api';

interface SummaryCardsProps {
  summary: Summary | null;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) {
    return null;
  }

  const categories = Object.entries(summary.totals_by_category);

  return (
    <div className="summary-grid">
      <div className="card highlight">
        <p>Total Spent</p>
        <strong>${summary.total_spent.toFixed(2)}</strong>
      </div>
      <div className="card">
        <p>Recent Purchases</p>
        <ul>
          {summary.recent_expenses.map((expense) => (
            <li key={expense.id}>
              <span>{expense.title}</span>
              <span>${expense.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <p>By Category</p>
        {categories.length ? (
          <ul>
            {categories.map(([category, total]) => (
              <li key={category}>
                <span>{category}</span>
                <span>${total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <small>No data yet</small>
        )}
      </div>
    </div>
  );
}
