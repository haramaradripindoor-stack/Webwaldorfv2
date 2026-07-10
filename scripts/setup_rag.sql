-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the knowledge_chunks table
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb,
  embedding public.vector(1024) -- 1024 dimensions for Cohere embed-multilingual-v3.0
);

-- 3. Create HNSW Index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_hnsw_idx 
ON public.knowledge_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 4. Create the RPC match function
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding public.vector(1024),
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
