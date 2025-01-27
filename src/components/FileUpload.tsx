"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const [isPro, setIsPro] = React.useState(false); // Variável para armazenar o plano
  const [userChatsCount, setUserChatsCount] = React.useState(0); // Contagem de chats do usuário

  // Chama a API para verificar o plano e o histórico de chats do usuário
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/check"); // Verificar plano
        const chatsResponse = await axios.get("/api/user-chats"); // Verificar histórico de chats
        

        if (response.status === 200) {
          setIsPro(response.data.isPro); // Define se o usuário tem plano Pro
        } else {
          console.error("Status inesperado da resposta do plano:", response.status);
          setIsPro(false); // Caso ocorra algum erro, assume o plano padrão
        }

        if (chatsResponse.status === 200) {
          setUserChatsCount(chatsResponse.data.chatCount); // Define a contagem de chats
        } else {
          console.error("Status inesperado da resposta de chats:", chatsResponse.status);
        }

      } catch (error) {
        console.error("Erro ao verificar plano e histórico de chats:", error);
        setIsPro(false); // Caso ocorra algum erro, assume o plano padrão
        setUserChatsCount(0); // Assume 0 chats em caso de erro
      }
    };
    fetchUserData();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      try {
        const response = await axios.post("/api/create-chat", {
          file_key,
          file_name,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao criar chat:", error);
        throw error; // Repassa o erro para o React Query
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: isPro ? 50 : 1, // Limite de arquivos: 50 para plano Pro, 1 para o plano normal
    onDrop: async (acceptedFiles) => {
      // Impede o upload de mais arquivos se o usuário não for Pro e já tiver mais de 1 chat
      if (!isPro && userChatsCount > 1) {
        toast.error("Para adicionar mais PDFs, por favor, atualize para o plano Pro.");
        // Redireciona o usuário para a seção de preços
        router.push("#pricing");
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // Arquivo maior que 10MB
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error("Erro ao criar chat:", err);
          },
        });
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-[#121212] rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-[#121212] py-40 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="h-10 w-10 text-[#DC2626] animate-spin" />
            <p className="mt-2 text-sm text-[#EDEDED]">Conectando Com GPT...</p>
          </>
        ) : (
          <>
            <Inbox className="w-20 h-10 text-[#DC2626]" />
            <p className="mt-2 text-lg text-[#EDEDED]">Clique Para Enviar Seu PDF</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
