import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, User as UserIcon, Heart, MessageCircle } from 'lucide-react';

import { useAppDispatch } from '@/store/store';
import { logout } from '@/features/auth/authSlice';
import { S3_URL } from '@/consts';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogoutMutation } from '@/services/auth';
import type { User } from '@/features/types';

export function AvatarMenu({ user }: { user: User | null }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/email');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const preventClose = (e: Event) => e.preventDefault();

  if (!user) return null;

  console.log(`${S3_URL}/${user.picture}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='relative h-9 w-9 cursor-pointer border-1 border-black dark:border-white'>
          <AvatarImage
            src={`${S3_URL}/${user.picture}`}
            alt={'User Avatar'}
            className='object-cover'
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 mt-4'
        align='end'
        forceMount>
        <DropdownMenuGroup>
          {/* profile */}
          <DropdownMenuItem asChild>
            <Link
              to='/profile'
              className='cursor-pointer'>
              <UserIcon className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/* wishlist */}
          <DropdownMenuItem
            onSelect={preventClose}
            className='flex justify-between'>
            <div className='flex items-center'>
              <Heart className='mr-2 h-4 w-4' />
              <span>Wishlists</span>
            </div>
          </DropdownMenuItem>
          {/* chat */}
          <DropdownMenuItem
            onSelect={preventClose}
            className='flex justify-between'>
            <div className='flex items-center'>
              <MessageCircle className='mr-2 h-4 w-4' />
              <span>Chats</span>
            </div>
          </DropdownMenuItem>
          {/* settings */}
          <DropdownMenuItem
            onSelect={preventClose}
            className='flex justify-between'>
            <div className='flex items-center'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* separator */}
        <DropdownMenuSeparator />
        {/* logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className='text-destructive focus:bg-destructive/10 focus:text-destructive'>
          <LogOut className='mr-2 h-4 w-4 text-destructive' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
