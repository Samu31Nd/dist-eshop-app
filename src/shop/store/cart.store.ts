import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CarritoItem } from "@/interfaces/carrito.interface";
import {
  addToCartAction,
  removeFromCartAction,
  clearCartAction,
} from "@/shop/actions/cart.actions";

interface CartState {
  items: CarritoItem[];
  isLoading: boolean;

  // Computed
  getTotal: () => number;
  getItemCount: () => number;

  // Actions
  addToCart: (item: CarritoItem, cantidad: number) => Promise<boolean>;
  removeFromCart: (id_articulo: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  resetLocalCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      getTotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0);
      },

      addToCart: async (item, cantidad) => {
        set({ isLoading: true });
        try {
          const response = await addToCartAction(item.id_articulo, cantidad);
          if (response.mensaje === "OK") {
            const currentItems = get().items;
            const existingIndex = currentItems.findIndex(
              (i) => i.id_articulo === item.id_articulo
            );

            if (existingIndex >= 0) {
              // Ya existe, actualizar cantidad
              const updatedItems = [...currentItems];
              updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                cantidad: updatedItems[existingIndex].cantidad + cantidad,
              };
              set({ items: updatedItems, isLoading: false });
            } else {
              // Nuevo item
              set({
                items: [...currentItems, { ...item, cantidad }],
                isLoading: false,
              });
            }
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error("Error adding to cart:", error);
          set({ isLoading: false });
          return false;
        }
      },

      removeFromCart: async (id_articulo) => {
        set({ isLoading: true });
        try {
          const response = await removeFromCartAction(id_articulo);
          if (response.mensaje === "OK") {
            const updatedItems = get().items.filter(
              (i) => i.id_articulo !== id_articulo
            );
            set({ items: updatedItems, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error("Error removing from cart:", error);
          set({ isLoading: false });
          return false;
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          const response = await clearCartAction();
          if (response.mensaje === "OK") {
            set({ items: [], isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ isLoading: false });
          return false;
        }
      },

      resetLocalCart: () => {
        set({ items: [], isLoading: false });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
