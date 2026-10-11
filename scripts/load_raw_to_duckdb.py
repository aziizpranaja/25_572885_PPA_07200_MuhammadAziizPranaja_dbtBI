"""Load CSV hasil extract Airflow ke DuckDB schema raw."""

from __future__ import annotations

from pathlib import Path

import duckdb
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "raw" / "transactions.csv"
DUCKDB_PATH = ROOT / "data" / "warehouse.duckdb"


def main() -> None:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV sumber tidak ditemukan: {CSV_PATH}")

    df = pd.read_csv(CSV_PATH)
    if len(df) < 200:
        raise ValueError(f"Dataset terlalu kecil: {len(df)} baris (minimal 200).")
    if "order_date" not in df.columns:
        raise ValueError("Kolom tanggal (order_date) wajib ada.")

    DUCKDB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(DUCKDB_PATH))
    try:
        con.execute("CREATE SCHEMA IF NOT EXISTS raw")
        con.execute("DROP TABLE IF EXISTS raw.transactions")
        con.execute(
            f"""
            CREATE TABLE raw.transactions AS
            SELECT * FROM read_csv_auto('{CSV_PATH.as_posix()}', header=true)
            """
        )
        n_rows = con.execute("SELECT COUNT(*) FROM raw.transactions").fetchone()[0]
        cols = [row[0] for row in con.execute("DESCRIBE raw.transactions").fetchall()]
    finally:
        con.close()

    print(f"[LOAD] duckdb={DUCKDB_PATH}")
    print(f"[LOAD] table=raw.transactions | rows={n_rows} | cols={cols}")
    print(
        "[LOAD] nulls | "
        f"order_date={int(df['order_date'].isna().sum())} | "
        f"quantity={int(df['quantity'].isna().sum())} | "
        f"sales={int(df['sales'].isna().sum())}"
    )


if __name__ == "__main__":
    main()
