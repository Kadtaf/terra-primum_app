import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;

  // Actions
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalPrice: 0,
      totalItems: 0,

      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id);

          let newItems;
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
              },
            ];
          }

          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            items: newItems,
            totalPrice,
            totalItems,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            items: newItems,
            totalPrice,
            totalItems,
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return state;
          }

          const newItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );

          const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            items: newItems,
            totalPrice,
            totalItems,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalPrice: 0,
          totalItems: 0,
        });
      },

      calculateTotals: () => {
        set((state) => {
          const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

          return {
            totalPrice,
            totalItems,
          };
        });
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
