import { ChatDrawer } from '@/components/chat/ChatDrawer';

export default function ChatPage() {
  return (
    <div className='h-screen flex flex-col bg-background'>
      <header className='p-4 border-b flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Chats</h1>
      </header>
      <main className='flex-grow overflow-y-auto'>
        <ChatDrawer />
      </main>
    </div>
  );
}
