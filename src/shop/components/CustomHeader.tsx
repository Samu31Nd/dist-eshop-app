import { useRef, type KeyboardEvent } from 'react';
import { LogOutIcon, Search, SettingsIcon, UserIcon, ShoppingCart, PackagePlus, Store, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams } from 'react-router';
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

          {/* SECCIÓN IZQUIERDA: Menú Móvil + Logo + Navegación Desktop */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* Navegación - Móvil (Menú Hamburguesa) */}
            {authStatus === 'authenticated' && (
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <Link to="/shop">
                      <DropdownMenuItem className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Comprar artículos</span>
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin/products/new">
                        <DropdownMenuItem className="cursor-pointer">
                          <PackagePlus className="mr-2 h-4 w-4" />
                          <span>Capturar artículo</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Logo */}
            <CustomLogo />

            {/* Navegación - Desktop */}
            {authStatus === 'authenticated' && (
              <nav className="hidden md:flex items-center space-x-2">
                <Link to="/shop">
                  <Button className="text-sm font-medium">
                    <Store className="mr-2 h-4 w-4" />
                    Comprar artículos
                  </Button>
                </Link>
                {isAdmin() && (
                  <Link to="/admin/products/new">
                    <Button variant="ghost" className="text-sm font-medium">
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Capturar artículo
                    </Button>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* SECCIÓN DERECHA: Buscador + Carrito + Perfil */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {authStatus === 'authenticated' && (
              <div className="hidden md:flex items-center">
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

            {/* Icono de búsqueda para móviles (funcionalidad pendiente según tu diseño original) */}
            {authStatus === 'authenticated' && (
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Carrito de compras */}
            {authStatus === 'authenticated' && (
              <Link to="/shop/cart" className="relative mt-1">
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
              <Link to="/auth/login">
                <Button variant="default">Login</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.foto ? `data:image/jpeg;base64,${user.foto}` : '/placeholder.svg'} alt="Avatar del usuario" />
                      <AvatarFallback>
                        {userFirstName ? userFirstName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{userFirstName || 'Usuario'}</DropdownMenuLabel>
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin">
                        <DropdownMenuItem className="cursor-pointer">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          Administración
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Cerrar sesión
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
