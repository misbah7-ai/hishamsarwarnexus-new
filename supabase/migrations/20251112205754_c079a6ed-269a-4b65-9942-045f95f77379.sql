-- Add text search capabilities to book_chunks
ALTER TABLE book_chunks ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for text search
CREATE INDEX IF NOT EXISTS book_chunks_search_idx ON book_chunks USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_book_chunks_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS book_chunks_search_vector_update ON book_chunks;
CREATE TRIGGER book_chunks_search_vector_update
  BEFORE INSERT OR UPDATE ON book_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_book_chunks_search_vector();

-- Create text search function (replaces vector search)
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
) AS $$
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
$$ LANGUAGE plpgsql;