"use client";

import { DailyImages } from "@/features/game/components/daily-images";
import { DailyPrompt } from "@/features/game/components/daily-prompt";
import { Keyboard } from "@/features/game/components/keyboard";
import { useGame } from "@/providers/game-provider";

export const DailyGame = () => {
  const {
    guessedLetters,
    gameStateReady,
    currentGame,
    incorrectLetters,
    isLoser,
    isWinner,
    addGuessedLetter,
  } = useGame();

  if (!gameStateReady) return <></>;

  return (
    <div className="mx-auto mt-5 flex w-full flex-col items-center justify-start gap-8">
      <DailyImages
        image1={currentGame.image1}
        image2={currentGame.image2}
        image3={currentGame.image3}
      />
      <DailyPrompt
        prompt={currentGame.prompt}
        guessedLetters={guessedLetters}
        isWinner={isWinner}
        isLoser={isLoser}
        reveal={isLoser}
      />
      <div className="self-stretch">
        <Keyboard
          addGuessedLetter={addGuessedLetter}
          activeLetters={guessedLetters.filter((letter) =>
            currentGame.prompt.includes(letter),
          )}
          inactiveLetters={incorrectLetters}
          isWinner={isWinner}
          isLoser={isLoser}
        />
      </div>
    </div>
  );
};
