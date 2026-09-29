-- Directory search (PRD §6, D-014, D-037, D-043), called over RPC. One round trip
-- returns the matching temple ids for the requested page, the total, and the page
-- number clamped to the last page.
--
-- Matching: a substring match catches short queries; `<%` (word similarity) catches
-- typos and transliteration variants. Ranking: names that start with the query first,
-- then by word similarity, then alphabetically. Without a query, alphabetical.
--
-- The word-similarity threshold is 0.5 rather than pg_trgm's 0.6 default: v/w variants
-- such as "Rameswaram" and "Ramesvaram" score 0.54–0.57 against the right temple, while
-- the best wrong match scored 0.20. It is set on the function, so it applies to exactly
-- these queries and needs no transaction (replaces D-041). The GIN trigram index on
-- search_text still serves `<%`.
--
-- SECURITY INVOKER: Row Level Security applies, so only published temples and
-- collections can match. The status checks below repeat that for clarity.
-- `search_query` arrives already normalised by the app (normalizeForSearch).

-- Load pg_trgm in this session so its threshold setting is known when the function is
-- created below.
select extensions.word_similarity('a', 'a');

create function public.search_temples(
  search_query text default null,
  deity_slug text default null,
  state_slug text default null,
  region_code public.region default null,
  collection_slug text default null,
  page_number integer default 1,
  page_size integer default 24
)
returns jsonb
language sql
stable
security invoker
set search_path = public, extensions
set pg_trgm.word_similarity_threshold = 0.5
as $$
  with matches as (
    select
      t.id,
      t.name,
      coalesce(lower(unaccent(t.name)) like search_query || '%', false) as starts_with,
      coalesce(word_similarity(lower(unaccent(search_query)), t.search_text), 0) as score
    from temples t
    join states s on s.id = t.state_id
    join deities d on d.id = t.deity_id
    where t.status = 'PUBLISHED'
      and (deity_slug is null or d.slug = deity_slug)
      and (state_slug is null or s.slug = state_slug)
      and (region_code is null or s.region = region_code)
      and (
        collection_slug is null
        or exists (
          select 1
          from collection_temples ct
          join collections c on c.id = ct.collection_id
          where ct.temple_id = t.id and c.slug = collection_slug and c.status = 'PUBLISHED'
        )
      )
      and (
        search_query is null
        or t.search_text like '%' || search_query || '%'
        or lower(unaccent(search_query)) <% t.search_text
      )
  ),
  paging as (
    select
      count(*)::integer as total,
      greatest(1, least(page_number, ceil(count(*)::numeric / page_size)::integer)) as page
    from matches
  )
  select jsonb_build_object(
    'total', paging.total,
    'page', paging.page,
    'ids', coalesce(
      (
        select jsonb_agg(m.id order by m.starts_with desc, m.score desc, m.name)
        from (
          select * from matches
          order by starts_with desc, score desc, name
          limit page_size offset (paging.page - 1) * page_size
        ) m
      ),
      '[]'::jsonb
    )
  )
  from paging;
$$;

revoke execute on function public.search_temples from public;
grant execute on function public.search_temples to anon, authenticated, service_role;
