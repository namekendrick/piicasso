"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const GalleryPage = () => {
  const { data: session, status } = useSession({
    required: true,
  });
  const { data, isLoading } = useSWR("/api/user", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (status === "loading" || isLoading) {
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
      <Navbar />
      <div className="min-h-full flex flex-col justify-between">
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
        <div className="pt-20 pb-8">
          <p className="text-center text-sm">Made with ❤️ in Raleigh, NC</p>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
