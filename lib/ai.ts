import { AIResponse, ChatMessage as BaseChatMessage } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  imageBase64?: string;
}

function stripComments(jsonStr: string): string {
  let out = '';
  let inString = false;
  let stringChar = '';
  let i = 0;
  while (i < jsonStr.length) {
    const char = jsonStr[i];
    const next = jsonStr[i + 1];
    
    if (inString) {
      if (char === '\\') {
        out += char + (next || '');
        i += 2;
        continue;
      }
      if (char === stringChar) {
        inString = false;
      }
      out += char;
      i++;
    } else {
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        out += char;
        i++;
      } else if (char === '/' && next === '/') {
        i += 2;
        while (i < jsonStr.length && jsonStr[i] !== '\n') {
          i++;
        }
      } else if (char === '/' && next === '*') {
        i += 2;
        while (i < jsonStr.length) {
          if (jsonStr[i] === '*' && jsonStr[i + 1] === '/') {
            i += 2;
            break;
          }
          i++;
        }
      } else if (char === '#') {
        i++;
        while (i < jsonStr.length && jsonStr[i] !== '\n') {
          i++;
        }
      } else {
        out += char;
        i++;
      }
    }
  }
  return out;
}

export function cleanJsonResponse(content: string): any {
  if (!content) {
    throw new Error('Empty response content');
  }

  // Normalize newlines and trim
  let cleaned = content.replace(/\r\n/g, '\n').trim();

  // 1. Try direct parse first (fast path)
  try {
    return JSON.parse(cleaned);
  } catch (directError) {
    // Try cleaning smart quotes and try parsing again
    try {
      const normalizedQuotes = cleaned.replace(/[“”]/g, '"');
      return JSON.parse(normalizedQuotes);
    } catch (quoteErr) {
      // Proceed to deeper cleaning
    }
  }

  // 2. Extract balanced brace/bracket candidates.
  // This is extremely robust against leading/trailing text and markdown wraps.
  const candidates: string[] = [];
  const stack: { char: string; index: number }[] = [];
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const next = cleaned[i + 1];

    if (inString) {
      if (char === '\\') {
        i++; // skip next char
        continue;
      }
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '“' || char === '”') {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === '{' || char === '[') {
      stack.push({ char, index: i });
    } else if (char === '}' || char === ']') {
      const expectedOpen = char === '}' ? '{' : '[';
      let matchIdx = -1;
      for (let j = stack.length - 1; j >= 0; j--) {
        if (stack[j].char === expectedOpen) {
          matchIdx = j;
          break;
        }
      }

      if (matchIdx !== -1) {
        const openToken = stack[matchIdx];
        candidates.push(cleaned.substring(openToken.index, i + 1));
        stack.splice(matchIdx); // remove opener and any unbalanced inner tokens
      }
    }
  }

  // Also extract contents of any ``` code blocks as separate candidates
  const codeBlockRegex = /```(?:json|JSON|markdown|text|txt)?\s*([\s\S]*?)\s*```/gi;
  let match;
  codeBlockRegex.lastIndex = 0;
  while ((match = codeBlockRegex.exec(cleaned)) !== null) {
    candidates.push(match[1].trim());
  }

  // Add the cleaned original string itself as a fallback candidate
  candidates.push(cleaned);

  // Remove duplicates and empty candidates
  const uniqueCandidates = Array.from(new Set(candidates.map(c => c.trim()))).filter(Boolean);

  // Sort candidates:
  // We want to prioritize:
  // - Candidates that start with { or [
  // - Candidates that are longer (to parse the largest outer JSON structure first)
  uniqueCandidates.sort((a, b) => {
    const aIsJson = a.startsWith('{') || a.startsWith('[');
    const bIsJson = b.startsWith('{') || b.startsWith('[');
    if (aIsJson && !bIsJson) return -1;
    if (!aIsJson && bIsJson) return 1;
    return b.length - a.length;
  });

  const errors: string[] = [];

  for (const candidate of uniqueCandidates) {
    let cleanedCand = candidate;
    
    // Normalize smart quotes
    cleanedCand = cleanedCand.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'");

    let rebuilt = '';
    let candInString = false;
    let candStringChar = '';
    let i = 0;
    
    while (i < cleanedCand.length) {
      const char = cleanedCand[i];
      const next = cleanedCand[i + 1];

      if (candInString) {
        if (char === '\\') {
          rebuilt += char + (next || '');
          i += 2;
          continue;
        }
        if (char === candStringChar) {
          candInString = false;
          rebuilt += '"'; // normalize string closing quote to standard double quote
          i++;
          continue;
        }
        // Handle unescaped control characters inside string
        if (char === '\n') {
          rebuilt += '\\n';
        } else if (char === '\r') {
          rebuilt += '\\r';
        } else if (char === '\t') {
          rebuilt += '\\t';
        } else {
          rebuilt += char;
        }
        i++;
      } else {
        // Outside string
        if (char === '"' || char === "'" || char === '“' || char === '”') {
          candInString = true;
          candStringChar = char;
          rebuilt += '"'; // normalize starting quote to standard double quote
          i++;
        } else if (char === '/' && next === '/') {
          // Skip line comment
          i += 2;
          while (i < cleanedCand.length && cleanedCand[i] !== '\n') {
            i++;
          }
        } else if (char === '/' && next === '*') {
          // Skip block comment
          i += 2;
          while (i < cleanedCand.length) {
            if (cleanedCand[i] === '*' && cleanedCand[i + 1] === '/') {
              i += 2;
              break;
            }
            i++;
          }
        } else if (char === '#') {
          // Skip hash comment
          i++;
          while (i < cleanedCand.length && cleanedCand[i] !== '\n') {
            i++;
          }
        } else if (char === ',') {
          // Safe trailing comma lookahead
          let lookAheadIdx = i + 1;
          let isTrailing = false;
          while (lookAheadIdx < cleanedCand.length) {
            const laChar = cleanedCand[lookAheadIdx];
            const laNext = cleanedCand[lookAheadIdx + 1];
            
            if (/\s/.test(laChar)) {
              lookAheadIdx++;
            } else if (laChar === '/' && laNext === '/') {
              lookAheadIdx += 2;
              while (lookAheadIdx < cleanedCand.length && cleanedCand[lookAheadIdx] !== '\n') {
                lookAheadIdx++;
              }
            } else if (laChar === '/' && laNext === '*') {
              lookAheadIdx += 2;
              let foundEnd = false;
              while (lookAheadIdx < cleanedCand.length) {
                if (cleanedCand[lookAheadIdx] === '*' && cleanedCand[lookAheadIdx + 1] === '/') {
                  lookAheadIdx += 2;
                  foundEnd = true;
                  break;
                }
                lookAheadIdx++;
              }
              if (!foundEnd) break;
            } else if (laChar === '#') {
              lookAheadIdx++;
              while (lookAheadIdx < cleanedCand.length && cleanedCand[lookAheadIdx] !== '\n') {
                lookAheadIdx++;
              }
            } else {
              if (laChar === '}' || laChar === ']') {
                isTrailing = true;
              }
              break;
            }
          }
          
          if (isTrailing) {
            i++; // skip writing the comma
            continue;
          }
          
          rebuilt += char;
          i++;
        } else {
          rebuilt += char;
          i++;
        }
      }
    }

    try {
      return JSON.parse(rebuilt);
    } catch (parseError: any) {
      errors.push(`Candidate: "${candidate.substring(0, 100)}..." -> Cleaned: "${rebuilt.substring(0, 100)}..." -> Error: ${parseError.message}`);
    }
  }

  throw new Error(
    `Failed to parse JSON response. Raw content: ${content}\nErrors encountered:\n${errors.join('\n')}`
  );
}

