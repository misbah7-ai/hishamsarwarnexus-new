-- Drop the public access policy on book_chunks
DROP POLICY IF EXISTS "Book chunks are viewable by everyone" ON public.book_chunks;

-- Create authenticated-only access policy for book chunks
CREATE POLICY "Authenticated users can view book chunks"
ON public.book_chunks
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);