import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.userId;

    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        dailyGames: true,
      },
    });

    if (!user) {
      return NextResponse.json("No user found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log("[USER_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.userId;

    let user = await prisma.user.findUnique({
      where: {
        id: userId || "",
      },
    });

    if (user) {
      return NextResponse.json("User already exists", { status: 200 });
    } else {
      user = await prisma.user.create({
        data: {
          id: userId,
        },
      });
      return NextResponse.json(user, { status: 200 });
    }
  } catch (err) {
    console.log("[USER_ERROR],", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
