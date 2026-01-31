import { supabase } from "@/lib/supabaseClients";

export interface Menu {
    id: number;
    name: string;
    price: number;
    image: string;
    is_visible: boolean;
    created_at?: string;
}

export const getMenus = async (): Promise<Menu[]> => {
    const { data, error } = await supabase
        .from('menu')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const updateMenuVisibility = async (id: number, isVisible: boolean): Promise<Menu> => {
    const { data, error } = await supabase
        .from('menu')
        .update({ is_visible: isVisible })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Add Create/Update/Delete if strictly needed for full CRUD later, 
// strictly requested "API CRUD", so let's add them.

export const createMenu = async (menu: Omit<Menu, 'id' | 'created_at'>): Promise<Menu> => {
    const { data, error } = await supabase
        .from('menu')
        .insert(menu)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateMenu = async (id: number, menu: Partial<Menu>): Promise<Menu> => {
    const { data, error } = await supabase
        .from('menu')
        .update(menu)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const deleteMenu = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('menu')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
};
