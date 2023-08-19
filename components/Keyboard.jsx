import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Gift } from "lucide-react";

import useWinModal from "@/hooks/use-win-modal";
import useLossModal from "@/hooks/use-loss-modal";
import { useGame } from "@/hooks/use-game-data";

import styles from "./Keyboard.module.css";

const Keyboard = ({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  isWinner = false,
  isLoser = false,
}) => {
  const keys1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const keys2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const keys3 = ["Confirm", "z", "x", "c", "v", "b", "n", "m", "Results"];

  const ref = useRef();

  const [selectedKey, setSelectedKey] = useState("");

  const onOpenWinModal = useWinModal((state) => state.onOpen);
  const isOpenWinModal = useWinModal((state) => state.isOpen);

  const onOpenLossModal = useLossModal((state) => state.onOpen);
  const isOpenLossModal = useLossModal((state) => state.isOpen);

  const addLetter = useGame((game) => game.addLetter);

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
      if (!isOpenWinModal) {
        onOpenWinModal();
      }
    } else if (isLoser) {
      if (!isOpenLossModal) {
        onOpenLossModal();
      }
    }
  };

  return (
    <>
      <div className="w-full px-2 pb-14">
        <div className="flex flex-row basis-1/3 justify-center">
          {keys1.map((key) => {
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
        <div className="flex flex-row basis-1/3 justify-center">
          {keys2.map((key) => {
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
        <div className="flex flex-row w-full basis-1/3 justify-center">
          {keys3.map((key, i) => {
            const isActive = activeLetters.includes(key);
            const isInactive = inactiveLetters.includes(key);
            if (i === 0) {
              return (
                <button
                  onClick={() => {
                    addGuessedLetter(selectedKey);
                    addLetter(selectedKey);
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

export default Keyboard;
