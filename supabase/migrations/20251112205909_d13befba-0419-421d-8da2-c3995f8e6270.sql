-- Drop trigger first, then function, then recreate with proper search_path
DROP TRIGGER IF EXISTS book_chunks_search_vector_update ON book_chunks;
DROP FUNCTION IF EXISTS update_book_chunks_search_vector();

CREATE OR REPLACE FUNCTION update_book_chunks_search_vector()
RETURNS TRIGGER 
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER book_chunks_search_vector_update
  BEFORE INSERT OR UPDATE ON book_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_book_chunks_search_vector();

-- Recreate the search function with proper search_path
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
  similarity FLOAT
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
    ts_rank(bc.search_vector, plainto_tsquery('english', query_text)) as similarity
  FROM book_chunks bc
  JOIN books b ON bc.book_id = b.id
  WHERE 
    bc.search_vector @@ plainto_tsquery('english', query_text)
    AND (filter_book_id IS NULL OR bc.book_id = filter_book_id)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;