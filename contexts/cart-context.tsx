'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Product } from '@/lib/data';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

interface CartContextValue {
	items: CartItem[];
	total: number;
	addItem: (product: Product, quantity?: number) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>(() => {
		try {
			const raw = localStorage.getItem('otres_cart');
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('otres_cart', JSON.stringify(items));
		} catch {}
	}, [items]);

	const addItem = (product: Product, quantity = 1) => {
		setItems((prev) => {
			const existing = prev.find((p) => p.id === product.id);
			if (existing) {
				return prev.map((p) =>
					p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p,
				);
			}

			// Make sure to include the image property
			const newItem: CartItem = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity,
				image: product.image || '/placeholder.jpg', // Provide a default image if none exists
			};

			return [...prev, newItem];
		});
	};

	const removeItem = (id: string) =>
		setItems((prev) => prev.filter((p) => p.id !== id));

	const updateQuantity = (id: string, quantity: number) => {
		setItems((prev) => {
			if (quantity <= 0) return prev.filter((p) => p.id !== id);
			return prev.map((p) => (p.id === id ? { ...p, quantity } : p));
		});
	};

	const clear = () => setItems([]);

	const total = useMemo(
		() => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
		[items],
	);

	return (
		<CartContext.Provider
			value={{ items, total, addItem, removeItem, updateQuantity, clear }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within a CartProvider');
	return ctx;
}
