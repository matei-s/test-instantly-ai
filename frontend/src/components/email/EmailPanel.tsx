import { Box, Backdrop, CircularProgress } from '@mui/material'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import z from 'zod'
import EmailForm from './EmailForm'

interface EmailPanelProps {
  onEmailSent: () => void
}

export default function EmailPanel({ onEmailSent }: EmailPanelProps) {
  const { object, submit, isLoading, error } = useObject({
    api: '/api/chat',
    schema: z.object({ subject: z.string(), body: z.string() }),
  })
  return (
    <Box
      sx={{
        width: 500,
        minWidth: 300,
        maxWidth: '40vw',
        height: '100%',
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EmailForm
        onEmailSent={onEmailSent}
        submit={submit}
        object={object}
        error={error}
        isLoading={isLoading}
      />

      {/* Backdrop overlay for AI generation - only covers the email panel */}
      <Backdrop
        sx={{
          position: 'absolute',
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        open={isLoading}
      >
        <CircularProgress color='primary' size={42} />
      </Backdrop>
    </Box>
  )
}
