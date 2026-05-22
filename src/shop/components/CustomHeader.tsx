import { useRef, type KeyboardEvent } from 'react';
import { LogOutIcon, Search, SettingsIcon, UserIcon, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, useParams, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { CustomLogo } from '@/components/custom/CustomLogo';

import { useAuthStore } from '@/auth/store/auth.store';
import { useCartStore } from '@/shop/store/cart.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CustomHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authStatus, isAdmin, logout, user } = useAuthStore();
  const { getItemCount } = useCartStore();
  const userFirstName = user?.nombre;
  const cartCount = getItemCount();

  const { gender } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    const query = inputRef.current?.value;

    const newSearchParams = new URLSearchParams();

    if (!query) {
      newSearchParams.delete('query');
    } else {
      newSearchParams.set('query', inputRef.current!.value);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <CustomLogo />

          {/* Navigation - Desktop */}
          {authStatus === 'authenticated' && (

            <>
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className={cn(
                    `text-sm font-medium transition-colors hover:text-primary`,
                    !gender ? 'underline underline-offset-4' : ''
                  )}
                >
                  Todos
                </Link>
                <Link
                  to="/gender/men"
                  className={cn(
                    `text-sm font-medium transition-colors hover:text-primary`,
                    gender === 'men' ? 'underline underline-offset-4' : ''
                  )}
                >
                  Hombres
                </Link>
                <Link
                  to="/gender/women"
                  className={cn(
                    `text-sm font-medium transition-colors hover:text-primary`,
                    gender === 'women' ? 'underline underline-offset-4' : ''
                  )}
                >
                  Mujeres
                </Link>
                <Link
                  to="/gender/kid"
                  className={cn(
                    `text-sm font-medium transition-colors hover:text-primary`,
                    gender === 'kid' ? 'underline underline-offset-4' : ''
                  )}
                >
                  Niños
                </Link>
                {/* RNF-2: Opción Compra de artículos */}
                <Link
                  to="/shop"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Compra de artículos
                </Link>
                {/* RNF-2: Opción Captura de artículo (Admin) */}
                {isAdmin() && (
                  <Link
                    to="/admin/products/new"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Captura de artículo
                  </Link>
                )}
              </nav>
            </>
          )}
          <div className="flex items-center space-x-4">
            {authStatus === 'authenticated' && (

              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Buscar productos..."
                    className="pl-9 w-64 h-9 bg-white"
                    onKeyDown={handleSearch}
                    defaultValue={query}
                  />
                </div>
              </div>

            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Carrito de compras */}
            {authStatus === 'authenticated' && (
              <Link to="/shop/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

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
                      <AvatarImage src="/placeholder.svg" alt="shadcn" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                {/* CONTENT */}
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{userFirstName}</DropdownMenuLabel>
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
