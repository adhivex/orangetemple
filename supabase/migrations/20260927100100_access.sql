-- Access rules (D-043). The site reads with the publishable key (role `anon`) on the
-- server; Row Level Security lets it read published content and nothing else, so
-- "only published content reaches public pages" (ARCHITECTURE.md §4) holds in the
-- database, not only in queries. There are no write policies: only the secret key
-- (role `service_role`, used by the seed and upload scripts) bypasses RLS and writes.
--
-- Every table added later must enable RLS and grant only what it needs.

-- Read-only for the public roles, whatever the schema's default privileges say.
revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to anon, authenticated;

-- A trigger helper, not an API.
revoke execute on function public.set_updated_at() from public, anon, authenticated;

alter table public.states enable row level security;
alter table public.deities enable row level security;
alter table public.temples enable row level security;
alter table public.temple_visit_info enable row level security;
alter table public.collections enable row level security;
alter table public.collection_temples enable row level security;
alter table public.related_collections enable row level security;
alter table public.temple_images enable row level security;
alter table public.festivals enable row level security;
alter table public.temple_festivals enable row level security;
alter table public.rituals enable row level security;
alter table public.temple_references enable row level security;
alter table public.nearby_places enable row level security;
alter table public.slug_redirects enable row level security;

-- Reference data: readable in full.
create policy "Reference data is public" on public.states
  for select to anon, authenticated using (true);
create policy "Reference data is public" on public.deities
  for select to anon, authenticated using (true);
create policy "Reference data is public" on public.festivals
  for select to anon, authenticated using (true);

-- Published temples and collections only.
create policy "Published temples are public" on public.temples
  for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Published collections are public" on public.collections
  for select to anon, authenticated using (status = 'PUBLISHED');

-- Temple children: visible when their temple is. The subquery runs under the same
-- policies, so it sees published temples only.
create policy "Visible with a published temple" on public.temple_visit_info
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.temple_images
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.temple_festivals
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.rituals
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.temple_references
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.nearby_places
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));
create policy "Visible with a published temple" on public.slug_redirects
  for select to anon, authenticated
  using (exists (select 1 from public.temples t where t.id = temple_id));

-- Memberships and related collections: both ends must be published.
create policy "Visible when both ends are published" on public.collection_temples
  for select to anon, authenticated
  using (
    exists (select 1 from public.collections c where c.id = collection_id)
    and exists (select 1 from public.temples t where t.id = temple_id)
  );
create policy "Visible when both ends are published" on public.related_collections
  for select to anon, authenticated
  using (
    exists (select 1 from public.collections c where c.id = collection_id)
    and exists (select 1 from public.collections c where c.id = related_collection_id)
  );
