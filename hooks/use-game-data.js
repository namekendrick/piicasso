import { create } from "zustand";
import { persist } from "zustand/middleware";

const game = (set) => ({
  id: "",
  guessedLetters: [" "],
  status: "IN_PROGRESS",
  image: "",
  setId: (id) => set({ id: id }),
  addLetter: (letter) =>
    set((prev) => ({ guessedLetters: [...prev.guessedLetters, letter] })),
  clearState: () =>
    set({ id: "", guessedLetters: [" "], status: "IN_PROGRESS", image: "" }),
  setWon: () => set({ status: "WON" }),
  setLost: () => set({ status: "LOST" }),
  setImage: (image) => set({ image: image }),
});

export const useGame = create(persist(game, { name: "game" }));
