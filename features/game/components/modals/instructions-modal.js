"use client";

import Link from "next/link";

import { Modal } from "@/components/ui/modal";
import { useInstructionsModal } from "@/features/game/hooks/use-instructions-modal";

export const InstructionsModal = () => {
  const modal = useInstructionsModal();

  return (
    <Modal
      title="How to Play"
      description="Guess the secret phrase."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <ul className="mt-6 list-disc px-4 text-sm">
        <li>3 AI images are generated daily using 1 phrase.</li>
        <li>Guess what the secret phrase is. You have 3 strikes.</li>
      </ul>
      <p className="mt-6 border-t pt-6 text-sm">
        A new puzzle is released every day at midnight. You can view all of the
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
