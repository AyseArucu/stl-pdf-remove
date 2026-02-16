'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

import { getActiveDiscount } from '@/app/actions';
import type { Discount, Product } from '@prisma/client';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type CartItem = ProductDTO & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product | ProductDTO) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: number;
    shippingTotal: number;
    discount?: Discount | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState<Discount | null>(null);

    // See FavoritesContext for user logic context
    const { user } = useUser();

    // Load from server or local storage on mount/user change
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                try {
                    const { getCart } = await import('@/app/actions');
                    const serverCart = await getCart();
                    if (serverCart && serverCart.items) {
                        setItems(serverCart.items.map((item: any) => ({
                            ...item.product,
                            quantity: item.quantity,
                            // Ensure we use the cart item price snapshot or current product price?
                            // Usually cart reflects snapshot, but for simplicity let's stick to product + qty
                        })));
                    }
                } catch (e) {
                    console.error('Failed to load server cart', e);
                }
            } else {
                const saved = localStorage.getItem('cart');
                if (saved) {
                    setItems(JSON.parse(saved));
                }
            }

            // Fetch active discount
            getActiveDiscount().then(d => setDiscount(d));
        };
        loadCart();
    }, [user]);

    // Save to local storage on change (only if guest)
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, user]);

    const addToCart = async (product: Product | ProductDTO) => {
        // Optimistic update
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...product, quantity: 1 }];
        });

        if (user) {
            try {
                const { addToCartServer } = await import('@/app/actions');
                await addToCartServer(product.id, 1);
            } catch (e) {
                console.error('Server add to cart failed', e);
            }
        }

        alert('Ürün sepete eklendi!');
    };

    const removeFromCart = async (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));

        if (user) {
            try {
                const { removeFromCartServer } = await import('@/app/actions');
                await removeFromCartServer(id);
            } catch (e) {
                console.error('Server remove from cart failed', e);
            }
        }
    };

    const clearCart = async () => {
        setItems([]);
        if (user) {
            try {
                const { clearCartServer } = await import('@/app/actions');
                await clearCartServer();
            } catch (e) {
                console.error('Server clear cart failed', e);
            }
        }
    };


    // Shipping Calculation
    const [shippingSettings, setShippingSettings] = useState<{ cost: number; threshold: number | null; isActive: boolean }>({ cost: 0, threshold: null, isActive: false });

    useEffect(() => {
        const loadShipping = async () => {
            const { getShippingSettings } = await import('@/app/actions');
            const res = await getShippingSettings();
            if (res.success && res.settings) {
                setShippingSettings({
                    cost: res.settings.shippingCost,
                    threshold: res.settings.freeShippingThreshold,
                    isActive: res.settings.isActive
                });
            }
        };
        loadShipping();
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = discount ? (subtotal * discount.percentage) / 100 : 0;

    // Shipping Logic
    const hasPaidShippingItem = items.some(item => !item.freeShipping);
    const isFreeShippingByThreshold = shippingSettings.threshold !== null && subtotal >= shippingSettings.threshold;

    let shippingTotal = 0;
    if (shippingSettings.isActive && hasPaidShippingItem && !isFreeShippingByThreshold) {
        shippingTotal = shippingSettings.cost;
    }

    const total = subtotal - discountAmount + shippingTotal;

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, discount, shippingTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
