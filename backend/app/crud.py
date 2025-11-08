from datetime import date, timedelta
from typing import Dict, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas


def list_expenses(db: Session, skip: int = 0, limit: int = 100) -> List[models.Expense]:
    return (
        db.query(models.Expense)
        .order_by(models.Expense.incurred_on.desc(), models.Expense.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_expense(db: Session, expense_id: int) -> Optional[models.Expense]:
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def create_expense(db: Session, expense: schemas.ExpenseCreate) -> models.Expense:
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_expense(
    db: Session, expense_db: models.Expense, expense_update: schemas.ExpenseUpdate
) -> models.Expense:
    update_data = expense_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense_db, key, value)
    db.add(expense_db)
    db.commit()
    db.refresh(expense_db)
    return expense_db


def delete_expense(db: Session, expense_db: models.Expense) -> None:
    db.delete(expense_db)
    db.commit()


def summary(db: Session) -> schemas.SummaryRead:
    total_spent = db.query(func.coalesce(func.sum(models.Expense.amount), 0.0)).scalar() or 0.0

    totals_by_category_rows = (
        db.query(models.Expense.category, func.coalesce(func.sum(models.Expense.amount), 0.0))
        .group_by(models.Expense.category)
        .all()
    )
    totals_by_category: Dict[str, float] = {
        category: amount for category, amount in totals_by_category_rows
    }

    recent_expenses = (
        db.query(models.Expense)
        .order_by(models.Expense.incurred_on.desc(), models.Expense.id.desc())
        .limit(5)
        .all()
    )

    return schemas.SummaryRead(
        total_spent=total_spent,
        totals_by_category=totals_by_category,
        recent_expenses=recent_expenses,
    )
