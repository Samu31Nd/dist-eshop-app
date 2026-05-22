import { LogOutIcon, Search, SettingsIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { CustomLogo } from '@/components/custom/CustomLogo';

import { useAuthStore } from '@/auth/store/auth.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CustomHeaderProfile = () => {
  const { authStatus, isAdmin, logout, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <CustomLogo />

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {authStatus === 'not-authenticated' ? (
              // ? No autenticado
              <Link to="/auth/login">
                <Button variant="default">Login</Button>
              </Link>
            ) : (
              // ? Opciones de perfil
              <DropdownMenu>
                {/* PERFIL DROPDOWN */}
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.foto ? `data:image/jpeg;base64,${user.foto}` : '/placeholder.svg'} alt="Avatar del usuario" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                {/* CONTENT */}
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user?.nombre}</DropdownMenuLabel>
                    <Link to="/profile">
                      <DropdownMenuItem>
                        <UserIcon />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin() && (
                      <Link to='/admin'>
                        <DropdownMenuItem>
                          <SettingsIcon />
                          Admin
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
