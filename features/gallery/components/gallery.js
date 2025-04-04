"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ClipLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGallery } from "@/features/gallery/api/use-get-gallery";
import { Download } from "lucide-react";

export const Gallery = ({ userId }) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetGallery({ userId });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="mt-64 flex items-center justify-center">
        <ClipLoader color="#000" size={35} />
      </div>
    );

  if (!data || data.pages.length === 0 || data.pages[0].gallery.length === 0) {
    return (
      <div className="mt-24 flex items-center justify-center">
        <p className="text-lg text-gray-500">No images in your gallery yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {data.pages.map((page) =>
          page.gallery.map((image) => (
            <div key={image.gameId} className="group relative aspect-square">
              <Image
                src={image.generatedImage}
                alt="Gallery image"
                className="rounded-lg"
                fill
              />
              <a
                href={image.generatedImage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="absolute top-2 right-2 cursor-pointer p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4 text-zinc-900" />
                </Button>
              </a>
            </div>
          )),
        )}
      </div>
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 gap-4 p-4 pt-0 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="hidden aspect-square w-full rounded-lg md:block" />
          <Skeleton className="hidden aspect-square w-full rounded-lg lg:block" />
        </div>
      )}
      <div ref={ref} className="invisible"></div>
    </div>
  );
};
