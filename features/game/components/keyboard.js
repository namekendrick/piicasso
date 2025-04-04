import { CheckCircle2, Gift } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { TOP_ROW, MIDDLE_ROW, BOTTOM_ROW } from "@/constants/keys";
import { useGameLostModal } from "@/features/game/hooks/use-game-lost-modal";
import { useGameWonModal } from "@/features/game/hooks/use-game-won-modal";

import styles from "@/features/game/styles/keyboard.module.css";

export const Keyboard = ({
  addGuessedLetter,
  activeLetters,
  inactiveLetters,
  isWinner = false,
  isLoser = false,
}) => {
  const ref = useRef();
  const [selectedKey, setSelectedKey] = useState("");
  const onOpenWinModal = useGameWonModal((state) => state.onOpen);
  const onOpenLossModal = useGameLostModal((state) => state.onOpen);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (e.target.textContent === "") {
        return;
      }
      if (selectedKey && ref.current && !ref.current.contains(e.target)) {
        setSelectedKey(selectedKey);
      } else {
        setSelectedKey("");
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [selectedKey]);

  const handleOpenModal = () => {
    if (isWinner) {
      onOpenWinModal();
    } else if (isLoser) {
      onOpenLossModal();
    }
  };

  return (
    <>
      <div className="w-full px-2 pb-14">
        <div className="flex basis-1/3 flex-row justify-center">
          {TOP_ROW.map((key) => {
            const isActive = activeLetters.includes(key);
            const isInactive = inactiveLetters.includes(key);
            return (
              <button
                onClick={() => setSelectedKey(key)}
                className={`${styles.btn} ${isActive ? styles.active : ""} ${
                  isInactive ? styles.inactive : ""
                }`}
                disabled={isInactive || isActive || isWinner || isLoser}
                key={key}
              >
                {key}
              </button>
            );
          })}
        </div>
        <div className="flex basis-1/3 flex-row justify-center">
          {MIDDLE_ROW.map((key) => {
            const isActive = activeLetters.includes(key);
            const isInactive = inactiveLetters.includes(key);
            return (
              <button
                onClick={() => setSelectedKey(key)}
                className={`${styles.btn} ${isActive ? styles.active : ""} ${
                  isInactive ? styles.inactive : ""
                }`}
                disabled={isInactive || isActive || isWinner || isLoser}
                key={key}
              >
                {key}
              </button>
            );
          })}
        </div>
        <div className="flex w-full basis-1/3 flex-row justify-center">
          {BOTTOM_ROW.map((key, i) => {
            const isActive = activeLetters.includes(key);
            const isInactive = inactiveLetters.includes(key);
            if (i === 0) {
              return (
                <button
                  onClick={() => {
                    addGuessedLetter(selectedKey);
                    setSelectedKey("");
                  }}
                  className={`${styles.largeBtn} ${
                    selectedKey ? styles.active : ""
                  }`}
                  disabled={isWinner || isLoser}
                  key={key}
                >
                  <CheckCircle2
                    className={`${
                      selectedKey ? "text-white" : "text-slate-700"
                    }`}
                  />
                </button>
              );
            } else if (i === 8) {
              return (
                <button
                  onClick={handleOpenModal}
                  className={`${styles.largeBtn} ${styles.active} ${
                    !isWinner && !isLoser ? styles.inactive : ""
                  }`}
                  disabled={!isWinner && !isLoser}
                  key={key}
                >
                  <Gift className="text-white" />
                </button>
              );
            } else {
              return (
                <button
                  onClick={() => setSelectedKey(key)}
                  className={`${styles.btn} ${isActive ? styles.active : ""} ${
                    isInactive ? styles.inactive : ""
                  }`}
                  disabled={isInactive || isActive || isWinner || isLoser}
                  key={key}
                >
                  {key}
                </button>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};
