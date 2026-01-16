-- InPost shipments, pickup points cache, and shipment events
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.repairs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  carrier text not null default 'inpost',
  service_code text,
  type text not null check (type in ('locker', 'courier')),
  status text,
  tracking_number text,
  inpost_shipment_id text,
  label_url text,
  label_storage_path text,
  receiver_name text,
  receiver_phone text,
  receiver_email text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  city text,
  country text default 'PL',
  pickup_point_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_order_id_idx on public.shipments(order_id);
create index if not exists shipments_tracking_number_idx on public.shipments(tracking_number);
create index if not exists shipments_inpost_id_idx on public.shipments(inpost_shipment_id);

create table if not exists public.pickup_points (
  point_id text primary key,
  name text,
  address text,
  lat numeric,
  lng numeric,
  type text,
  hours text,
  description text,
  image_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

-- Update trigger for shipments
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'update_shipments_updated_at'
  ) then
    create trigger update_shipments_updated_at
      before update on public.shipments
      for each row execute function public.update_updated_at_column();
  end if;
end $$;

alter table public.shipments enable row level security;
alter table public.pickup_points enable row level security;
alter table public.shipment_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipments'
      and policyname = 'Users can view own shipments'
  ) then
    create policy "Users can view own shipments"
      on public.shipments for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipments'
      and policyname = 'Users can insert own shipments'
  ) then
    create policy "Users can insert own shipments"
      on public.shipments for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipments'
      and policyname = 'Users can update own shipments'
  ) then
    create policy "Users can update own shipments"
      on public.shipments for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'shipment_events'
      and policyname = 'Users can view shipment events'
  ) then
    create policy "Users can view shipment events"
      on public.shipment_events for select
      using (
        exists (
          select 1
          from public.shipments
          where public.shipments.id = shipment_events.shipment_id
            and public.shipments.user_id = auth.uid()
        )
      );
  end if;
end $$;
