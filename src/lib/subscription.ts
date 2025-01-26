import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const checkSubscription = async (req: NextRequest) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      console.log("No user ID found.");
      return false;
    }

    const _userSubscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (!_userSubscriptions[0]) {
      console.log("No subscription found for user.");
      return false;
    }

    const userSubscription = _userSubscriptions[0];

    const subscriptionEndDate = new Date(userSubscription.stripeCurrentPeriodEnd);

    if (isNaN(subscriptionEndDate.getTime())) {
      console.log("Invalid subscription end date.");
      return false;
    }

    const isValid =
      userSubscription.stripePriceId &&
      subscriptionEndDate.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
  } catch (error) {
    console.error("Erro ao verificar a assinatura:", error);
    return false;
  }
};
