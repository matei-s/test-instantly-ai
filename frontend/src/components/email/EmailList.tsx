import { Box, Typography, List, ListItem } from '@mui/material'
import type { Email } from '@/types/email'
import { useEmailViewStore } from '@/stores/useEmailViewStore'
import { truncateText, formatRelativeTime } from '@/utils'

interface EmailListProps {
  emails: Email[]
}

export default function EmailList({ emails }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'grey.500',
        }}
      >
        <Typography variant='body2'>No emails yet</Typography>
      </Box>
    )
  }

  return (
    <List sx={{ p: 0, overflow: 'auto', height: 'calc(100% - 80px)' }}>
      {emails.map(email => (
        <EmailListItem key={email.id} email={email} />
      ))}
    </List>
  )
}

function EmailListItem({ email }: { email: Email }) {
  const { selectedEmail, selectEmail } = useEmailViewStore()
  const isSelected = selectedEmail?.id === email.id

  const handleClick = () => {
    selectEmail(email)
  }

  return (
    <ListItem
      onClick={handleClick}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: isSelected ? 'action.selected' : 'transparent',
        '&:hover': {
          backgroundColor: isSelected ? 'action.selected' : 'action.hover',
          cursor: 'pointer',
        },
        py: 1.5,
        px: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 0.5, display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <Typography
            component='span'
            variant='body2'
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            To: {truncateText(email.to, 30)}
          </Typography>
          <Typography
            component='span'
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              mt: 0.25,
            }}
          >
            {formatRelativeTime(email.created_at)}
          </Typography>
        </Box>
        <Box>
          <Typography
            component='div'
            variant='body2'
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              mb: 0.5,
              fontSize: '0.875rem',
            }}
          >
            {truncateText(email.subject, 40)}
          </Typography>
          <Typography
            component='div'
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              lineHeight: 1.2,
            }}
          >
            {truncateText(email.body, 50)}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  )
}
