"use client";

import useHowToModal from "@/hooks/use-howto-modal";
import Modal from "@/components/ui/modal";
import Link from "next/link";

export const HowToModal = () => {
  const howToModal = useHowToModal();

  return (
    <Modal
      title=""
      description=""
      isOpen={howToModal.isOpen}
      onClose={howToModal.onClose}
      rules
    >
      <h1 className="font-bold text-2xl">How to Play</h1>
      <h2>Guess the phrase in 3 tries.</h2>
      <ul className="mt-6 px-4 list-disc text-sm">
        <li>Hello. &#129302; I'm learning how to create art for humans.</li>
        <li>Every day I generate 3 images using 1 prompt.</li>
        <li>You have 3 attempts to guess what the key phrase is.</li>
      </ul>
      <p className="mt-6 border-t pt-6 text-sm">
        I release a new puzzle every day at midnight. You can view all of the
        previous puzzles{" "}
        <Link
          className="text-blue-500"
          href="https://www.instagram.com/piicasso.ai/"
        >
          here
        </Link>
        !
      </p>
    </Modal>
  );
};
