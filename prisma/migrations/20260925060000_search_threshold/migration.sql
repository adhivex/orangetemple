-- Directory search word-similarity threshold for `<%` (D-037, D-041). Set on the
-- database rather than per query, so every session has it (including through a
-- transaction-mode pooler such as Neon's) and a search needs no transaction.
-- Calling a pg_trgm function first loads the module, so the setting is validated as
-- the extension's own parameter rather than stored as an unknown placeholder.
DO $$
BEGIN
  PERFORM word_similarity('a', 'a');
  EXECUTE format(
    'ALTER DATABASE %I SET pg_trgm.word_similarity_threshold = 0.5',
    current_database()
  );
END
$$;
