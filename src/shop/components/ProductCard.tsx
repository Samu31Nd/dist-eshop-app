import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  foto: string | null;
}

export const ProductCard = ({
  nombre,
  descripcion,
  precio,
  cantidad,
  foto,
}: ProductCardProps) => {
  return (
    <Card className="group border-0 shadow-none product-card-hover cursor-pointer">
      <CardContent className="p-0">
        {
          foto && (

            <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
              <img src={foto} alt={nombre}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="image-overlay" />
            </div>
          )
        }

        <div className="pt-6 px-4 pb-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm tracking-tight">{nombre}</h3>
            <p className="text-xs text-muted-foreground uppercase">
              {cantidad} - <span className="font-bold">{descripcion}</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">${precio}</p>
            <Button
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground border-primary/20 text-xs px-4 py-2 h-8"
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
