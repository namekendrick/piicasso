"use client";

import { useEffect, useState } from "react";

import { GameLostModal } from "@/features/game/components/modals/game-lost-modal";
import { GameWonModal } from "@/features/game/components/modals/game-won-modal";
import { InstructionsModal } from "@/features/game/components/modals/instructions-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <GameWonModal />
      <GameLostModal />
      <InstructionsModal />
    </>
  );
};
