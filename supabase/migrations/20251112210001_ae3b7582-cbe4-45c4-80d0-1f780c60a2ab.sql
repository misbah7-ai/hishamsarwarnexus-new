-- Fix the old search_book_chunks function
DROP FUNCTION IF EXISTS search_book_chunks(vector, double precision, integer, uuid);
CREATE OR REPLACE FUNCTION search_book_chunks(
  query_embedding vector,
  match_threshold double precision DEFAULT 0.7,
  match_count integer DEFAULT 5,
  filter_book_id uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  book_id uuid,
  book_title text,
  content text,
  page_number integer,
  chapter_name text,
  similarity double precision
)
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    bc.id,
    bc.book_id,
    b.title as book_title,
    bc.content,
    bc.page_number,
    bc.chapter_name,
    1 - (bc.embedding <=> query_embedding) as similarity
  FROM book_chunks bc
  JOIN books b ON b.id = bc.book_id
  WHERE 
    (filter_book_id IS NULL OR bc.book_id = filter_book_id)
    AND (1 - (bc.embedding <=> query_embedding)) > match_threshold
  ORDER BY bc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;