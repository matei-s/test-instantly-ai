export interface EmailData {
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
}

export interface Email extends EmailData {
  id: number
  created_at: string
  updated_at: string
}

export interface EmailSendResponse {
  success: boolean
  message: string
  emailId?: number
}

export interface EmailListResponse {
  success: boolean
  count: number
  emails: Email[]
}
