import { ShoppingCart, Trash2, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useCartStore } from "@/shop/store/cart.store";
import { CustomJumbotron } from "@/shop/components/CustomJumbotron";

export const CartPage = () => {
  const { items, getTotal, removeFromCart, clearCart, isLoading } =
    useCartStore();

  const total = getTotal();

  // RF-FE-2.4: Eliminar artículo del carrito
  const handleRemoveItem = async (id_articulo: number, nombre: string) => {
    const success = await removeFromCart(id_articulo);
    if (success) {
      toast.success(`${nombre} eliminado del carrito`);
    } else {
      toast.error("Error al eliminar el articulo");
    }
  };

  // RF-FE-2.5: Eliminar todo el carrito
  const handleClearCart = async () => {
    const success = await clearCart();
    if (success) {
      toast.success("Carrito vaciado correctamente");
    } else {
      toast.error("Error al vaciar el carrito");
    }
  };

  return (
    <>
      <CustomJumbotron title="Articulos en el Carrito" />

      <section className="py-8 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* RF-FE-2.5: Botón seguir comprando */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/shop">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Seguir comprando
              </Button>
            </Link>

            {items.length > 0 && (
              // RF-FE-2.5: Botón eliminar carrito
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar carrito
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Vaciar carrito</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta accion eliminara todos los articulos de tu carrito de
                      compra. Los articulos regresaran al stock disponible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearCart}>
                      Vaciar carrito
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Lista de items */}
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Tu carrito esta vacio
              </h3>
              <p className="text-muted-foreground mb-6">
                Busca articulos y agregalos a tu carrito
              </p>
              <Link to="/shop">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Ir a comprar
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* RF-FE-2.3: Lista de artículos en el carrito */}
              {items.map((item) => (
                <Card key={item.id_articulo}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Imagen pequeña */}
                      {item.foto && (
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.foto}
                            alt={item.nombre}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Info del artículo */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.descripcion}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Cantidad: <strong>{item.cantidad}</strong>
                          </span>
                          <span className="text-muted-foreground">
                            Precio: <strong>${item.precio.toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Costo (cantidad x precio) y botón eliminar */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-lg">
                          ${(item.cantidad * item.precio).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.cantidad} x ${item.precio.toFixed(2)}
                        </p>

                        {/* RF-FE-2.4: Botón eliminar artículo */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            handleRemoveItem(item.id_articulo, item.nombre)
                          }
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Total */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">
                        {items.length} articulo(s) en el carrito
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total de la compra</p>
                      <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
