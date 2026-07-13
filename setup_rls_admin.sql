DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'homepage_content',
        'noticias',
        'actividades',
        'leads_admision',
        'blog_posts',
        'bot_settings',
        'chat_sessions',
        'chat_leads',
        'checkout_intents',
        'email_campaigns',
        'transactions',
        'profiles',
        'faqs',
        'quick_replies',
        'lead_magnets',
        'recursos',
        'trekan_media'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        -- Check if table exists
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            
            -- Habilitar RLS
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
            
            -- Eliminar política de admin si existe
            EXECUTE format('DROP POLICY IF EXISTS "Permitir todo a admin en %I" ON public.%I;', t, t);
            
            -- Crear política de admin
            EXECUTE format('CREATE POLICY "Permitir todo a admin en %I" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t, t);
            
            -- Para ciertas tablas, añadir lectura pública
            IF t IN ('homepage_content', 'noticias', 'actividades', 'faqs', 'lead_magnets') THEN
                EXECUTE format('DROP POLICY IF EXISTS "Acceso publico lectura %I" ON public.%I;', t, t);
                EXECUTE format('CREATE POLICY "Acceso publico lectura %I" ON public.%I FOR SELECT TO anon USING (true);', t, t);
            END IF;
            
        END IF;
    END LOOP;
END $$;
