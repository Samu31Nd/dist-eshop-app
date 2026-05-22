import { useAuthStore } from '@/auth/store/auth.store';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBannerLogin } from '@/shop/components/CustomBannerLogin';

import { CustomJumbotron } from '@/shop/components/CustomJumbotron';
import { ProductsGrid } from '@/shop/components/ProductsGrid';
import { useProducts } from '@/shop/hooks/useProducts';

export const HomePage = () => {
  const { authStatus } = useAuthStore()
  const isAuthenticated = authStatus === 'authenticated';
  const { data } = useProducts(isAuthenticated);

  return (
    <>

      {
        authStatus === 'authenticated' ? (
          <>
            <CustomJumbotron title="Todos los productos" />
            <ProductsGrid products={data || []} />
            <CustomPagination totalPages={1} />
          </>

        ) : (
          <CustomBannerLogin />
        )
      }
    </>
  );
};
