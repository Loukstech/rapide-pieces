alter table public.offers
  add column seller_name text not null default '',
  add column seller_badge text not null default 'New Seller',
  add column seller_score numeric not null default 0;

alter table public.orders
  add column seller_name text not null default '';
