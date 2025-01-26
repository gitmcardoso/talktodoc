import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2, Info, CheckCircle, HelpCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages: initialMessages, isLoading }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Mensagem inicial estilizada do assistente
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome-message",
      role: "assistant",
      content: `
**Bem-vindo ao Talk To Doc!**  
Eu sou o seu assistente virtual 🤖 e estou aqui para te ajudar a explorar este arquivo da melhor maneira possível 💡.  

**Exemplos de perguntas que você pode fazer:**

1.  👨‍💻 O que este arquivo contém?  

2.  👨‍💻 Como posso usar este conteúdo?  

3.  👨‍💻 Existem informações importantes que eu devo saber?  


**Estou à disposição para qualquer dúvida. Vamos começar!**`,
    };
    setMessages([welcomeMessage, ...initialMessages]);
  }, [initialMessages]);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return <></>;

  // Função para renderizar os ícones personalizados como texto
  const renderIcon = (icon: string) => {
    switch (icon) {
      case "checkCircle":
        return `<CheckCircle class="inline w-4 h-4 text-green-600" />`;
      case "info":
        return `<Info class="inline w-4 h-4 text-blue-600" />`;
      case "helpCircle":
        return `<HelpCircle class="inline w-4 h-4 text-gray-600" />`;
      default:
        return icon;
    }
  };

  // Função de substituição de conteúdo para ícones personalizados
  const processContent = (content: string) => {
    return content.replace(/<(\w+)>/g, (match, p1) => {
      return renderIcon(p1); // Substitui a tag personalizada pela string do ícone
    });
  };

  // Função para renderizar conteúdo Markdown com componentes customizados
  const renderMarkdownWithIcons = (content: string) => {
    // Usando a função ReactMarkdown para renderizar o conteúdo final
    return (
      <ReactMarkdown>
        {processContent(content)}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col gap-4 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-4 text-sm py-2 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                  "bg-gray-100 text-gray-800": message.role === "assistant",
                }
              )}
            >
              {/* Renderizando o conteúdo com Markdown e ícones embutidos */}
              {renderMarkdownWithIcons(message.content)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
