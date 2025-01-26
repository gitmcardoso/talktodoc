// src/app/api/user-chats/route.ts

import { NextResponse, NextRequest } from "next/server"; // Importando NextRequest do next/server
import { db } from "@/lib/db"; // Seu banco de dados
import { chats } from "@/lib/db/schema"; // Supondo que você tenha uma tabela de chats
import { getAuth } from "@clerk/nextjs/server"; // Importando Clerk para autenticação
import { eq } from "drizzle-orm"; // Importando o eq do drizzle

export async function GET(req: NextRequest) { // Usando NextRequest corretamente
  try {
    // Obtendo o userId a partir da autenticação com Clerk
    const { userId } = getAuth(req); 

    // Verifique se o userId foi obtido com sucesso
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Consultando os chats do usuário com o Drizzle ORM corretamente
    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId)); // Usando eq corretamente aqui

    // Retorna a quantidade de chats encontrados
    return NextResponse.json({
      chatCount: userChats.length, // Retorna a quantidade de chats
    });
  } catch (error) {
    console.error("Erro ao buscar chats do usuário:", error);
    return NextResponse.json({ error: "Error fetching chats" }, { status: 500 });
  }
}
