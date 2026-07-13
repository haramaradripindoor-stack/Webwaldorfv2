-- Habilitar la extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crear tabla bot_settings
CREATE TABLE IF NOT EXISTS public.bot_settings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    bot_name text,
    phone_number_id text,
    master_prompt text,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Crear tabla faqs
CREATE TABLE IF NOT EXISTS public.faqs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Crear tabla quick_replies
CREATE TABLE IF NOT EXISTS public.quick_replies (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    shortcut text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Crear tabla lead_magnets
CREATE TABLE IF NOT EXISTS public.lead_magnets (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    description text,
    benefits jsonb,
    pdf_url text,
    created_at timestamp with time zone DEFAULT now()
);

-- 5. Crear tabla blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    excerpt text,
    content text,
    image_url text,
    author text,
    status text DEFAULT 'draft',
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en todas las tablas nuevas
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Crear políticas de Admin (Todo permitido para usuarios autenticados)
DROP POLICY IF EXISTS "Permitir todo a admin" ON public.bot_settings;
CREATE POLICY "Permitir todo a admin" ON public.bot_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a admin" ON public.faqs;
CREATE POLICY "Permitir todo a admin" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a admin" ON public.quick_replies;
CREATE POLICY "Permitir todo a admin" ON public.quick_replies FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a admin" ON public.lead_magnets;
CREATE POLICY "Permitir todo a admin" ON public.lead_magnets FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo a admin" ON public.blog_posts;
CREATE POLICY "Permitir todo a admin" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Crear políticas Públicas de Lectura (Permitido para visitantes sin sesión)
DROP POLICY IF EXISTS "Acceso publico lectura" ON public.faqs;
CREATE POLICY "Acceso publico lectura" ON public.faqs FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Acceso publico lectura" ON public.lead_magnets;
CREATE POLICY "Acceso publico lectura" ON public.lead_magnets FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Acceso publico lectura" ON public.blog_posts;
CREATE POLICY "Acceso publico lectura" ON public.blog_posts FOR SELECT TO anon USING (status = 'published');
