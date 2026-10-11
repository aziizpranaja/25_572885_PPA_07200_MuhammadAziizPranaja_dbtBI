with source as (
    select * from {{ source('raw', 'transactions') }}
),

typed as (
    select
        trim(cast(order_id as varchar)) as order_id,
        try_cast(order_date as date) as order_date,
        concat(
            upper(left(trim(cast(product as varchar)), 1)),
            lower(substr(trim(cast(product as varchar)), 2))
        ) as product,
        concat(
            upper(left(trim(cast(category as varchar)), 1)),
            lower(substr(trim(cast(category as varchar)), 2))
        ) as category,
        coalesce(try_cast(quantity as double), 0) as quantity,
        try_cast(sales as double) as sales,
        case
            when upper(trim(cast(region as varchar))) in ('USA', 'US', 'UNITED STATES')
                then 'United States'
            when lower(trim(cast(region as varchar))) in ('uk', 'united kingdom')
                then 'United Kingdom'
            else concat(
                upper(left(trim(cast(region as varchar)), 1)),
                lower(substr(trim(cast(region as varchar)), 2))
            )
        end as region
    from source
),

cleaned as (
    select *
    from typed
    where order_id is not null
      and order_id <> ''
      and order_date is not null
      and sales is not null
      and quantity >= 0
      and sales >= 0
)

select * from cleaned
