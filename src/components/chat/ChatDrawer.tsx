// src/components/chat/ChatDrawer.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/features/types';

const dummyUsers: User[] = [
  {
    id: '1',
    fullName: 'Kamron',
    picture: '/default-avatar.png',
    email: '',
    role: 'admin',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    fullName: 'Alice',
    picture: '/default-avatar.png',
    email: '',
    role: 'admin',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    fullName: 'Bob',
    picture: '/default-avatar.png',
    email: '',
    role: 'admin',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  },
];

export function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        className='fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg'
        onClick={() => setIsOpen(!isOpen)}>
        💬
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className='fixed bottom-20 right-6 w-80 h-96 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden'>
            {!activeUser ? (
              <div className='flex flex-col h-full'>
                <div className='p-3 font-semibold border-b'>Chats</div>
                <div className='flex-1 overflow-y-auto'>
                  {dummyUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setActiveUser(user)}
                      className='flex items-center gap-3 p-3 hover:bg-muted cursor-pointer'>
                      <img
                        src={user.picture || ''}
                        alt={user.fullName}
                        className='w-8 h-8 rounded-full border'
                      />
                      <span>{user.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex flex-col h-full'>
                <div className='flex items-center p-3 border-b'>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setActiveUser(null)}>
                    <ChevronLeft />
                  </Button>
                  <span className='ml-2 font-semibold'>{activeUser.fullName}</span>
                </div>
                <div className='flex-1 p-3 overflow-y-auto text-sm text-muted-foreground'>No messages yet.</div>
                <div className='p-3 border-t flex gap-2'>
                  <input
                    type='text'
                    placeholder='Type a message...'
                    className='flex-1 rounded-lg border border-input px-3 py-1 text-sm bg-background'
                  />
                  <Button size='sm'>Send</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
