import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.userId;
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("id");
    const gameStatus = searchParams.get("status");

    let game = await prisma.usersOnDailyGames.findUnique({
      where: {
        userId_dailyGameId: {
          userId: userId,
          dailyGameId: Number(gameId),
        },
      },
    });

    if (game) {
      return NextResponse.json(game, { status: 200 });
    } else {
      game = await prisma.usersOnDailyGames.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          dailyGame: {
            connect: {
              id: Number(gameId),
            },
          },
          status: gameStatus,
          generatedImage: "",
        },
      });
      return NextResponse.json(game, { status: 200 });
    }
  } catch (err) {
    console.log("[GAME_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.userId;
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("id");
    const gameStatus = searchParams.get("status");

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
