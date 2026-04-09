// ===========================================
// Cart Context
// ===========================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(async (item) => {
    try {
      setLoading(true);
      const { data } = await cartAPI.addItem(item);
      if (data.success) {
        setCart(data.data);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId, updates) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, updates);
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Update cart error:', error);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  }, []);

  const cartCount = cart.items?.length || 0;
  const cartTotal = cart.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount,
      cartTotal,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
