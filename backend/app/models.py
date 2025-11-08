from datetime import date

from sqlalchemy import Column, Date, Float, Integer, String

from .database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False, default="General")
    notes = Column(String(500), nullable=True)
    incurred_on = Column(Date, nullable=False, default=date.today)
