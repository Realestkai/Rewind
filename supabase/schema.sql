create table if not exists public.users (
  id text primary key,
  username text not null,
  avatar_url text,
  role text not null default 'customer' check (role in ('owner','editor','customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand text not null,
  name text not null,
  price_robux integer,
  price_usd numeric(10,2),
  vehicle_type text not null,
  preview_label text,
  description text not null,
  features jsonb not null default '[]'::jsonb,
  hero_image_url text,
  youtube_url text,
  collage_urls jsonb not null default '[]'::jsonb,
  model_url text,
  published boolean not null default false,
  created_by text references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id),
  product_id uuid references public.products(id),
  request_type text[] not null default '{}',
  details text not null,
  attachment_url text,
  discord_channel_id text,
  status text not null default 'open' check (status in ('open','in_progress','complete','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id),
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 3 and 600),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.commissions enable row level security;
alter table public.reviews enable row level security;
