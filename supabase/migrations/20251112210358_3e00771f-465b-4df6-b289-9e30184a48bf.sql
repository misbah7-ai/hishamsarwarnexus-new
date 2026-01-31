-- Fix the return type mismatch in search_book_chunks_text
DROP FUNCTION IF EXISTS search_book_chunks_text(TEXT, INT, UUID);
CREATE OR REPLACE FUNCTION search_book_chunks_text(
  query_text TEXT,
  match_count INT DEFAULT 5,
  filter_book_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  book_id UUID,
  content TEXT,
  chunk_index INT,
  book_title TEXT,
  chapter_name TEXT,
  page_number INT,
  similarity DOUBLE PRECISION
)
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bc.id,
    bc.book_id,
    bc.content,
    bc.chunk_index,
    b.title as book_title,
    bc.chapter_name,
    bc.page_number,
    CAST(ts_rank(bc.search_vector, plainto_tsquery('english', query_text)) AS DOUBLE PRECISION) as similarity
  FROM book_chunks bc
  JOIN books b ON bc.book_id = b.id
  WHERE 
    bc.search_vector @@ plainto_tsquery('english', query_text)
    AND (filter_book_id IS NULL OR bc.book_id = filter_book_id)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;