import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { v2 as cloudinary } from "cloudinary";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import prisma from "@/lib/prismadb";

cloudinary.config({
  cloud_name: "ht1ti33sl",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function GET() {
  try {
    const prompts = await prisma.dailyGame.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(prompts);
  } catch (err) {
    console.log("[PROMPT_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt");
    const gameId = searchParams.get("id");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isSubscribed = await checkSubscription();

    if (!freeTrial && !isSubscribed) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    const response = await openai.createImage({
      prompt: prompt + ", digital art",
      n: 1,
      size: "1024x1024",
    });

    const uploadedImage = await cloudinary.uploader.upload(
      response.data.data[0].url
    );

    if (!isSubscribed) {
      await increaseApiLimit();
    }

    await prisma.usersOnDailyGames.update({
      where: {
        userId_dailyGameId: {
          userId: userId,
          dailyGameId: Number(gameId),
        },
      },
      data: {
        generatedImage: uploadedImage.url,
      },
    });

    return NextResponse.json(uploadedImage.url);
  } catch (err) {
    console.log("[IMAGE_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("id");

    let game = await prisma.usersOnDailyGames.findUnique({
      where: {
        userId_dailyGameId: {
          userId: userId,
          dailyGameId: Number(gameId),
        },
      },
    });

    if (game.status !== "IN_PROGRESS") {
      return NextResponse.json("Status was updated already", { status: 200 });
    }

    await prisma.usersOnDailyGames.update({
      where: {
        userId_dailyGameId: {
          userId: userId,
          dailyGameId: Number(gameId),
        },
      },
      data: {
        status: gameStatus,
      },
    });

    return NextResponse.json("Game status updated", { status: 200 });
  } catch (err) {
    console.log("[GAME_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
