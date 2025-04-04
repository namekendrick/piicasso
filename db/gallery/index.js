"use server";

import prisma from "@/lib/prisma";
import { IMAGES_PER_PAGE } from "@/constants/pagination";

export const getGallery = async (values) => {
  const { userId, pageParam } = values;

  let cursorObj = undefined;
  if (pageParam && pageParam !== "") {
    cursorObj = {
      userId_gameId: {
        userId: userId,
        gameId: parseInt(pageParam),
      },
    };
  }

  const gallery = await prisma.usersOnGames.findMany({
    take: IMAGES_PER_PAGE,
    cursor: cursorObj,
    skip: cursorObj ? 1 : 0,
    where: {
      userId,
      generatedImage: { not: null },
    },
    select: { gameId: true, generatedImage: true, userId: true },
    orderBy: { createdAt: "desc" },
  });

  const lastItem = gallery.length > 0 ? gallery[gallery.length - 1] : null;
  const nextCursor =
    gallery.length === IMAGES_PER_PAGE ? lastItem?.gameId : undefined;

  return { gallery, nextCursor };
};
