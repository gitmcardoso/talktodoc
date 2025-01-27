import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Rota /api/create-chat chamada");  // Verifique se a rota foi acessada
  const { userId } = getAuth(req); // Usa o getAuth para obter o userId diretamente do req
  
  console.log("Método da requisição:", req.method); // Log do método da requisição

  if (!userId) {
    console.log('Usuário não autenticado, 401 retornado');
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { file_key, file_name } = body;

    await loadS3IntoPinecone(file_key);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });


    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
