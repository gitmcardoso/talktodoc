import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  console.log("Recebendo chatId:", chatId);

  try {
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    console.log("Mensagens encontradas no banco:", _messages);

    return NextResponse.json(_messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
  }
};
