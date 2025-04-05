"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useContext, createContext } from "react";

import { useCurrentUser } from "@/features/auth/hooks";
import { useGetGames } from "@/features/game/api/use-get-games";
import { useGetPlayerGame } from "@/features/game/api/use-get-player-game";
import { useUpdatePlayerGame } from "@/features/game/api/use-update-player-game";
import { useGameState } from "@/features/game/hooks/use-game-state";
import { useInstructionsModal } from "@/features/game/hooks/use-instructions-modal";
import { useGameLostModal } from "@/features/game/hooks/use-game-lost-modal";
import { useGameWonModal } from "@/features/game/hooks/use-game-won-modal";

export const GameProvider = ({ children }) => {
  const user = useCurrentUser();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { data: games } = useGetGames();
  const { mutate: updatePlayerGame } = useUpdatePlayerGame();
  const openInstructionsModal = useInstructionsModal((state) => state.onOpen);
  const openGameWonModal = useGameWonModal((state) => state.onOpen);
  const openGameLostModal = useGameLostModal((state) => state.onOpen);

  const [gameSetupComplete, setGameSetupComplete] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  // Get state setters from Zustand
  const setDayIndex = useGameState((state) => state.setDayIndex);
  const setCurrentGame = useGameState((state) => state.setCurrentGame);
  const resetGame = useGameState((state) => state.resetGame);
  const setGameStateReady = useGameState((state) => state.setGameStateReady);
  const setGameState = useGameState((state) => state.setGameState);

  // Get current values
  const id = useGameState((state) => state.id);
  const dayIndex = useGameState((state) => state.dayIndex);
  const status = useGameState((state) => state.status);
  const guessedLetters = useGameState((state) => state.guessedLetters);
  const gameStateReady = useGameState((state) => state.gameStateReady);

  // Get player game if user is logged in
  const { data: playerGame, isLoading: isLoadingPlayerGame } = useGetPlayerGame(
    user && id ? { userId: user.id, gameId: id } : null,
  );

  useEffect(() => {
    const launchDate = new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE);
    const now = new Date();
    const timeDiff = now.getTime() - launchDate.getTime();
    const daysSinceLaunch = Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24)));

    setDayIndex(daysSinceLaunch);

    if (!games?.length || dayIndex === null) return;

    // Set up today's game
    const todayGameIndex = dayIndex % games.length;
    const todayGame = games[todayGameIndex];

    setCurrentGame(todayGame);

    if (id !== todayGame.id) resetGame(todayGame.id);

    setGameSetupComplete(true);
  }, [games, dayIndex, id, setDayIndex, setCurrentGame, resetGame]);

  useEffect(() => {
    if (!gameSetupComplete || (user && id && isLoadingPlayerGame)) return;

    if (
      user &&
      playerGame?.gameState &&
      id === playerGame.gameId &&
      !gameStateReady
    ) {
      setGameState(playerGame.gameState);
      setGeneratedImage(playerGame.generatedImage);
    }

    if (user && id) {
      const gameState = { guessedLetters, status };
      updatePlayerGame({ gameId: id, gameState });
    }

    if (!gameStateReady) setGameStateReady(true);
  }, [
    gameSetupComplete,
    user,
    playerGame,
    isLoadingPlayerGame,
    id,
    setGameState,
    guessedLetters,
    status,
    generatedImage,
    updatePlayerGame,
    setGameStateReady,
    gameStateReady,
  ]);

  useEffect(() => {
    if (!gameStateReady || !isHomePage) return;

    if (guessedLetters.length <= 1 && status === "IN_PROGRESS") {
      openInstructionsModal();
      return;
    }

    if (status === "WON") {
      openGameWonModal();
      return;
    }

    if (status === "LOST") {
      openGameLostModal();
      return;
    }
  }, [
    gameStateReady,
    status,
    guessedLetters.length,
    openInstructionsModal,
    openGameWonModal,
    openGameLostModal,
  ]);

  return (
    <GeneratedImageContext.Provider
      value={{ generatedImage, setGeneratedImage }}
    >
      {children}
    </GeneratedImageContext.Provider>
  );
};

const GeneratedImageContext = createContext({
  generatedImage: "",
  setGeneratedImage: () => {},
});

export const useGeneratedImage = () => useContext(GeneratedImageContext);

export const useGame = () => {
  const currentGame = useGameState((state) => state.currentGame);
  const gameStateReady = useGameState((state) => state.gameStateReady);
  const guessedLetters = useGameState((state) => state.guessedLetters);
  const addGuessedLetter = useGameState((state) => state.addLetter);
  const { generatedImage, setGeneratedImage } = useGeneratedImage();

  const incorrectLetters = useMemo(() => {
    if (!currentGame?.prompt) return [];
    return guessedLetters.filter(
      (letter) =>
        !currentGame.prompt.toLowerCase().includes(letter.toLowerCase()),
    );
  }, [guessedLetters, currentGame]);

  const isLoser = useMemo(() => {
    return incorrectLetters.length >= 3;
  }, [incorrectLetters]);

  const isWinner = useMemo(() => {
    if (!currentGame?.prompt) return false;
    return currentGame.prompt
      .split("")
      .every(
        (letter) =>
          letter === " " ||
          guessedLetters.some(
            (guessed) => guessed.toLowerCase() === letter.toLowerCase(),
          ),
      );
  }, [currentGame, guessedLetters]);

  return {
    guessedLetters,
    gameStateReady,
    currentGame,
    incorrectLetters,
    isLoser,
    isWinner,
    addGuessedLetter,
    generatedImage,
    setGeneratedImage,
  };
};
