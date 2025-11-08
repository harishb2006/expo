from datetime import date
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    incurred_on: date = Field(default_factory=date.today)


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, min_length=1, max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    incurred_on: Optional[date]


class ExpenseRead(ExpenseBase):
    id: int

    class Config:
        orm_mode = True


class SummaryRead(BaseModel):
    total_spent: float
    totals_by_category: Dict[str, float]
    recent_expenses: List[ExpenseRead]
