
-- Migration: 20251109172928
-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT DEFAULT 'Hisham Sarwar',
  description TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book_chunks table for storing text chunks with embeddings
CREATE TABLE public.book_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  page_number INTEGER,
  chapter_name TEXT,
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX book_chunks_embedding_idx ON public.book_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for book lookup
CREATE INDEX book_chunks_book_id_idx ON public.book_chunks(book_id);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chunks ENABLE ROW LEVEL SECURITY;

-- Books policies - anyone can read, only authenticated users can manage
CREATE POLICY "Books are viewable by everyone"
ON public.books FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert books"
ON public.books FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update books"
ON public.books FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete books"
ON public.books FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Book chunks policies - anyone can read
CREATE POLICY "Book chunks are viewable by everyone"
ON public.book_chunks FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert book chunks"
ON public.book_chunks FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete book chunks"
ON public.book_chunks FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Function to search book chunks by similarity
CREATE OR REPLACE FUNCTION search_book_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_book_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  book_id uuid,
  book_title text,
  content text,
  page_number integer,
  chapter_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
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

-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public)
VALUES ('books', 'books', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for books bucket
CREATE POLICY "Anyone can view books"
ON storage.objects FOR SELECT
USING (bucket_id = 'books');

CREATE POLICY "Authenticated users can upload books"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'books' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete books"
ON storage.objects FOR DELETE
USING (bucket_id = 'books' AND auth.uid() IS NOT NULL);
