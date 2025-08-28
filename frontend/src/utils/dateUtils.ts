export const formatRelativeTime = (dateString: string): string => {
  // Force UTC interpretation of SQLite timestamps to prevent timezone offset issues
  const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return date.toLocaleDateString()
}

export const formatDate = (dateString: string): string => {
  // Force UTC interpretation of SQLite timestamps to prevent timezone offset issues
  const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
  return (
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' at ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  )
}