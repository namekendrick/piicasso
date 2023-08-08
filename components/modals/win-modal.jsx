"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import Loader from "react-loaders";

import "loaders.css/src/animations/pacman.scss";

import { useGame } from "@/hooks/use-game-data";
import useWinModal from "@/hooks/use-win-modal";
import useSubscribeModal from "@/hooks/use-subscribe-modal";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";

export const WinModal = () => {
  const { data: user } = useSession();
  const subscribeModal = useSubscribeModal();
  const router = useRouter();
  const winModal = useWinModal();
  const game = useGame();
  const setImage = useGame((game) => game.setImage);

  const [generatedImage, setGeneratedImage] = useState(null);
  const prompt = winModal.prompt;

  useEffect(() => {
    if (game) {
      setGeneratedImage(game.image);
    }
  }, [game]);

  const form = useForm({
    defaultValues: {
      prompt: prompt,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/image?prompt=${prompt}&id=${game.id}`
      );
      setGeneratedImage(response.data);
      setImage(response.data);
      form.reset();
    } catch (err) {
      if (err?.response?.status === 403) {
        winModal.onClose();
        subscribeModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  if (!game) {
    <></>;
  }

  return (
    <Modal
      title={prompt}
      description="Woohoo! Nice guess."
      isOpen={winModal.isOpen}
      onClose={winModal.onClose}
    >
      {!generatedImage ? (
        <div>
          <div className="mt-6">
            <p className="text-center px-4">
              Generate a <span className="font-extrabold">unique</span> image
              using today's prompt.
            </p>
          </div>
          {user ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Button
                  className="mt-4 w-full"
                  variant="solid"
                  disabled={isLoading || generatedImage}
                >
                  {isLoading ? (
                    <Loader type="pacman" style={{ transform: "scale(0.5)" }} />
                  ) : (
                    <p>Generate</p>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Link href="/signin">
              <Button
                onClick={() => {
                  winModal.onClose();
                  signIn();
                }}
                className="mt-4 w-full"
                variant="solid"
              >
                <p>Continue</p>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div
          onClick={() => window.open(generatedImage)}
          className="cursor-pointer"
        >
          <Image
            src={generatedImage}
            alt="Image"
            width={450}
            height={450}
            className="mx-auto"
          />
        </div>
      )}
    </Modal>
  );
};
