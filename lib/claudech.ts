import { createOpenAI } from '@ai-sdk/openai'

const apiKey = process.env.CLAUDECH_API_KEY || ''
const baseURL = process.env.CLAUDECH_BASE_URL || 'https://api.claudech.com/v1'

/**
 * Cliente centralizado para el Gateway de Claudech en Vercel AI SDK.
 * Compatible con modelos Claude Opus 5.5, Fable 5.1, Opus 5 y Sonnet 5.5.
 */
export const claudech = createOpenAI({
  apiKey,
  baseURL,
  headers: {
    'X-Accel-Buffering': 'no',
  },
})

export const CLAUDECH_MODELS = {
  OPUS_5_5: 'claude-opus-5-5',
  FABLE_5_1: 'claude-fable-5-1',
  OPUS_5: 'claude-opus-5',
  SONNET_5_5: 'claude-sonnet-5-5',
} as const

export type ClaudechModelKey = keyof typeof CLAUDECH_MODELS
