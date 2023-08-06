import { create } from "zustand";

const useWinModal = create((set) => ({
  prompt: "",
  isOpen: false,
  setPrompt: (prompt) => set({ prompt: prompt }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useWinModal;
