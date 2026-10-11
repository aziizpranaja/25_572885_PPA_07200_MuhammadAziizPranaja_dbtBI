# Tugas dbt + Dashboard BI — penjualan FMCG

**Nama:** Muhammad Aziiz Pranaja  
**NIM:** `25/572885/PPA/07200`  
**Mata kuliah:** Data Warehouse dan Business Intelligence  
**Opsi data:** A — lanjutan Tugas Airflow ETL Pipeline Sederhana

Lapisan dbt merapikan transformasi di atas data yang sudah di-extract pipeline Airflow, lalu hasil mart dipakai dashboard Power BI.

Pertanyaan bisnis (sama seperti tugas Airflow): **berapa total penjualan, kuantitas, dan jumlah order per hari?**

## Prasyarat

- Python 3.12
- Power BI Desktop (untuk dashboard)
- Repo tugas Airflow sebelumnya hanya dipakai sebagai sumber snapshot CSV (sudah disalin ke `data/raw/transactions.csv`)

## Struktur

```text
25_572885_PPA_07200_MuhammadAziizPranaja_dbtBI/
|-- dbt_project/          # source dbt (staging, marts, tests, profiles)
|-- data/
|   |-- raw/transactions.csv
|   `-- warehouse.duckdb  # schema raw.transactions
|-- dashboard/
|   `-- tugas_dwib.pbix   # file dashboard Power BI
|-- docs/                 # dokumentasi PDF + screenshot
|-- scripts/load_raw_to_duckdb.py
`-- README.md
```

## Setup

Dari root project ini:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\load_raw_to_duckdb.py
```

Jalankan dbt dari folder `dbt_project` agar `profiles.yml` di project terpakai (bukan `~/.dbt`):

```powershell
cd dbt_project
$env:DBT_PROFILES_DIR = (Get-Location).Path
dbt debug
dbt run
dbt test
dbt docs generate
dbt docs serve
```

## Output dbt

| Model | Materialization | Isi |
| --- | --- | --- |
| `stg_transactions` | view | transaksi bersih |
| `mart_daily_sales` | incremental | agregasi per hari, kategori, dan region |

Lineage yang diharapkan:

`raw.transactions` → `stg_transactions` → `mart_daily_sales`

## Dashboard

Tools: **Power BI Desktop** (bukan Metabase/Superset). Karena itu file yang dikumpulkan adalah `.pbix`, bukan export Metabase/Superset.

| Artefak | Lokasi |
| --- | --- |
| File dashboard | [`dashboard/tugas_dwib.pbix`](dashboard/tugas_dwib.pbix) |
| Sumber data mart | [`dashboard/mart_daily_sales.csv`](dashboard/mart_daily_sales.csv) |
| Screenshot Overview | [`docs/screenshots/08_dashboard_overview.jpeg`](docs/screenshots/08_dashboard_overview.jpeg) |
| Screenshot Breakdown Wilayah | [`docs/screenshots/09_dashboard_wilayah.jpeg`](docs/screenshots/09_dashboard_wilayah.jpeg) |

Cara membuka:

1. Install [Power BI Desktop](https://www.microsoft.com/store/productId/9NTXR16HNW1T) (Windows, gratis).
2. Double-click `dashboard/tugas_dwib.pbix`, atau File → Open di Power BI.
3. Jika diminta sumber data, arahkan ke `dashboard/mart_daily_sales.csv`.

Halaman: `Overview` (KPI, tren, kategori, wilayah) dan `Breakdown Wilayah` (ranking negara + komposisi kategori).

Rincian elemen ada di [`dashboard/README.md`](dashboard/README.md).
