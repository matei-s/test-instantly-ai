import { openai } from '@ai-sdk/openai'
import { generateObject, streamObject } from 'ai'
import { followupAssistantSystemPrompt, salesAssistantSystemPrompt } from './prompts'
import { emailSchema } from './schemas'
import type { Email } from '@/types/email'
import z from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { prompt, selectedEmail }: { prompt: string; selectedEmail: Email | null } =
      await req.json()
    console.debug({ prompt, selectedEmail })

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required and must be a string' }, { status: 400 })
    }

    // First step: Classify the prompt request type
    const { object: classification } = await generateObject({
      model: openai('gpt-5-nano'),
      schema: z.object({
        type: z.enum(['sales', 'follow-up']),
      }),
      prompt: `Classify this customer prompt:
    "${prompt}"

    Determine the email type to generate:
      - sales: The user wants to generate a new sales/outreach email (e.g., "write a sales email", "reach out to a prospect", "pitch our product")
      - follow-up: The user wants to generate a follow-up email to check in, remind, or continue a conversation (e.g., "follow up on", "check in", "circle back", "remind them", "haven't heard back")
    
    Focus on the intent: sales emails are for initial outreach/selling, follow-up emails are for continuing existing conversations or gentle reminders.
    `,
    })

    console.debug({ classification })

    // Second step: Send the email with the appropriate system prompt.
    const result = streamObject({
      model: openai('gpt-5-mini'),
      schema: emailSchema,
      system: {
        sales: salesAssistantSystemPrompt,
        'follow-up': followupAssistantSystemPrompt(selectedEmail),
      }[classification.type],
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
