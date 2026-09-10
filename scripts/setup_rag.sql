-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the knowledge_chunks table
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb,
  embedding public.vector(768) -- 768 dimensions for Gemini text-embedding-004 / Ollama nomic-embed-text
);

-- 3. Create HNSW Index for fast similarity search
CREATE INDEX ON public.knowledge_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 4. Create the match_documents RPC function
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding public.vector(768),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 5
)
RETURNS TABLE (id uuid, content text, similarity float)
LANGUAGE sql STABLE
AS $$
  SELECT 
    id, 
    content, 
    1 - (embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 5. Setup RLS so only the service role can manage it or public can select
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access"
ON public.knowledge_chunks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public select"
ON public.knowledge_chunks FOR SELECT
TO public
USING (true);
