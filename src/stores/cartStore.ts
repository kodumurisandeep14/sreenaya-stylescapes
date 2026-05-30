import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartItem {
  lineId: string | null; // Kept for compatibility if needed later, but local cart uses variantId
  product: Product;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        
        set({ isLoading: true });
        // Simulate a tiny delay for UX
        await new Promise(res => setTimeout(res, 200));

        if (existing) {
          set({ items: items.map((i) => i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i) });
        } else {
          set({ items: [...items, { ...item, lineId: item.variantId }] }); // Use variantId as lineId locally
        }
        
        set({ isLoading: false });
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { items } = get();
        
        set({ items: items.map((i) => i.variantId === variantId ? { ...i, quantity } : i) });
      },

      removeItem: async (variantId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.variantId !== variantId) });
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      
      getCheckoutUrl: () => "/checkout",

      syncCart: async () => {
        // No-op for local cart. Will be implemented when syncing with Supabase carts table.
      },
    }),
    {
      name: "sreenaya-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
