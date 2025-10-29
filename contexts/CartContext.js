import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{id,title,price,thumbnail,qty}]
  const STORAGE_KEY = "CART_V1";

  // load từ storage khi khởi động
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  // persist mỗi khi items đổi
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const add = (product) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: Math.min(p.qty + 1, 99) } : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || product.images?.[0],
          qty: 1,
        },
      ];
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  const updateQty = (id, qty) => {
    const q = Math.max(1, Math.min(99, parseInt(qty || 1, 10)));
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: q } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const clear = () => setItems([]);
  const totalItems = items.reduce((s, it) => s + it.qty, 0);
  const totalPrice = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        updateQty,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
