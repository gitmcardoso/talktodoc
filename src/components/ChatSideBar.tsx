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
    <div className='w-full h-screen flex flex-col justify-between bg-gray-900'>
      <div className='p-4 overflow-y-auto'>
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

      <div className='p-7 border-t border-gray-700'>
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center text-sm text-slate-400'>
                <Link href='/' className="flex items-center gap-2 hover:text-white">
                    <Home className="w-4 h-4"/>
                    <span>Home</span>
                </Link>
                <Link href='/' className="flex items-center gap-2 hover:text-white">
                    <Search className="w-4 h-4"/>
                    <span>Search</span>
                </Link>
            </div>
            
            <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    </div>
  )
}

export default ChatSideBar