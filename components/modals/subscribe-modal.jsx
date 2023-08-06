"use client";

import { useState } from "react";
import axios from "axios";
import Loader from "react-loaders";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useSubscribeModal from "@/hooks/use-subscribe-modal";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";

export const SubscribeModal = () => {
  const subscribeModal = useSubscribeModal();
  const [isLoading, setIsLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (err) {
      console.log(err, "STRIP_CLIENT_ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={subscribeModal.isOpen} onOpenChange={subscribeModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">
            <div className="mt-4">
              You've already used your free generation!
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="mt-4">
              Susbcribe for <span className="font-extrabold">$1/month</span> to
              continue generating daily, unique images. It helps keep the lights
              on for me and the human.
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={onSubscribe} className="w-full mt-4 font-bold">
              {isLoading ? (
                <Loader type="pacman" style={{ transform: "scale(0.5)" }} />
              ) : (
                <div className="flex">
                  <p>Subscribe</p>
                  <Zap className="w-4 h-4 ml-1 fill-slate-800" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
