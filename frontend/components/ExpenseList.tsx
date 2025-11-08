'use client';

import type { Expense } from '@/lib/api';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => Promise<void> | void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (!expenses.length) {
    return <p>No expenses logged yet. Add your first one above!</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="title">{expense.title}</div>
                {expense.notes && <small>{expense.notes}</small>}
              </td>
              <td>{expense.category}</td>
              <td>{new Date(expense.incurred_on).toLocaleDateString()}</td>
              <td>${expense.amount.toFixed(2)}</td>
              <td>
                <button className="ghost" onClick={() => onDelete(expense.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
