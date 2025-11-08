export type ExpensePayload = {
  title: string;
  amount: number;
  category: string;
  notes?: string | null;
  incurred_on: string;
};

export type Expense = ExpensePayload & { id: number };

export type Summary = {
  total_spent: number;
  totals_by_category: Record<string, number>;
  recent_expenses: Expense[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API ${response.status}: ${errorBody || response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getExpenses(): Promise<Expense[]> {
  return request<Expense[]>("/expenses");
}

export function getSummary(): Promise<Summary> {
  return request<Summary>("/reports/summary");
}

export function createExpense(payload: ExpensePayload): Promise<Expense> {
  return request<Expense>("/expenses", {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteExpense(id: number): Promise<void> {
  return request<void>(`/expenses/${id}`, { method: 'DELETE' });
}
