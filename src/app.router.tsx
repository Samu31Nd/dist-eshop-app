import { lazy } from 'react';
import { createHashRouter, Navigate } from 'react-router';

import { ShopLayout } from './shop/layouts/ShopLayout';
import { HomePage } from './shop/pages/home/HomePage';
import { ProductPage } from './shop/pages/product/ProductPage';
import { GenderPage } from './shop/pages/gender/GenderPage';
import { ShopPage } from './shop/pages/shop/ShopPage';
import { CartPage } from './shop/pages/cart/CartPage';

import { LoginPage } from './auth/pages/login/LoginPage';
import { RegisterPage } from './auth/pages/register/RegisterPage';

import { DashboardPage } from './admin/pages/dashboard/DashboardPage';
import { AdminProductPage } from './admin/pages/product/AdminProductPage';
import { AdminProductsPage } from './admin/pages/products/AdminProductsPage';

import {
  AdminRoute,
  AuthenticatedRoute,
  NotAuthenticatedRoute,
} from './components/routes/ProtectedRoutes';
import { ProfilePage } from './profile/pages/Profile/ProfilePage';
import { ProfileEditPage } from './profile/pages/EditProfile/ProfileEditPage';

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const ProfileLayout = lazy(() => import('./profile/layouts/ProfileLayout'));

export const appRouter = createHashRouter([
  // export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product/:idSlug',
        element: <ProductPage />,
      },
      {
        path: 'gender/:gender',
        element: <GenderPage />,
      },
      // RF-FE-2: Compra de artículos
      {
        path: 'shop',
        element: <ShopPage />,
      },
      // RF-FE-2.3: Carrito de compra
      {
        path: 'shop/cart',
        element: <CartPage />,
      },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    element: (
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'products/:id',
        element: <AdminProductPage />,
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <AuthenticatedRoute>
        <ProfileLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfilePage />
      },
      {
        path: '/profile/edit',
        element: <ProfileEditPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
