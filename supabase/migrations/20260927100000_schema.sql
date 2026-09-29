-- OrangeTemple schema (docs/DATABASE-SCHEMA.md, D-043). Ported from the Prisma schema:
-- the same entities, relations, constraints and indexes, in snake_case. Enum values are
-- unchanged. Long-form text fields are Markdown with raw HTML disabled (D-003).

-- ─── Extensions ────────────────────────────────────────────────────────────────
-- Search (D-014): trigram similarity and accent-insensitive matching. Supabase keeps
-- extensions in the `extensions` schema.
create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- ─── Enums ─────────────────────────────────────────────────────────────────────
create type public.content_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type public.region as enum ('NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST');
create type public.tradition as enum ('SHAIVA', 'VAISHNAVA', 'SHAKTA', 'OTHER');
create type public.image_type as enum ('HERO', 'GALLERY', 'THUMBNAIL', 'OG');
create type public.license_type as enum (
  'OWNED', 'CC0', 'CC_BY', 'CC_BY_SA', 'PUBLIC_DOMAIN', 'LICENSED', 'OTHER'
);
create type public.reference_source_type as enum (
  'OFFICIAL_TEMPLE', 'GOVERNMENT', 'ACADEMIC', 'TRADITIONAL_TEXT', 'NEWS', 'OTHER'
);
create type public.nearby_place_type as enum (
  'TEMPLE', 'SHRINE', 'GHAT', 'NATURAL', 'HERITAGE', 'OTHER'
);

-- ─── updated_at ────────────────────────────────────────────────────────────────
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Reference data ────────────────────────────────────────────────────────────
create table public.states (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  region public.region not null,
  code text, -- ISO 3166-2:IN; set only when verified
  is_union_territory boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Presiding deity, used for filtering and grouping. Asserts no theology; no hierarchy in V1.
create table public.deities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_native text,
  slug text not null unique,
  description text not null,
  tradition public.tradition, -- set only where widely uncontroversial
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Temples ───────────────────────────────────────────────────────────────────
create table public.temples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_native text, -- Devanagari in V1 (D-022); verified values only
  slug text not null unique,
  alternate_names text[] not null default '{}', -- transliterations, older or local names
  short_description text not null,
  overview text not null,
  deity_id uuid not null references public.deities (id) on update cascade on delete restrict,
  state_id uuid not null references public.states (id) on update cascade on delete restrict,
  city text not null,
  district text,
  country text not null default 'India',
  address text,
  latitude double precision, -- verified coordinates only
  longitude double precision,
  coordinates_source text,
  location_note text, -- disputed or alternate site claims (D-019)
  estimated_period text,
  architecture_style text,
  significance text not null,
  history text, -- documented history only
  legend text, -- traditional belief only; the UI labels it as such
  architecture text,
  official_website text, -- verified URL only
  meta_title text,
  meta_description text,
  -- Derived by the seed from name, native name, alternate names, city, district and state
  -- name: lowercased, Latin diacritics removed (D-014, D-031). Never edit by hand.
  search_text text not null,
  status public.content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Coordinates are both set or both empty, and set only with a cited source.
  constraint temples_coordinates_pair_check check ((latitude is null) = (longitude is null)),
  constraint temples_coordinates_source_check
    check (latitude is null or length(trim(coordinates_source)) > 0)
);
create index temples_status_state_id_idx on public.temples (status, state_id);
create index temples_status_deity_id_idx on public.temples (status, deity_id);
create index temples_search_text_idx on public.temples
  using gin (search_text extensions.gin_trgm_ops);

-- Time-sensitive: every value needs a source and a verification date (CONTENT-MODEL.md §6).
create table public.temple_visit_info (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null unique references public.temples (id) on update cascade on delete cascade,
  timings text,
  entry_rules text,
  dress_code text,
  photography_rules text,
  best_time_to_visit text,
  seasonal_access text,
  how_to_reach text,
  nearest_airport text,
  nearest_railway text,
  last_verified_at timestamptz,
  verification_source_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Collections ───────────────────────────────────────────────────────────────
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  subtitle text,
  description text not null,
  introduction text,
  image_public_id text,
  image_url text,
  image_alt text,
  display_order integer not null default 0,
  status public.content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_temples (
  collection_id uuid not null references public.collections (id) on update cascade on delete cascade,
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  display_order integer not null default 0,
  primary key (collection_id, temple_id)
);
create index collection_temples_temple_id_idx on public.collection_temples (temple_id);

create table public.related_collections (
  collection_id uuid not null references public.collections (id) on update cascade on delete cascade,
  related_collection_id uuid not null
    references public.collections (id) on update cascade on delete cascade,
  display_order integer not null default 0,
  primary key (collection_id, related_collection_id)
);

-- ─── Media ─────────────────────────────────────────────────────────────────────
-- A published temple has exactly one HERO image (enforced by the seed).
create table public.temple_images (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  url text not null,
  -- Storage object path; unique so the seed can upsert images idempotently.
  public_id text not null unique,
  image_type public.image_type not null,
  alt_text text not null,
  caption text,
  display_order integer not null default 0,
  width integer not null,
  height integer not null,
  blur_data_url text,
  credit text not null,
  license_type public.license_type not null,
  source_url text,
  is_placeholder boolean not null default false, -- development only; none in production
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index temple_images_temple_id_image_type_display_order_idx
  on public.temple_images (temple_id, image_type, display_order);

-- ─── Festivals, rituals, references, nearby places ─────────────────────────────
create table public.festivals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  -- When it occurs, in words. No fixed Gregorian dates: festivals follow the lunar calendar.
  recurrence_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.temple_festivals (
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  festival_id uuid not null references public.festivals (id) on update cascade on delete cascade,
  description text, -- how it is observed at this temple
  display_order integer not null default 0,
  primary key (temple_id, festival_id)
);

create table public.rituals (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  name text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index rituals_temple_id_idx on public.rituals (temple_id);

create table public.temple_references (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  title text not null,
  url text,
  citation text,
  source_type public.reference_source_type not null,
  accessed_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A reference needs at least one of url or citation.
  constraint temple_references_url_or_citation_check check (url is not null or citation is not null)
);
create index temple_references_temple_id_idx on public.temple_references (temple_id);

create table public.nearby_places (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  name text not null,
  type public.nearby_place_type not null,
  description text,
  latitude double precision,
  longitude double precision,
  url text,
  -- Links internally to another temple page when set.
  related_temple_id uuid references public.temples (id) on update cascade on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index nearby_places_temple_id_idx on public.nearby_places (temple_id);

-- Old slug → current temple; unknown slugs are checked here and 308-redirected (ROUTES.md §4).
create table public.slug_redirects (
  id uuid primary key default gen_random_uuid(),
  old_slug text not null unique,
  temple_id uuid not null references public.temples (id) on update cascade on delete cascade,
  created_at timestamptz not null default now()
);

-- ─── updated_at triggers ───────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array[
    'states', 'deities', 'temples', 'temple_visit_info', 'collections', 'temple_images',
    'festivals', 'rituals', 'temple_references', 'nearby_places'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end;
$$;
