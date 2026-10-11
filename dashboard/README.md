# Dashboard Power BI — penjualan FMCG

Tools yang dipakai: **Power BI Desktop**.  
File export Metabase/Superset **tidak diperlukan**.

## File yang dikumpulkan

| File | Peran |
| --- | --- |
| `tugas_dwib.pbix` | file dashboard (setara export Metabase/Superset untuk Power BI) |
| `mart_daily_sales.csv` | sumber data dari model dbt `mart_daily_sales` |

Jangan pakai CSV output Airflow (`sales_daily.csv`).

## Cara membuka

1. Buka Power BI Desktop.
2. File → Open → `tugas_dwib.pbix`.
3. Jika Power BI meminta lokasi CSV, pilih `mart_daily_sales.csv` di folder ini.

## Isi dashboard

Dua halaman (chart tidak diulang):

- **Overview:** KPI; line tren; bar ranking kategori; bar ranking wilayah; slicer tile kategori, dropdown wilayah, rentang tanggal.
- **Breakdown Wilayah:** KPI total penjualan; tabel; stacked 100% komposisi kategori; clustered column nilai kategori × wilayah; slicer tanggal dan kategori.

Elemen wajib: 1 KPI, 2 jenis chart, 1 slicer/filter.
