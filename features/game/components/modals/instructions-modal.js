"use client";

import Link from "next/link";

import { Modal } from "@/components/ui/modal";
import { useInstructionsModal } from "@/features/game/hooks/use-instructions-modal";

export const InstructionsModal = () => {
  const modal = useInstructionsModal();

  return (
    <Modal
      title="How to Play"
      description="Guess the secret prompt."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <ul className="mt-6 list-disc px-4 text-sm">
        <li>3 images are generated daily using 1 prompt.</li>
        <li>You have 3 attempts to guess what the secret prompt is.</li>
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
