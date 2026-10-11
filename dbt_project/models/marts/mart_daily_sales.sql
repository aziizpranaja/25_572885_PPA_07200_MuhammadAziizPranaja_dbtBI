{{
    config(
        materialized='incremental',
        unique_key=['order_date', 'category', 'region'],
        incremental_strategy='delete+insert'
    )
}}

select
    order_date,
    category,
    region,
    round(sum(sales), 2) as total_sales,
    sum(quantity) as total_qty,
    count(distinct order_id) as n_orders
from {{ ref('stg_transactions') }}
{% if is_incremental() %}
where order_date >= (select coalesce(max(order_date), date '1900-01-01') from {{ this }})
{% endif %}
group by order_date, category, region
