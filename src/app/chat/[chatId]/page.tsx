import { NextRequest } from "next/server"; 
import { headers } from "next/headers"; 
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import ChatPageClient from "@/components/ChatPageClient";
import { checkSubscription } from "@/lib/subscription";

// Definindo o tipo correto para os parâmetros da página
type Params = {
  chatId: string;
};

// Definindo o tipo PageProps esperado pelo Next.js
type PageProps = {
  params: Promise<Params>;  // Agora `params` é uma Promise
};

export default async function ChatPage({ params }: PageProps) {
  // Aguarde a resolução do parâmetro assíncrono
  const { chatId } = await params; // Espera resolver os parâmetros

  // Obtendo os headers da requisição
  const headersInstance = Object.fromEntries((await headers()).entries());

  // Criando uma instância de NextRequest
  const req = new NextRequest(new URL("/", process.env.NEXT_BASE_URL || "http://localhost"), {
    headers: headersInstance,
  });

  // Verificando se o usuário é assinante Pro
  const isPro = await checkSubscription(req);

  // Obtendo o ID do usuário autenticado
  const { userId } = await auth();

  // Redirecionando se o usuário não estiver autenticado
  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  // Buscando os chats do usuário no banco de dados
  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  // Redirecionando se o chat não existir ou não pertencer ao usuário
  if (!_chats.length || !_chats.find((chat) => chat.id === parseInt(chatId))) {
    redirect("/");
    return null;
  }

  // Encontrando o chat atual
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  // Renderizando o componente ChatPageClient
  return (
    <ChatPageClient
      chats={_chats}
      chatId={parseInt(chatId)}
      pdfUrl={currentChat?.pdfUrl || " "}
      isPro={isPro}
    />
  );
}
