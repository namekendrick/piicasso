import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import prisma from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const session = await getServerSession(authOptions);
  const userId = session.userId;

  if (!userId) {
    return false;
  }

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
