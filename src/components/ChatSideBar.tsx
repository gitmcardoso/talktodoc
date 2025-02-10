'use client'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle, Home, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubscriptionButton from './SubscriptionButton'

type Props = {
    chats: DrizzleChat[],
    chatId: number,
    isPro: boolean;
}

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  return (
    <div className='w-full h-screen flex flex-col bg-gray-900 overflow-hidden'>
      {/* Área rolável principal */}
      <div className='p-4 overflow-y-auto flex-1'>
        <Link href='/' className='block mb-4'>
            <Button className='w-full border-dashed border-white border'>
                <PlusCircle className="mr-2 w-4 h-4"/>
                New Chat
            </Button>
        </Link>

        <div className="flex flex-col gap-2">
            {chats.map(chat => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className={ 
                        cn('rounded-lg p-3 text-slate-300 flex items-center max-w-full', {
                            'bg-blue-600': chat.id === chatId,
                            'hover:text-white': chat.id === chatId,
                        })
                    }>
                        <MessageCircle className="mr-2 min-w-4" />
                        <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap'>
                            {chat.pdfName}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
      </div>

      {/* Área fixa inferior */}
      <div className='sticky bottom-0 border-t border-gray-700 bg-gray-900 z-10'>
        <div className='p-6 flex flex-col gap-4'>
            <div className='flex justify-between items-center text-sm text-slate-400'>
                <Link href='/' className="flex items-center gap-2 hover:text-white flex-1 justify-center">
                    <Home className="w-4 h-4"/>
                    <span className='hidden sm:inline'>Home</span>
                </Link>
                <Link href='/' className="flex items-center gap-2 hover:text-white flex-1 justify-center">
                    <Search className="w-4 h-4"/>
                    <span className='hidden sm:inline'>Search</span>
                </Link>
            </div>
            
            <div className='w-full'>
                <SubscriptionButton isPro={isPro} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSideBar