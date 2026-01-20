// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      totalPrice: 0,

      // Action: Add Item
      addToCart: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);

        if (existingItem) {
          // If item exists, just increase quantity
          const updatedCart = currentCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          set({ 
            cart: updatedCart,
            totalPrice: get().totalPrice + Number(item.price) 
          });
        } else {
          // If new item, add to array with quantity 1
          set({ 
            cart: [...currentCart, { ...item, quantity: 1 }],
            totalPrice: get().totalPrice + Number(item.price)
          });
        }
      },

      // Action: Remove Item (Decrease quantity or delete)
      removeFromCart: (itemId) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === itemId);

        if (!existingItem) return;

        let updatedCart;
        if (existingItem.quantity > 1) {
          updatedCart = currentCart.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          updatedCart = currentCart.filter((i) => i.id !== itemId);
        }

        set({ 
          cart: updatedCart,
          totalPrice: get().totalPrice - Number(existingItem.price)
        });
      },

      // Action: Clear Cart
      clearCart: () => set({ cart: [], totalPrice: 0 }),

      // Selector: Get total items count (for the Navbar badge)
      cartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'swirls-cart-storage', // Key for localStorage
    }
  )
);

export default useCartStore;