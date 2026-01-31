import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, X } from "lucide-react";
import { createOrder } from "@/lib/services/orderService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CheckoutProps {
    cartItems: CartItem[];
    onRemove: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onClose: () => void;
    onSuccess: () => void;
}

export default function Checkout({ cartItems, onRemove, onUpdateQuantity, onClose, onSuccess }: CheckoutProps) {
    const totalRequest = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = totalRequest;

    const { mutate: processOrder, isPending } = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            toast.success("Pesanan berhasil dibuat!");
            onSuccess();
        },
        onError: (error) => {
            toast.error("Gagal membuat pesanan: " + error.message);
        }
    });

    const handlePayment = () => {
        processOrder({
            total_price: total,
            customer_name: "Guest",
            items: cartItems.map(item => ({
                menu_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    };

    return (
        <div className="h-screen w-[400px] border-l border-gray-200 bg-background shadow-xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Checkout</h1>
                    <p className="text-sm text-muted-foreground">Order Details</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No items in cart
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground"> Rp {item.price.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    onClick={() => onRemove(item.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 border-t bg-muted/50 space-y-4">
                <div className="space-y-2">


                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString()}</span>
                    </div>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={cartItems.length === 0 || isPending}
                    onClick={handlePayment}
                >
                    {isPending ? "Processing..." : "Process Payment"}
                </Button>
            </div>
        </div>
    )
}