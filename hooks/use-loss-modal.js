import { create } from "zustand";

const useLossModal = create((set) => ({
  prompt: "",
  isOpen: false,
  setPrompt: (prompt) => set({ prompt: prompt }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useLossModal;
