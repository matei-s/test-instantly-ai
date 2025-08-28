import { Box, Typography, Divider } from '@mui/material'
import type { Email } from '@/types/email'
import { formatDate } from '@/utils'

interface EmailViewProps {
  email: Email | null
}

export default function EmailView({ email }: EmailViewProps) {
  if (!email) {
    return (
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'grey.500',
          fontSize: '1.2rem',
        }}
      >
        No message selected
      </Box>
    )
  }


  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 3,
      }}
    >
      {/* Header section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 500,
            mb: 2,
            color: 'text.primary',
          }}
        >
          {email.subject}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <strong>From:</strong> You
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <strong>To:</strong> {email.to}
          </Typography>
        </Box>

        {email.cc && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              <strong>CC:</strong> {email.cc}
            </Typography>
          </Box>
        )}

        {email.bcc && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              <strong>BCC:</strong> {email.bcc}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <strong>Date:</strong> {formatDate(email.created_at)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Email body */}
      <Box>
        <Typography
          variant='body1'
          component='div'
          sx={{
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: 'text.primary',
          }}
        >
          {email.body}
        </Typography>
      </Box>
    </Box>
  )
}
