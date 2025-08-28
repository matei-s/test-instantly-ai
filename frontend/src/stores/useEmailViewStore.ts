import { create } from 'zustand'
import type { Email } from '@/types/email'

interface EmailViewStore {
  selectedEmail: Email | null
  selectEmail: (email: Email) => void
  clearSelection: () => void
}

export const useEmailViewStore = create<EmailViewStore>()((set) => ({
  selectedEmail: null,
  selectEmail: (email) => set({ selectedEmail: email }),
  clearSelection: () => set({ selectedEmail: null }),
}))