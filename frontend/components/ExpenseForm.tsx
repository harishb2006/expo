'use client';

import { FormEvent, useState } from 'react';
import type { ExpensePayload } from '@/lib/api';

const categories = ['General', 'Food', 'Transportation', 'Housing', 'Health', 'Entertainment', 'Utilities'];

type ExpenseFormProps = {
  onSubmit: (payload: ExpensePayload) => Promise<void> | void;
};

const initialState = (): ExpensePayload => ({
  title: '',
  amount: 0,
  category: 'General',
  incurred_on: new Date().toISOString().slice(0, 10),
  notes: '',
});

export default function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpensePayload>(initialState());
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof ExpensePayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialState());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="grid">
        <label>
          <span>Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount || ''}
            onChange={(event) => handleChange('amount', event.target.value)}
            required
          />
        </label>
      </div>
      <div className="grid">
        <label>
          <span>Category</span>
          <select value={form.category} onChange={(event) => handleChange('category', event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Date</span>
          <input
            type="date"
            value={form.incurred_on}
            onChange={(event) => handleChange('incurred_on', event.target.value)}
            required
          />
        </label>
      </div>
      <label>
        <span>Notes</span>
        <textarea
          value={form.notes ?? ''}
          rows={3}
          onChange={(event) => handleChange('notes', event.target.value)}
          placeholder="Optional details"
        />
      </label>
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
}
