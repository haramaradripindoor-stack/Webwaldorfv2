-- 1. Create tables for Noticias and Actividades
CREATE TABLE IF NOT EXISTS public.noticias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  image_url text,
  published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.actividades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  image_url text,
  mes text,
  dia text,
  tipo text,
  lugar text,
  hora text,
  published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Noticias
CREATE POLICY "Allow public read access to noticias"
ON public.noticias FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admin) to modify Noticias
CREATE POLICY "Allow authenticated full access to noticias"
ON public.noticias FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public read access to Actividades
CREATE POLICY "Allow public read access to actividades"
ON public.actividades FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admin) to modify Actividades
CREATE POLICY "Allow authenticated full access to actividades"
ON public.actividades FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Create Storage Bucket for CMS Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trekan_media', 'trekan_media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
-- Public read
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'trekan_media' );

-- Authenticated write
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'trekan_media' );

CREATE POLICY "Authenticated Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'trekan_media' );

CREATE POLICY "Authenticated Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'trekan_media' );
