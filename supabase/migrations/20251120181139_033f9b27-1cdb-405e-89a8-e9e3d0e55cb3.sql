-- Allow public access to view book chunks (since books are already public)
DROP POLICY IF EXISTS "Authenticated users can view book chunks" ON book_chunks;

CREATE POLICY "Book chunks are viewable by everyone"
ON book_chunks
FOR SELECT
USING (true);

-- Keep the insert and delete policies for authenticated users only
-- (existing policies remain unchanged)