/**
 * Utility to generate 768-dimensional embeddings using Gemini API (cloud, 768-dim)
 * or local Ollama (nomic-embed-text, 768-dim) as a zero-cost fallback.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
const GEMINI_EMBED_MODEL = 'text-embedding-004';

export type EmbeddingTaskType =
  | 'RETRIEVAL_DOCUMENT'
  | 'RETRIEVAL_QUERY'
  | 'SEMANTIC_SIMILARITY'
  | 'CLASSIFICATION'
  | 'CLUSTERING';

/**
 * Generate embedding for a single text chunk or query (768-dim)
 */
export async function getEmbedding(
  text: string,
  taskType: EmbeddingTaskType = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Try Gemini API (Cloud Free Tier)
  if (geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBED_MODEL}:embedContent?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${GEMINI_EMBED_MODEL}`,
          content: {
            parts: [{ text }]
          },
          taskType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embedding?.values) {
          const values = data.embedding.values;
          if (Array.isArray(values) && values.length === 768) {
            return values;
          }
        }
      } else {
        const errText = await response.text();
        console.warn(`[Embeddings] Gemini API failed with status ${response.status}: ${errText}. Falling back to Ollama.`);
      }
    } catch (error) {
      console.warn('[Embeddings] Gemini API error, falling back to Ollama:', error);
    }
  }

  // 2. Try Local Ollama (Zero-Cost Fallback)
  try {
    // Attempt using Ollama's newer /api/embed endpoint
    try {
      const response = await fetch(`${OLLAMA_URL}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          input: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embeddings && data.embeddings[0]) {
          const values = data.embeddings[0];
          if (Array.isArray(values) && values.length === 768) {
            return values;
          }
        }
      }
    } catch (err) {
      console.warn('[Embeddings] Ollama /api/embed failed, trying /api/embeddings:', err);
    }

    // Try legacy /api/embeddings endpoint if /api/embed failed or threw error
    const legacyResponse = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: text
      })
    });

    if (legacyResponse.ok) {
      const data = await legacyResponse.json();
      if (data.embedding) {
        const values = data.embedding;
        if (Array.isArray(values) && values.length === 768) {
          return values;
        }
      }
    }

    throw new Error(`Ollama endpoints returned invalid status (/api/embeddings: ${legacyResponse.status})`);
  } catch (error) {
    console.error('[Embeddings] Local Ollama also failed:', error);
    throw new Error('Both Gemini API and Local Ollama embeddings generation failed.');
  }
}

/**
 * Alias for getEmbedding to support different naming conventions.
 */
export async function generateEmbedding(
  text: string,
  taskType: EmbeddingTaskType = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  return getEmbedding(text, taskType);
}

/**
 * Generate embeddings for multiple text chunks in batch (768-dim)
 */
export async function getEmbeddings(
  texts: string[],
  taskType: EmbeddingTaskType = 'RETRIEVAL_DOCUMENT'
): Promise<number[][]> {
  if (texts.length === 0) return [];
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Try Gemini API (Cloud Free Tier)
  if (geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBED_MODEL}:batchEmbedContents?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: texts.map(text => ({
            model: `models/${GEMINI_EMBED_MODEL}`,
            content: {
              parts: [{ text }]
            },
            taskType
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embeddings && Array.isArray(data.embeddings)) {
          const result = data.embeddings.map((emb: any) => emb.values);
          if (result.every((values: any) => Array.isArray(values) && values.length === 768)) {
            return result;
          }
        }
      } else {
        const errText = await response.text();
        console.warn(`[Embeddings] Gemini Batch API failed with status ${response.status}: ${errText}. Falling back to Ollama.`);
      }
    } catch (error) {
      console.warn('[Embeddings] Gemini Batch API error, falling back to Ollama:', error);
    }
  }

  // 2. Try Local Ollama (Zero-Cost Fallback)
  try {
    // Attempt using Ollama's newer /api/embed endpoint which handles arrays
    try {
      const response = await fetch(`${OLLAMA_URL}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          input: texts
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.embeddings && Array.isArray(data.embeddings)) {
          const result = data.embeddings;
          if (result.every((values: any) => Array.isArray(values) && values.length === 768)) {
            return result;
          }
        }
      }
    } catch (err) {
      console.warn('[Embeddings] Ollama batch /api/embed failed, trying sequential:', err);
    }

    console.warn(`[Embeddings] Falling back to sequential legacy embeddings.`);

    // Fallback to calling legacy /api/embeddings sequentially with chunking/throttling
    const results: number[][] = [];
    const chunkSize = 5; // Process in chunks of 5 to avoid overloading Ollama
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (text) => {
        const legacyRes = await fetch(`${OLLAMA_URL}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: text
          })
        });

        if (!legacyRes.ok) {
          throw new Error(`Legacy embeddings endpoint failed for text chunk: ${legacyRes.statusText}`);
        }

        const data = await legacyRes.json();
        if (!data.embedding || !Array.isArray(data.embedding) || data.embedding.length !== 768) {
          throw new Error('Ollama legacy endpoint returned invalid vector dimension');
        }
        return data.embedding as number[];
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }
    return results;
  } catch (error) {
    console.error('[Embeddings] Local Ollama batch failed:', error);
    throw new Error('Both Gemini API and Local Ollama batch embeddings generation failed.');
  }
}
