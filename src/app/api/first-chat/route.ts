import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    // Log para depuração

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const firstChatData = await db.select().from(chats).where(eq(chats.userId, userId));

    // Log para depuração

    if (firstChatData.length > 0) {
      return NextResponse.json({ firstChat: firstChatData[0] }, { status: 200 });
    } else {
      return NextResponse.json({ firstChat: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching first chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}