async function fallbackToGemini(systemPrompt: string, messages: ChatMessage[], t: number, m: number, p: number): Promise<AIResponse> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY no configurado, saltando Nivel 3.');
    return fallbackToOllama(systemPrompt, messages, t, m, p);
  }
  console.log('🔄 Nivel 3 (Gemini 2.0 Flash): Intentando con modelo de Google...');
  try {
    const geminiPayload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map(msg => {
        const parts: any[] = [{ text: msg.content }];
        if (msg.imageBase64) {
          const match = msg.imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
        return { role: msg.role === 'assistant' ? 'model' : 'user', parts };
      }),
      generationConfig: { responseMimeType: 'application/json', temperature: t, maxOutputTokens: m, topP: p }
    };

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok) throw new Error('Gemini API failed');
    const data = await geminiResponse.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!geminiText) throw new Error('Empty Gemini response');
    return cleanJsonResponse(geminiText) as AIResponse;
  } catch (error3) {
    console.warn('⚠️ Nivel 3 (Gemini) falló, intentando Nivel 4 (Ollama Local):', error3);
    return fallbackToOllama(systemPrompt, messages, t, m, p);
  }
}

async function fallbackToOllama(systemPrompt: string, messages: ChatMessage[], t: number, m: number, p: number): Promise<AIResponse> {
  try {
    const ollamaPayload = {
      model: 'clinicagap-cm',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      format: 'json',
      stream: false,
      options: { temperature: t, num_predict: m, top_p: p }
    };

    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaPayload),
    });

    if (!ollamaResponse.ok) throw new Error('Ollama API failed');
    const data = await ollamaResponse.json();
    return cleanJsonResponse(data.message.content) as AIResponse;
  } catch (error4) {
    console.error('❌ Nivel 4 (Ollama) falló. Caída total de la cascada:', error4);
    throw new Error('Fallaron los 4 niveles de IA (Groq, OpenRouter, Gemini, Ollama).');
  }
}

export async function generateBotResponse(
  systemPrompt: string,
  messages: ChatMessage[],
  config?: { temperature?: number; top_p?: number; max_tokens?: number }
): Promise<AIResponse> {
  const t = config?.temperature ?? 0.7;
  const p = config?.top_p ?? 0.9;
  const m = config?.max_tokens ?? 1000;

  const groqPayload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    response_format: { type: 'json_object' },
    temperature: t,
    max_tokens: m,
    top_p: p,
  };

  const hasImage = messages.some(msg => msg.imageBase64);

  if (hasImage) {
    console.log('🖼️ Imagen detectada: Saltando Groq y OpenRouter. Enviando directo a Gemini 2.0 Flash...');
    return await fallbackToGemini(systemPrompt, messages, t, m, p);
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groqPayload),
    });

    if (!groqResponse.ok) throw new Error('Groq API failed');
    const data = await groqResponse.json();
    return cleanJsonResponse(data.choices[0].message.content) as AIResponse;
  } catch (error1) {
    console.warn('⚠️ Nivel 1 (Groq) falló, intentando Nivel 2 (OpenRouter):', error1);
    
    try {
      const openRouterPayload = { ...groqPayload, model: 'openai/gpt-4o-mini' };
      
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openRouterPayload),
      });

      if (!openRouterResponse.ok) throw new Error('OpenRouter API failed');
      const data = await openRouterResponse.json();
      return cleanJsonResponse(data.choices[0].message.content) as AIResponse;
    } catch (error2) {
      console.warn('⚠️ Nivel 2 (OpenRouter) falló, intentando Nivel 3 (Gemini):', error2);
      return await fallbackToGemini(systemPrompt, messages, t, m, p);
    }
  }
}
