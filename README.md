# Expense Tracker (FastAPI + Next.js)

A full-stack expense tracker with a FastAPI backend (SQLite persistence) and a Next.js frontend. Log purchases, categorize spending, and view summaries such as totals per category and recent expenses.

## Project structure

```
.
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
├── frontend/             # Next.js (App Router) client
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Backend setup

1. Create a virtual environment (optional but recommended)
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API (SQLite database stored in `backend/data/expenses.db`)
   ```bash
   uvicorn app.main:app --reload --app-dir app
   ```
4. Docs available at `http://localhost:8000/docs`.

### Environment
- SQLite database path configured in `backend/app/database.py` (`sqlite:///./data/expenses.db`).
- Update `DATABASE_URL` if you prefer Postgres or another backend.

## Frontend setup

1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Set the API base URL (optional)
   ```bash
   # defaults to http://localhost:8000 if not set
   export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000` to interact with the expense tracker UI.

## API overview

| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| GET    | `/healthz`          | Health probe               |
| GET    | `/expenses`         | List expenses               |
| POST   | `/expenses`         | Create a new expense        |
| GET    | `/expenses/{id}`    | Retrieve a specific expense |
| PUT    | `/expenses/{id}`    | Update expense              |
| DELETE | `/expenses/{id}`    | Remove expense              |
| GET    | `/reports/summary`  | Totals, by-category, recent |

## Notes

- The frontend uses typed API helpers (`frontend/lib/api.ts`) so components stay lean.
- CORS is open (`*`) by default; tighten `allow_origins` in `backend/app/main.py` for production.
- Remember to keep `NEXT_PUBLIC_API_BASE_URL` in sync with wherever FastAPI is hosted.
