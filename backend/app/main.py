from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


@app.get("/expenses", response_model=List[schemas.ExpenseRead])
def get_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_expenses(db, skip=skip, limit=limit)


@app.post(
    "/expenses",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.ExpenseRead,
)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)


@app.get("/expenses/{expense_id}", response_model=schemas.ExpenseRead)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense_db = crud.get_expense(db, expense_id)
    if not expense_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense_db


@app.put("/expenses/{expense_id}", response_model=schemas.ExpenseRead)
def update_expense(expense_id: int, expense: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    expense_db = crud.get_expense(db, expense_id)
    if not expense_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return crud.update_expense(db, expense_db, expense)


@app.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense_db = crud.get_expense(db, expense_id)
    if not expense_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    crud.delete_expense(db, expense_db)
    return None


@app.get("/reports/summary", response_model=schemas.SummaryRead)
def get_summary(db: Session = Depends(get_db)):
    return crud.summary(db)
