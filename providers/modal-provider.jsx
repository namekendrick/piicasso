"use client";

import { useEffect, useState } from "react";

import { HowToModal } from "@/components/modals/howto-modal";
import { WinModal } from "@/components/modals/win-modal";
import { LossModal } from "@/components/modals/loss-modal";
import { SubscribeModal } from "@/components/modals/subscribe-modal";

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
      <HowToModal />
      <WinModal />
      <LossModal />
      <SubscribeModal />
    </>
  );
};
