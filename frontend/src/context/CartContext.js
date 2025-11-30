import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("guestCart");
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id && item.size === size);
      if (existing) {
        return prev.map(item => item.productId === product._id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, image: product.image, size, quantity: 1 }];
    });
  };

  const updateQty = (productId, size, quantity) => {
    setCart(prev => prev.map(item => item.productId === productId && item.size === size ? { ...item, quantity } : item));
  };

  const removeItem = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
