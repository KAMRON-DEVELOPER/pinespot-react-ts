import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700'>
          <Bell className='h-5 w-5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-64'>
        <div className='px-3 py-2 font-semibold'>Notifications</div>
        <DropdownMenuItem className='text-muted-foreground'>No new notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
