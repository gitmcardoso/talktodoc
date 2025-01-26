import { NextRequest } from "next/server"; // Importando NextRequest
import { headers } from "next/headers"; // Para acessar cabeçalhos e cookies
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import ChatPageClient from "@/components/ChatPageClient";
import { checkSubscription } from "@/lib/subscription";

// Ajuste para compatibilidade com a nova estrutura de páginas no Next.js 13
type Props = {
  params: {
    chatId: string; // O tipo é string porque params recebe strings
  };
};

// Página com parâmetros dinâmicos
export default async function ChatPage({ params }: Props) {
  const { chatId } = params;

  const headersInstance = Object.fromEntries((await headers()).entries()); // Corrigido: Adicionado await para resolver a Promise

  // Criando NextRequest manualmente
  const req = new NextRequest(new URL("/", process.env.NEXT_BASE_URL || "http://localhost"), {
    headers: headersInstance,
  });

  const isPro = await checkSubscription(req);

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!_chats.length || !_chats.find((chat) => chat.id === parseInt(chatId))) {
    redirect("/");
    return null;
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <ChatPageClient
      chats={_chats}
      chatId={parseInt(chatId)}
      pdfUrl={currentChat?.pdfUrl || " "}
      isPro={isPro}
    />
  );
}
