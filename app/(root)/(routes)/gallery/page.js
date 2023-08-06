"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryPage = () => {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      if (user) {
        setIsLoading(true);
        const response = await axios.post("/api/user");
        if (response.data === "User already exists") {
          const res = await axios.get("/api/user");
          setData(res.data);
          setIsLoading(false);
        } else {
          setData(response.data);
          setIsLoading(false);
        }
      }
    })();
  }, [user]);

  if (isLoading && !data) {
    return (
      <>
        <Navbar />
        <div className="px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <Skeleton className="h-[250px] w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user />
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {data?.dailyGames?.map((game) => {
            return game.generatedImage.length > 0 ? (
              <Card
                key={game.dailyGameId}
                className="rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={game.generatedImage} />
                </div>
              </Card>
            ) : null;
          })}
        </div>
      </div>
      <div className="border-t fixed bottom-0 inset-x-0 py-4 bg-white">
        <p className="text-center text-sm">Made with ❤️ in Raleigh, NC</p>
        <Link href="/settings">
          <p className="text-center text-sm text-blue-500 hover:underline">
            Manage Subscription
          </p>
        </Link>
      </div>
    </>
  );
};

export default GalleryPage;
