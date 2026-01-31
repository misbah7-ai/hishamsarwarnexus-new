-- Create table for storing generated study materials
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL CHECK (material_type IN ('quiz', 'flashcard', 'mindmap', 'summary', 'study_guide', 'audio_script')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_study_materials_book_id ON public.study_materials(book_id);
CREATE INDEX idx_study_materials_type ON public.study_materials(material_type);

-- Enable RLS
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies - anyone can view study materials
CREATE POLICY "Study materials are viewable by everyone"
ON public.study_materials
FOR SELECT
USING (true);

-- Only authenticated users can create study materials
CREATE POLICY "Authenticated users can create study materials"
ON public.study_materials
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_study_materials_timestamp
BEFORE UPDATE ON public.study_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_reading_progress_timestamp();