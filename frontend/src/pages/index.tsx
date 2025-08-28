import { Box, Divider, Snackbar, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import type { Email, EmailListResponse } from '@/types/email'
import EmailSidebar from '@/components/email/EmailSidebar'
import EmailPanel from '@/components/email/EmailPanel'
import EmailView from '@/components/email/EmailView'
import { useEmailFormStore } from '@/stores/useEmailFormStore'
import { useEmailViewStore } from '@/stores/useEmailViewStore'

interface HomeProps {
  emails: Email[]
  error?: string
}

const Home: NextPage<HomeProps> = ({ emails, error }) => {
  const router = useRouter()
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const isEmailFormOpen = useEmailFormStore(state => state.isOpen)
  const openForm = useEmailFormStore(state => state.openForm)
  const selectedEmail = useEmailViewStore(state => state.selectedEmail)

  const handleEmailSent = async () => {
    setSnackbarOpen(true)
    // Revalidate the data
    await router.replace(router.asPath)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  if (error) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'error.main',
        }}
      >
        Error loading emails: {error}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', display: 'flex' }}>
      <EmailSidebar emails={emails} />
      <Divider orientation='vertical' flexItem />

      {/* Main content */}
      <EmailView email={selectedEmail} />

      {/* Email form panel */}
      {isEmailFormOpen && (
        <>
          <Divider orientation='vertical' flexItem />
          <EmailPanel onEmailSent={handleEmailSent} />
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message='Email sent successfully!'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Floating New Email Button - only show when form is closed */}
      {!isEmailFormOpen && (
        <Fab
          color='primary'
          variant='extended'
          size='medium'
          onClick={openForm}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            pr: 3,
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          New Email
        </Fab>
      )}
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/emails`)

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${response.status}`)
    }

    const data: EmailListResponse = await response.json()

    return {
      props: {
        emails: data.emails || [],
      },
    }
  } catch (error) {
    console.error('Error fetching emails:', error)

    return {
      props: {
        emails: [],
        error: error instanceof Error ? error.message : 'Failed to load emails',
      },
    }
  }
}

export default Home
