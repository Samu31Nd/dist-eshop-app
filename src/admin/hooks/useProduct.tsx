import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductByIdAction } from '../actions/get-product-by-id.action';
import { createUpdateProductAction } from '../actions/create-update-product.action';
import type { Articulo } from '@/interfaces/articulo.interface';

export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProductByIdAction(id === 'new' ? 'new' : Number(id)),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (input: Partial<Articulo> & { file?: File }) =>
      createUpdateProductAction(input),

    onSuccess: (articulo: Articulo) => {
      // Invalidar lista de productos para que recargue al volver
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Actualizar la entrada individual en caché
      queryClient.setQueryData(
        ['product', { id: String(articulo.id_articulo) }],
        articulo
      );
    },
  });

  return {
    ...query,
    mutation,
  };
};