"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";

import { useGame } from "@/hooks/use-game-data";
import useStoreModal from "@/hooks/use-howto-modal";
import useWinModal from "@/hooks/use-win-modal";
import useLossModal from "@/hooks/use-loss-modal";
import DailyPrompt from "@/components/DailyPrompt";
import Keyboard from "@/components/Keyboard";
import Navbar from "@/components/Navbar";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SetupPage() {
  const { data: user } = useSession();
  const { data, error, isLoading } = useSWR("/api/image", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const setWon = useGame((game) => game.setWon);
  const setLost = useGame((game) => game.setLost);
  const setId = useGame((game) => game.setId);
  const setImage = useGame((game) => game.setImage);
  const clearState = useGame((game) => game.clearState);
  const status = useGame().status;

  const onOpenStoreModal = useStoreModal((state) => state.onOpen);
  const isOpenStoreModal = useStoreModal((state) => state.isOpen);

  const onOpenWinModal = useWinModal((state) => state.onOpen);
  const isOpenWinModal = useWinModal((state) => state.isOpen);
  const passPromptToWin = useWinModal((state) => state.setPrompt);

  const onOpenLossModal = useLossModal((state) => state.onOpen);
  const isOpenLossModal = useLossModal((state) => state.isOpen);
  const passPromptToLoss = useLossModal((state) => state.setPrompt);

  const [game, setGame] = useState({
    guessedLetters: [" "],
    status: "IN_PROGRESS",
  });

  const [daily, setDaily] = useState(null);
  const [gameStateReady, setGameStateReady] = useState(false);
  const [gameBackendCreated, setGameBackEndCreated] = useState(false);

  useEffect(() => {
    const launchDate = new Date("Aug 10 2023");
    const timeDiff = new Date().getTime() - launchDate.getTime();
    const storage = localStorage.getItem("game");
    if (data && storage) {
      const index =
        Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24))) % data.length;
      setDaily(data[index]);
      if (JSON.parse(storage).state.id === data[index].id) {
        setGame(JSON.parse(storage).state);
        setId(data[index].id);
        setGameStateReady(true);
      } else {
        clearState();
        setId(data[index].id);
        setGameStateReady(true);
      }
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (user && daily && status && gameStateReady) {
        await axios.post("/api/user");
        const response = await axios.post(
          `/api/game?id=${daily.id}&status=${status}`
        );
        if (response.data.generatedImage) {
          setImage(response.data.generatedImage);
          setGameBackEndCreated(true);
        } else {
          setImage("");
          setGameBackEndCreated(true);
        }
      }
    })();
  }, [user, daily, status, gameStateReady]);

  const incorrectLetters = game.guessedLetters.filter(
    (letter) => !daily?.prompt.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 3;
  const isWinner = daily?.prompt
    .split("")
    .every((letter) => game.guessedLetters.includes(letter || ""));

  const addGuessedLetter = useCallback(
    (letter) => {
      if (game.guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGame((_letter) => ({
        ..._letter,
        guessedLetters: [..._letter.guessedLetters, letter],
      }));
    },
    [game.guessedLetters, isLoser, isWinner]
  );

  useEffect(() => {
    if (isWinner && daily) {
      if (!isOpenWinModal) {
        if (user && gameBackendCreated && gameStateReady) {
          axios.patch(`/api/game?id=${daily.id}&status=WON`);
        }
        setWon();
        passPromptToWin(daily.prompt);
        onOpenWinModal();
      }
    } else if (isLoser && daily) {
      if (!isOpenLossModal) {
        if (user && gameBackendCreated && gameStateReady) {
          axios.patch(`/api/game?id=${daily.id}&status=LOST`);
        }
        setLost();
        passPromptToLoss(daily.prompt);
        onOpenLossModal();
      }
    }
  }, [isWinner, isLoser, gameBackendCreated, gameStateReady]);

  if (error) return <div>failed to load</div>;
  if (isLoading && !data) return <Navbar />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full mx-auto gap-8 mt-5">
        <div className="max-w-sm sm:max-w-md mx-auto">
          <div className="flex [&:hover>div]:w-8 [&>div:hover]:w-[300px] sm:[&>div:hover]:w-[400px]">
            <div className="group relative w-[200px] h-[300px] sm:w-[400px] sm:h-[400px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200">
              <img
                src={daily?.image1}
                className="h-full object-cover transition-all"
                alt="First daily image"
              />
            </div>
            <div className="group relative w-[200px] h-[300px] sm:w-[400px] sm:h-[400px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200">
              <img
                src={daily?.image2}
                className="h-full object-cover transition-all"
                alt="Second daily image"
              />
            </div>
            <div className="group relative w-[200px] h-[300px] sm:w-[400px] sm:h-[400px] cursor-pointer overflow-hidden shadow-md shadow-black/30 transition-all duration-200">
              <img
                src={daily?.image3}
                className="h-full object-cover transition-all"
                alt="Third daily image"
              />
            </div>
          </div>
        </div>
        <DailyPrompt
          prompt={daily?.prompt}
          guessedLetters={game.guessedLetters}
          isWinner={isWinner}
          isLoser={isLoser}
          reveal={isLoser}
        />
        <div className="self-stretch">
          <Keyboard
            isWinner={isWinner}
            isLoser={isLoser}
            activeLetters={game.guessedLetters.filter((letter) =>
              daily?.prompt.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>
    </>
  );
}
