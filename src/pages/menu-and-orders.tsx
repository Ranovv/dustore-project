import { CardImage } from "@/components/card-menu-and-orders";
import { AddMenuFunction } from "@/components/add-menu-function";

export default function MenuAndOrders() {
    const addToCart = (item: any) => {
        console.log("Added to cart:", item);
        // Logic to add to global cart or handle interaction can be added here
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col">
            <div className="p-4 flex justify-between items-center border-b">
                <h1 className="text-2xl font-bold">Manajemen Menu</h1>
                <AddMenuFunction />
            </div>
            <div className="flex-1 overflow-auto p-4">
                <CardImage onAddToCart={addToCart} mode="admin" />
            </div>
        </div>
    );
}