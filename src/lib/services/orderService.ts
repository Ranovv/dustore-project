import { supabase } from "@/lib/supabaseClients";

export interface OrderItem {
    menu_id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface CreateOrderPayload {
    customer_name?: string;
    total_price: number;
    items: OrderItem[];
}

export const createOrder = async (order: CreateOrderPayload) => {
    // 1. Insert Order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: order.customer_name || 'Guest',
            total_price: order.total_price,
            status: 'pending'
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // 2. Insert Items
    const itemsToInsert = order.items.map(item => ({
        order_id: orderData.id,
        menu_id: item.menu_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        // Optional: rollback order if items fail, but Supabase doesn't support transactions in JS client easily w/o RPC
        console.error("Error creating order items:", itemsError);
        throw itemsError;
    }

    return orderData;
};

export interface Order {
    id: number;
    customer_name: string;
    total_price: number;
    status: string;
    created_at: string;
    order_items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
}

export const getOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                name,
                price,
                quantity
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

