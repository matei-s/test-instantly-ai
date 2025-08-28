import {
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material'
import { useEmailFormStore } from '@/stores/useEmailFormStore'
import { useEmailViewStore } from '@/stores/useEmailViewStore'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SendIcon from '@mui/icons-material/Send'
import React from 'react'
import type { EmailData, Email } from '@/types/email'

interface EmailFormProps {
  onEmailSent: () => void
  submit: (args: { prompt: string; selectedEmail?: Email | null }) => void
  object: { subject?: string; body?: string } | undefined
  error: Error | undefined
  isLoading: boolean
}

export default function EmailForm({
  onEmailSent,
  submit,
  object,
  error,
  isLoading,
}: EmailFormProps) {
  const closeForm = useEmailFormStore(state => state.closeForm)
  const openPromptDialog = useEmailFormStore(state => state.openPromptDialog)
  const selectedEmail = useEmailViewStore(state => state.selectedEmail)
  const [isSending, setIsSending] = React.useState(false)
  const [sendError, setSendError] = React.useState<string | null>(null)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')

  // Sync AI-generated content to local state
  React.useEffect(() => {
    if (object?.subject) {
      setSubject(object.subject)
    }
    if (object?.body) {
      setBody(object.body)
    }
  }, [object])

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setSendError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const emailData: EmailData = {
        to: formData.get('to') as string,
        cc: (formData.get('cc') as string) || undefined,
        bcc: (formData.get('bcc') as string) || undefined,
        subject: subject,
        body: body,
      }

      if (!emailData.to.trim() || !emailData.subject.trim() || !emailData.body.trim()) {
        throw new Error('To, Subject, and Body are required fields')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send email' }))
        throw new Error(errorData.message || 'Failed to send email')
      }

      closeForm()
      onEmailSent()
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        p: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <IconButton onClick={closeForm} size='small' sx={{ position: 'absolute', right: 4, top: 4 }}>
        <CloseIcon />
      </IconButton>

      <form onSubmit={handleSend}>
        <Button
          type='submit'
          variant='contained'
          sx={{ alignSelf: 'start', mb: 2 }}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} color='inherit' />
              Sending...
            </>
          ) : (
            <>
              <SendIcon sx={{ mr: 1 }} /> Send
            </>
          )}
        </Button>

        {sendError && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setSendError(null)}>
            {sendError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <TextField variant='standard' label='To:' size='small' name='to' required />
          <TextField variant='standard' label='CC:' size='small' name='cc' />
          <TextField variant='standard' label='BCC:' size='small' name='bcc' />
          <TextField
            variant='standard'
            label='Subject'
            size='medium'
            fullWidth
            name='subject'
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={isLoading}
          />
        </Box>
        <TextField
          multiline
          variant='standard'
          minRows={12}
          fullWidth
          name='body'
          required
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder='Write or generate with AI'
          disabled={isLoading}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ flex: 1, width: '100%', height: '100%', minHeight: 0, pl: 2, ml: -2, mb: -2 }}
        />
      </form>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Error generating email: {error.message}
        </Alert>
      )}

      <Fab
        color='secondary'
        size='medium'
        variant='extended'
        onClick={openPromptDialog}
        disabled={isLoading}
        sx={{ position: 'absolute', bottom: 24, right: 24 }}
      >
        {isLoading ? (
          <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
        ) : (
          <AutoAwesomeIcon sx={{ mr: 1 }} />
        )}
        AI
      </Fab>
      <PromptDialog onGenerate={submit} selectedEmail={selectedEmail} />
    </Box>
  )
}

function PromptDialog({
  onGenerate,
  selectedEmail,
}: {
  onGenerate: (args: { prompt: string; selectedEmail: Email | null }) => void
  selectedEmail: Email | null
}) {
  const isPromptDialogOpen = useEmailFormStore(state => state.isPromptDialogOpen)
  const closePromptDialog = useEmailFormStore(state => state.closePromptDialog)
  const [prompt, setPrompt] = React.useState('')

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate({ prompt: prompt.trim(), selectedEmail })
      setPrompt('')
      closePromptDialog()
    }
  }

  const handleClose = () => {
    setPrompt('')
    closePromptDialog()
  }

  return (
    <Dialog open={isPromptDialogOpen} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Generate Email with AI</DialogTitle>
      <DialogContent>
        <TextField
          label='What kind of email do you want to write?'
          multiline
          rows={3}
          variant='outlined'
          fullWidth
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder='e.g., Write a follow-up email about project status'
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={!prompt.trim()}>
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  )
}
