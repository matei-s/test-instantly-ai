import { create } from 'zustand'

interface EmailFormStore {
  isOpen: boolean
  openForm: () => void
  closeForm: () => void
  isPromptDialogOpen: boolean
  openPromptDialog: () => void
  closePromptDialog: () => void
}

export const useEmailFormStore = create<EmailFormStore>()((set) => ({
  isOpen: false,
  openForm: () => set({ isOpen: true }),
  closeForm: () => set({ isOpen: false }),
  isPromptDialogOpen: false,
  openPromptDialog: () => set({ isPromptDialogOpen: true }),
  closePromptDialog: () => set({ isPromptDialogOpen: false }),
}))