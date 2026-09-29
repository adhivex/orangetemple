-- Temple photographs (D-043): a public Supabase Storage bucket. Anyone can read an
-- image by its public URL; there are no write policies, so only the secret key (the
-- upload script) can add, replace or remove files. Only licensed or owned photographs
-- with credits go here, never AI-generated imagery (CLAUDE.md).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'temple-images',
  'temple-images',
  true,
  20971520, -- 20 MB per original
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;
