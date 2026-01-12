from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# NeonDB requires the 'postgresql' driver prefix, usually standard 'postgresql://' works with asyncpg or psycopg2
# But for SQLModel (synchronous by default unless using AsyncEngine), we use standard engine first.
# If connecting securely to Neon, sslmode=require is often needed.
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
