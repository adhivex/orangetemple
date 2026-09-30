-- Approved v1 design (docs/design/, D-046).

-- Short card label, e.g. "Somnath" for "Somnath Temple" (D-054). Pages and metadata keep
-- the full name; cards and search fall back to it when this is empty.
alter table public.temples add column short_name text;
alter table public.temples
  add constraint temples_short_name_check check (short_name is null or length(trim(short_name)) > 0);

-- Newsletter sign-ups from the footer form (D-052). The server action inserts with the
-- publishable key, so the secret key stays out of the running app. The public roles may
-- insert an email and its source, nothing else: no reads (addresses stay private), no
-- updates or deletes, and no other columns. The check constraint validates the address.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer',
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_check
    check (email = lower(trim(email)) and length(email) between 3 and 254 and position('@' in email) > 1)
);

alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;
grant insert (email, source) on public.newsletter_subscribers to anon, authenticated;

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (source in ('footer'));
