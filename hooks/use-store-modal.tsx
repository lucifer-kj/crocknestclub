import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => {
    console.log('useStoreModal: Opening modal')
    set({ isOpen: true })
  },
  onClose: () => {
    console.log('useStoreModal: Closing modal')
    set({ isOpen: false })
  }
})) 