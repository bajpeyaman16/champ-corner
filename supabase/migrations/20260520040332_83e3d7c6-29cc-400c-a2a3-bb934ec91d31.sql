-- Create public bucket for event banner images
insert into storage.buckets (id, name, public)
values ('event-banners', 'event-banners', true)
on conflict (id) do nothing;

-- Public read for banners
create policy "Event banners public read"
on storage.objects for select
using (bucket_id = 'event-banners');

-- Authenticated users can upload to their own folder
create policy "Event banners user upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-banners'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Event banners user update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'event-banners'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Event banners user delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-banners'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable realtime on events so all clients see new published events instantly
alter publication supabase_realtime add table public.events;