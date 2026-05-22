import { AdminTitle } from '@/admin/components/AdminTitle';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { Articulo } from '@/interfaces/articulo.interface';
import { currencyFormatter } from '@/lib/currency-formatter';
import { useProducts } from '@/shop/hooks/useProducts';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { Link } from 'react-router';

export const AdminProductsPage = () => {
  const { data, isLoading } = useProducts();

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  // data es Articulo[] directamente (no data.products)
  const articulos: Articulo[] = data ?? [];


  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle
          title="Productos"
          subtitle="Aquí puedes ver y administrar tus productos"
        />
        <div className="flex justify-end mb-10 gap-4">
          <Link to="/admin/products/new">
            <Button>
              <PlusIcon />
              Nuevo producto
            </Button>
          </Link>
        </div>
      </div>

      <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articulos.map((articulo) => (
            <TableRow key={articulo.id_articulo}>
              <TableCell>
                {articulo.foto
                  ? <img src={articulo.foto} alt={articulo.nombre} className="w-20 h-20 object-cover rounded-md" />
                  : <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">Sin foto</div>
                }
              </TableCell>
              <TableCell>
                <Link
                  to={`/admin/products/${articulo.id_articulo}`}
                  className="hover:text-blue-500 underline"
                >
                  {articulo.nombre}
                </Link>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                {articulo.descripcion}
              </TableCell>
              <TableCell>{currencyFormatter(articulo.precio)}</TableCell>
              <TableCell>{articulo.cantidad} en stock</TableCell>
              <TableCell className="text-right">
                <Link to={`/admin/products/${articulo.id_articulo}`}>
                  <PencilIcon className="w-4 h-4 text-blue-500" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
