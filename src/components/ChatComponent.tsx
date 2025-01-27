'use client';

import React, { useState, useEffect } from 'react';
import { Message } from 'ai/react';
import MessageList from '@/components/MessageList'; // Importa o componente MessageList
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Função para criar o estilo da animação dos pontos
const createDotStyle = (delay: number) => ({
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'gray',
  margin: '0 3px',
  animation: `bounce 1s infinite`,
  animationDelay: `${delay}s`,
});

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false); // Novo estado para controlar o status de digitação

  // Use o useQuery para buscar as mensagens salvas
  const { data, isLoading } = useQuery<Message[], unknown>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {
        chatId,
      });

      // Mapear 'system' para 'assistant' ou 'user'
      return response.data.map((msg) => ({
        ...msg,
        role: msg.role as 'assistant' | 'user' | 'system', // Garante que o tipo esteja correto
      }));
    },
  });

  // Atualiza as mensagens quando os dados são carregados
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    // Exibe a mensagem do usuário enquanto aguarda a resposta
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsAssistantTyping(true); // Inicia a animação de digitação

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a mensagem');
      }

      const data = await response.json();

      const systemMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, systemMessage]);

      setIsAssistantTyping(false); // Para a animação quando a mensagem for recebida
    } catch (error) {
      console.error('Erro no chat:', error);
      setIsAssistantTyping(false); // Para a animação em caso de erro
    }
  };

  // UseEffect para rolar a tela para a última mensagem
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="relative max-h-screen overflow-scroll" id="message-container">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit flex justify-center">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Message list */}
      <div className="mb-10"> {/* Adiciona margem inferior à lista de mensagens */}
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Exibe a animação de três pontos se o assistente estiver digitando */}
      {isAssistantTyping && (
        <div className="p-2 mt-2 bg-gray-100 rounded-md">
          <span className="font-semibold">Assistente:</span>
          <div className="inline-block">
            <div style={createDotStyle(0)} />
            <div style={createDotStyle(0.2)} />
            <div style={createDotStyle(0.4)} />
          </div>
        </div>
      )}

      {/* Input and button */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
