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
import useLossModal from "@/hooks/use-loss-modal";
import useSubscribeModal from "@/hooks/use-subscribe-modal";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";

export const LossModal = () => {
  const { data: user } = useSession();
  const subscribeModal = useSubscribeModal();
  const router = useRouter();
  const lossModal = useLossModal();
  const game = useGame();
  const setImage = useGame((game) => game.setImage);

  const [generatedImage, setGeneratedImage] = useState(null);
  const prompt = lossModal.prompt;

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
        lossModal.onClose();
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
      description="Better luck next time."
      isOpen={lossModal.isOpen}
      onClose={lossModal.onClose}
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
                  lossModal.onClose();
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
            width={500}
            height={300}
            className="mx-auto"
          />
        </div>
      )}
    </Modal>
  );
};
