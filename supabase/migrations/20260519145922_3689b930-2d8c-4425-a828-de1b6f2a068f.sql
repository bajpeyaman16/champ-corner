
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  dob date,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insert by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles update by owner" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, phone, dob, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    nullif(new.raw_user_meta_data->>'dob','')::date,
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- events (text id so seeded mock + uuid-organized coexist)
create table public.events (
  id text primary key,
  name text not null,
  sport text,
  category text,
  organizer text,
  venue text,
  city text,
  date text,
  prize_pool text,
  entry_fee text,
  slots text,
  format text,
  team_size text,
  rating numeric default 4.0,
  banner text,
  rules jsonb default '[]'::jsonb,
  type text default 'Outdoor',
  description text,
  created_by uuid references auth.users(id) on delete set null,
  status text not null default 'published',
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "Events public read" on public.events for select using (true);
create policy "Events insert by authenticated" on public.events for insert with check (auth.uid() = created_by);
create policy "Events update by owner" on public.events for update using (auth.uid() = created_by);
create policy "Events delete by owner" on public.events for delete using (auth.uid() = created_by);

-- registrations
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  team_name text,
  captain text,
  txn_id text,
  paid_at timestamptz not null default now()
);
alter table public.registrations enable row level security;
create policy "Registrations owner select" on public.registrations for select using (auth.uid() = user_id);
create policy "Registrations owner insert" on public.registrations for insert with check (auth.uid() = user_id);
create policy "Registrations owner delete" on public.registrations for delete using (auth.uid() = user_id);

-- saved events
create table public.saved_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
alter table public.saved_events enable row level security;
create policy "Saved owner select" on public.saved_events for select using (auth.uid() = user_id);
create policy "Saved owner insert" on public.saved_events for insert with check (auth.uid() = user_id);
create policy "Saved owner delete" on public.saved_events for delete using (auth.uid() = user_id);

-- notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "Notifications owner select" on public.notifications for select using (auth.uid() = user_id);
create policy "Notifications owner insert" on public.notifications for insert with check (auth.uid() = user_id);
create policy "Notifications owner update" on public.notifications for update using (auth.uid() = user_id);
create policy "Notifications owner delete" on public.notifications for delete using (auth.uid() = user_id);
