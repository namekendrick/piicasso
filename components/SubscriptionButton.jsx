"use client";

import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

export const SubscriptionButton = ({ isSubscribed = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isSubscribed ? "solid" : "default"}
      disabled={isLoading}
      onClick={onClick}
    >
      {isSubscribed ? "Manage Subscription" : "Subscribe"}
      {!isSubscribed && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};
