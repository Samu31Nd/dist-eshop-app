import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useProduct } from '@/admin/hooks/useProduct';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { ProductForm } from './ui/ProductForm';
import type { Articulo } from '@/interfaces/articulo.interface';

export const AdminProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data: product, mutation } = useProduct(id || '');

  const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const subtitle = id === 'new' ? 'Crea un nuevo artículo en el catálogo.' : 'Edita los datos del artículo.';

  const handleSubmit = async (input: Partial<Articulo> & { file?: File }) => {
    await mutation.mutateAsync(input, {
      onSuccess: (data) => {
        toast.success('Producto guardado correctamente', { position: 'top-right' });
        // Tomcat no devuelve el id_articulo real al crear (devuelve 0),
        // así que volvemos al listado en vez de navegar al detalle
        if (data.id_articulo && data.id_articulo !== 0) {
          navigate(`/admin/products/${data.id_articulo}`);
        } else {
          navigate('/admin/products');
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error('Error al guardar el producto');
      },
    });
  };

  if (isError) return <Navigate to="/admin/products" />;
  if (isLoading) return <CustomFullScreenLoading />;
  if (!product) return <Navigate to="/admin/products" />;

  return (
    <ProductForm
      title={title}
      subTitle={subtitle}
      product={product}
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
    />
  );
};