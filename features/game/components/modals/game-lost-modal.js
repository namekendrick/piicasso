"use client";

import Image from "next/image";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCurrentUser } from "@/features/auth/hooks";
import { useGenerateDailyImage } from "@/features/game/api/use-generate-daily-image";
import { useGameLostModal } from "@/features/game/hooks/use-game-lost-modal";
import { useGameState } from "@/features/game/hooks/use-game-state";
import { useGeneratedImage } from "@/providers/game-provider";

export const GameLostModal = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const modal = useGameLostModal();
  const currentGame = useGameState((state) => state.currentGame);
  const { generatedImage, setGeneratedImage } = useGeneratedImage();
  const { mutate: generateDailyImage, isPending } = useGenerateDailyImage();

  const handleGenerateImage = () => {
    if (!user) {
      modal.onClose();
      router.push("/auth/email");
    }

    generateDailyImage(
      {
        gameId: currentGame.id,
        prompt: currentGame.prompt,
      },
      { onSuccess: (image) => setGeneratedImage(image) },
    );
  };

  return (
    <Modal
      title={currentGame?.prompt}
      description="Aww, better luck next time."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      {generatedImage ? (
        <div
          onClick={() => window.open(generatedImage)}
          className="cursor-pointer"
        >
          <Image
            src={generatedImage}
            alt={currentGame?.prompt}
            className="rounded-lg"
            width={500}
            height={500}
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col justify-center gap-4">
          <p>
            Generate your <span className="font-extrabold">unique</span> image
            using today's prompt.
          </p>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={currentGame?.image1}
              alt="Blurred image"
              className="blur-2xl"
              width={500}
              height={500}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={handleGenerateImage} disabled={isPending}>
                {isPending ? <ClipLoader color="#fff" size={15} /> : <Wand2 />}
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
