"use server";

import prisma from "@/lib/prisma";
import {
  artStylesAndArtists,
  promptEngineeringPrompt,
} from "@/constants/artwork";
import { getPlayerGame } from "@/db/game";
import { currentUser } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { uploadFile } from "@uploadcare/upload-client";

export const generateDailyImage = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { gameId, prompt } = values;

  const playerGame = await getPlayerGame({ userId: user.id, gameId });
  if (!playerGame) return { status: 404, message: "Player game not found!" };

  if (playerGame.generatedImage)
    return { status: 200, message: "Daily image already generated!" };

  try {
    const randomIndex = Math.floor(Math.random() * artStylesAndArtists.length);
    const { style, artist } = artStylesAndArtists[randomIndex];

    const meaning = Math.floor(Math.random() * 10) + 1;

    const promptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a skilled image prompt engineer." },
        {
          role: "user",
          content: promptEngineeringPrompt(prompt, meaning, style, artist),
        },
      ],
    });

    const imagePrompt = promptResponse.choices[0].message.content.trim();

    const response = await openai.images.generate({
      prompt: imagePrompt,
      model: "dall-e-3",
      quality: "hd",
      style: "vivid",
      n: 1,
    });

    const imageUrl = response.data[0].url;

    const uploadResult = await uploadFile(imageUrl, {
      publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY,
      store: "auto",
      metadata: {
        source: "openai",
        prompt: prompt,
        meaning: meaning.toString(),
        style,
        artist,
        generatedPrompt: imagePrompt,
      },
    });

    await prisma.usersOnGames.update({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: parseInt(gameId),
        },
      },
      data: { generatedImage: uploadResult.cdnUrl },
    });

    return {
      status: 201,
      message: "Daily image generated!",
      imageUrl: uploadResult.cdnUrl,
    };
  } catch (error) {
    console.error("Error generating daily image:", error);
    return { status: 500, message: "Failed to generate daily image" };
  }
};
