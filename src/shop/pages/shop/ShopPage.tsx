import { useState, useRef, type KeyboardEvent } from "react";
import { Search, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getProductsAction } from "@/shop/actions/get-products.action";
import { useCartStore } from "@/shop/store/cart.store";
import { CustomJumbotron } from "@/shop/components/CustomJumbotron";
import type { Articulo } from "@/interfaces/articulo.interface";

export const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { addToCart, getItemCount, isLoading: cartLoading } = useCartStore();
  const cartCount = getItemCount();

  // RF-BE-2: consulta_articulos con palabra clave
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products", activeQuery],
    queryFn: () => getProductsAction({ query: activeQuery }),
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    setActiveQuery(inputRef.current?.value || "");
  };

  const handleSearchClick = () => {
    setActiveQuery(searchQuery);
  };

  // RF-FE-2.2: Comprar artículo
  const handleBuy = async (articulo: Articulo, cantidad: number) => {
    if (cantidad < 1) {
      toast.error("La cantidad debe ser al menos 1");
      return;
    }
    if (cantidad > articulo.cantidad) {
      toast.error("No hay suficientes artículos en stock");
      return;
    }

    const success = await addToCart(
      {
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        precio: articulo.precio,
        cantidad: 0,
        foto: articulo.foto,
      },
      cantidad
    );

    if (success) {
      toast.success(`${articulo.nombre} agregado al carrito`);
    } else {
      toast.error("Error al agregar al carrito");
    }
  };

  return (
    <>
      <CustomJumbotron title="Compra de Articulos" />

      <section className="py-8 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Barra de búsqueda y carrito */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Buscar articulos (ej: cafe, laptop)..."
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <Button onClick={handleSearchClick} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            {/* RF-FE-2.3: Botón Carrito de compra */}
            <Link to="/shop/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito de compra
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Resultados */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No se encontraron articulos
              </h3>
              <p className="text-muted-foreground">
                {activeQuery
                  ? `No hay resultados para "${activeQuery}"`
                  : "Ingresa una palabra clave para buscar articulos"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {products.length} articulo(s) encontrado(s)
                {activeQuery && ` para "${activeQuery}"`}
              </p>

              {/* RF-FE-2.1: Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((articulo) => (
                  <ShopProductCard
                    key={articulo.id_articulo}
                    articulo={articulo}
                    onBuy={handleBuy}
                    isLoading={cartLoading}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

// RF-FE-2.1: Card de producto con cantidad y botón comprar
interface ShopProductCardProps {
  articulo: Articulo;
  onBuy: (articulo: Articulo, cantidad: number) => void;
  isLoading: boolean;
}

const ShopProductCard = ({
  articulo,
  onBuy,
  isLoading,
}: ShopProductCardProps) => {
  const [cantidad, setCantidad] = useState(1);

  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        {articulo.foto && (
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={articulo.foto}
              alt={articulo.nombre}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-sm line-clamp-1">
              {articulo.nombre}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {articulo.descripcion}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">${articulo.precio.toFixed(2)}</p>
            <Badge variant={articulo.cantidad > 0 ? "secondary" : "destructive"}>
              {articulo.cantidad > 0
                ? `${articulo.cantidad} en stock`
                : "Agotado"}
            </Badge>
          </div>

          {/* Campo cantidad */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Cantidad:</label>
            <Input
              type="number"
              min={1}
              max={articulo.cantidad}
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-8 text-center"
              disabled={articulo.cantidad === 0}
            />
          </div>

          {/* RF-FE-2.2: Botón Compra */}
          <Button
            className="w-full"
            onClick={() => onBuy(articulo, cantidad)}
            disabled={isLoading || articulo.cantidad === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
