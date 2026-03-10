import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;

  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Store zustand pour gérer le panier d'achat de l'utilisateur
export const useCartStore = create<CartStore>()(
  persist(
    (set) => {
      // Fonction interne PRO pour recalculer les totaux
      const recalcTotals = (items: CartItem[]) => {
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        return { totalPrice, totalItems };
      };

      return {
        items: [],
        totalPrice: 0,
        totalItems: 0,

        // -----------------------------
        // ADD ITEM
        // -----------------------------
        addItem: (product, quantity) => {
          set((state) => {
            const existing = state.items.find(
              (item) => item.productId === product.id
            );

            let newItems;

            if (existing) {
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

            return {
              items: newItems,
              ...recalcTotals(newItems),
            };
          });
        },

        // -----------------------------
        // REMOVE ITEM
        // -----------------------------
        removeItem: (productId) => {
          set((state) => {
            const newItems = state.items.filter(
              (item) => item.productId !== productId
            );

            return {
              items: newItems,
              ...recalcTotals(newItems),
            };
          });
        },

        // -----------------------------
        // UPDATE QUANTITY
        // -----------------------------
        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) return;

          set((state) => {
            const newItems = state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            );

            return {
              items: newItems,
              ...recalcTotals(newItems),
            };
          });
        },

        // -----------------------------
        // CLEAR CART
        // -----------------------------
        clearCart: () => {
          set({
            items: [],
            totalPrice: 0,
            totalItems: 0,
          });
        },
      };
    },
    {
      name: "cart-store",
    }
  )
);