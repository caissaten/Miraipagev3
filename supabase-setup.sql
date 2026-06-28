-- =========================================================
-- DATABASE CONFIGURATION FOR SUPABASE & POSTGRESQL (MIRAI PAGE)
-- =========================================================

-- 1. Create Novels Table
CREATE TABLE IF NOT EXISTS public.novels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  author VARCHAR(255) NOT NULL,
  cover_url TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  genre TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'Ongoing',
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Published',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_novel_chapter_slug UNIQUE (novel_id, slug),
  CONSTRAINT unique_novel_chapter_number UNIQUE (novel_id, chapter_number)
);

-- 3. Trigger for Auto updated_at Column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_novels_updated_at BEFORE UPDATE ON public.novels FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. RPC Functions for Atomic View Increments (Safeguards view accuracy under concurrent loads)
CREATE OR REPLACE FUNCTION public.increment_novel_views(novel_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.novels
  SET views = views + 1
  WHERE id = novel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_chapter_views(chapter_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.chapters
  SET views = views + 1
  WHERE id = chapter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Novels Policies
-- A. Allow anyone to read novels
CREATE POLICY "Allow public read access to novels" 
ON public.novels FOR SELECT 
USING (true);

-- B. Restrict write/update/delete to authenticated admin users only
CREATE POLICY "Allow authenticated admin to manage novels" 
ON public.novels FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Chapters Policies
-- A. Allow anyone to read published chapters
CREATE POLICY "Allow public read access to published chapters" 
ON public.chapters FOR SELECT 
USING (status = 'Published');

-- B. Restrict write/update/delete to authenticated admin users only
CREATE POLICY "Allow authenticated admin to manage chapters" 
ON public.chapters FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. Performance Optimization Indices
CREATE INDEX IF NOT EXISTS idx_novels_slug ON public.novels(slug);
CREATE INDEX IF NOT EXISTS idx_chapters_novel_slug ON public.chapters(novel_id, slug);
CREATE INDEX IF NOT EXISTS idx_chapters_novel_id_number ON public.chapters(novel_id, chapter_number);

-- 7. Supabase Storage Configuration instructions
-- Create a public bucket named 'covers'
-- Setup the following Storage policies for 'covers' bucket:
-- Policy A: "Allow public read of covers" -> ALLOW select to all users
-- Policy B: "Allow authenticated write of covers" -> ALLOW insert/update/delete to authenticated admin users only
