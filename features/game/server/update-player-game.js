"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const updatePlayerGame = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { gameId, gameState, generatedImage } = values;

  try {
    const existingGame = await prisma.usersOnGames.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: parseInt(gameId),
        },
      },
    });

    if (existingGame) {
      await prisma.usersOnGames.update({
        where: {
          userId_gameId: {
            userId: user.id,
            gameId: parseInt(gameId),
          },
        },
        data: {
          gameState: gameState || existingGame.gameState,
          generatedImage: generatedImage || existingGame.generatedImage,
        },
      });

      return { status: 200, message: "Player game updated!" };
    } else {
      await prisma.usersOnGames.create({
        data: {
          userId: user.id,
          gameId: parseInt(gameId),
          gameState: gameState || {
            guessedLetters: [" "],
            status: "IN_PROGRESS",
          },
          generatedImage,
        },
      });

      return { status: 201, message: "Player game created!" };
    }
  } catch (error) {
    console.error("Error updating player game:", error);
    return { status: 500, message: "Failed to update player game" };
  }
};
