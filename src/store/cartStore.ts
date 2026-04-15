import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (product: string) => void;
  updateQuantity: (product: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product === item.product
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + 1,
            };
            toast.success('Quantity updated in cart');
            return { items: updatedItems };
          }

          toast.success('Added to cart');
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (product) => {
        set((state) => ({
          items: state.items.filter((i) => i.product !== product),
        }));
        toast.success('Item removed from cart');
      },

      updateQuantity: (product, quantity) => {
        if (quantity < 1) {
          get().removeItem(product);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.product === product ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },
    }),
    {
      name: 'aghaz-cart-storage',
    }
  )
);
