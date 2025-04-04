"use server";

import prisma from "@/lib/prisma";
import { getPlayerGame } from "@/db/game";
import { currentUser } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { uploadFile } from "@uploadcare/upload-client";

export const generateDailyImage = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { gameId, prompt } = values;

  try {
    const playerGame = await getPlayerGame({ userId: user.id, gameId });
    if (!playerGame) return { status: 404, message: "Player game not found!" };

    if (playerGame.generatedImage)
      return { status: 200, message: "Daily image already generated!" };

    const response = await openai.images.generate({ prompt });
    const openaiImageUrl = response.data[0].url;

    const uploadResult = await uploadFile(openaiImageUrl, {
      publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY,
      store: "auto",
      metadata: {
        source: "openai",
        prompt: prompt,
      },
    });

    const imageUrl = uploadResult.cdnUrl;

    await prisma.usersOnGames.update({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: parseInt(gameId),
        },
      },
      data: {
        generatedImage: imageUrl,
      },
    });

    return { status: 201, message: "Daily image generated!", imageUrl };
  } catch (error) {
    console.error("Error generating daily image:", error);
    return { status: 500, message: "Failed to generate daily image" };
  }
};
