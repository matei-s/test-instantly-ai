import { Box } from '@mui/material'
import type { Email } from '@/types/email'
import EmailList from './EmailList'

interface EmailSidebarProps {
  emails: Email[]
}

export default function EmailSidebar({ emails }: EmailSidebarProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 320,
        height: '100%',
        flexShrink: 0,
      }}
    >
      <EmailList emails={emails} />
    </Box>
  )
}
