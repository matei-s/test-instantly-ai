import z from 'zod'

export const emailSchema = z.object({
  subject: z.string().describe('Email subject'),
  body: z.string().describe('Email body'),
})
