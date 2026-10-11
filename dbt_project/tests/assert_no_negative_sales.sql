-- Custom singular test: staging tidak boleh menyisakan penjualan negatif.
-- Masalah ini ada di raw (62 baris) dan harus sudah dibuang di stg_transactions.

select
    order_id,
    order_date,
    sales
from {{ ref('stg_transactions') }}
where sales < 0
