"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getGames = async () => {
  const games = await prisma.game.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return games;
};

export const getPlayerGame = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { userId, gameId } = values;

  const playerGame = await prisma.usersOnGames.findUnique({
    where: {
      userId_gameId: {
        userId,
        gameId: parseInt(gameId),
      },
    },
  });

  return playerGame;
};
