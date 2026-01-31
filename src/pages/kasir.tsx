import { CardImage } from "@/components/card-menu-and-orders";
import Checkout from "@/components/checkout";
import { useState } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Kasir() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const addToCart = (item: any) => {
        setIsCheckoutOpen(true);
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            })
        );
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 overflow-auto p-4">
                <CardImage onAddToCart={addToCart} mode="display" />
            </div>
            {isCheckoutOpen && (
                <Checkout
                    cartItems={cart}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={() => {
                        setCart([]);
                        setIsCheckoutOpen(false);
                    }}
                />
            )}
        </div>
    );
}