"use client";

import React, { useState, useEffect } from "react";
import ChatSideBar from "@/components/ChatSideBar";
import ChatComponent from "@/components/ChatComponent";
import { Menu, X } from "lucide-react";
import PDFViewer from "./PDFViewer";

type Props = {
  chats: any[];
  chatId: number;
  pdfUrl: string;
  isPro: boolean; // Adicionado para mostrar botões de administração caso seja um administrador
};

export default function ChatPageClient({ chats, chatId, pdfUrl, isPro }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);


  // Detectar se o dispositivo é móvel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Verificar no primeiro render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isMobile) {
    // Layout original para desktop
    return (
      <div className="flex max-h-screen overflow-y-auto scrollbar-none">
        <div className="flex w-full max-h-screen overflow-y-auto scrollbar-none">
          {/* Chat Sidebar */}
          <div className="flex-[1] max-w-xs">
            <ChatSideBar chats={chats} chatId={chatId} isPro={isPro}/>
          </div>

          {/* PDF Viewer */}
          <div className="max-h-screen p-4 overflow-y-auto scrollbar-none flex-[5] bg-[#0A0A0A]">
            <PDFViewer pdf_url={pdfUrl} />
          </div>

          {/* Chat Component */}
          <div className="flex-[3] border-l-2 border-r-2 border-slate-200">
            <ChatComponent chatId={chatId} />
          </div>
        </div>
      </div>
    );
  }

  // Layout adaptado para dispositivos móveis
  return (
    <div className="flex max-h-screen overflow-y-auto scrollbar-none relative">
      {/* Botão do menu hambúrguer */}
      <button
        className="absolute top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-md shadow-lg"
        onClick={() => setShowSidebar(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar no mobile */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="absolute left-0 top-0 z-30 w-64 h-full bg-white shadow-md">
            {/* Botão para fechar a Sidebar */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-900">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button
                className="p-2 text-gray-700 hover:text-black"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo da Sidebar */}
            <ChatSideBar chats={chats} chatId={chatId} isPro={isPro} />
          </div>
        </div>
      )}

      {/* Chat e PDF */}
      <div className="flex w-full max-h-screen overflow-y-auto scrollbar-none">
        {/* Ocultar PDF Viewer no mobile */}
        <div className="flex-[3] w-full">
          <ChatComponent chatId={chatId} />
        </div>
      </div>
    </div>
  );
}
