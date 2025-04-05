import { create } from "zustand";
import { persist } from "zustand/middleware";

const game = (set, get) => ({
  // Game data
  id: "",
  currentGame: null,
  gameStateReady: false,
  dayIndex: null,

  // Game state
  guessedLetters: [" "],
  status: "IN_PROGRESS",

  setDayIndex: (dayIndex) => set({ dayIndex }),
  setCurrentGame: (game) => set({ currentGame: game }),
  setId: (id) => set({ id }),
  setGameStateReady: (ready) => set({ gameStateReady: ready }),

  setGameState: (gameState) =>
    set({
      guessedLetters: gameState.guessedLetters || [" "],
      status: gameState.status || "IN_PROGRESS",
    }),

  addLetter: (letter) => {
    const state = get();

    if (
      !letter ||
      state.guessedLetters.includes(letter) ||
      state.status !== "IN_PROGRESS"
    ) {
      return;
    }

    const newGuessedLetters = [...state.guessedLetters, letter];

    set(() => ({ guessedLetters: newGuessedLetters }));

    const newState = get();

    const incorrectLetters = newState.currentGame?.prompt
      ? newGuessedLetters.filter(
          (letter) =>
            !newState.currentGame.prompt
              .toLowerCase()
              .includes(letter.toLowerCase()),
        )
      : [];

    // Check if player has lost (3 or more incorrect letters)
    const isLoser = incorrectLetters.length >= 3;

    // Check if player has won (guessed all letters in the prompt)
    const isWinner = newState.currentGame?.prompt
      ? newState.currentGame.prompt
          .split("")
          .every(
            (letter) =>
              letter === " " ||
              newGuessedLetters.some(
                (guessed) => guessed.toLowerCase() === letter.toLowerCase(),
              ),
          )
      : false;

    if (isWinner && newState.status !== "WON") {
      set({ status: "WON" });
    } else if (isLoser && newState.status !== "LOST") {
      set({ status: "LOST" });
    }
  },

  resetGame: (gameId) =>
    set({
      id: gameId,
      guessedLetters: [" "],
      status: "IN_PROGRESS",
    }),

  clearState: () =>
    set({
      id: "",
      guessedLetters: [" "],
      status: "IN_PROGRESS",
      currentGame: null,
      gameStateReady: false,
    }),
});

export const useGameState = create(
  persist(game, {
    name: "game",
    partialize: (state) => ({
      id: state.id,
      guessedLetters: state.guessedLetters,
      status: state.status,
    }),
  }),
);
