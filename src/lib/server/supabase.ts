
import { createClient } from '@supabase/supabase-js';
import { PRESETS } from '../../pages/api/admin/schema';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin Client (Secure, Server-side only)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Helper wrapper for generic table data
export const getTableData = async (tableName: string) => {
    let query = supabaseAdmin.from(tableName).select('*');

    // Default sorting
    const tablesWithCreatedAt = ['products', 'customers', 'orders', 'suppliers', 'discounts', 'containers'];
    if (tablesWithCreatedAt.includes(tableName.toLowerCase())) {
        query = query.order('created_at', { ascending: false });
    } else {
        query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

// Helper to get distinct categories from products
export const getUniqueCategories = async () => {
    try {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('category');

        if (error) throw error;

        const dbCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
        const presets = PRESETS.products.category || [];

        return dbCategories.sort((a, b) => {
            const idxA = presets.indexOf(a);
            const idxB = presets.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    } catch (e) {
        return PRESETS.products.category || [];
    }
};

export const getPublicProducts = async (page = 1, limit = 12, search = '', category = '') => {
    let query = supabaseAdmin
        .from('products')
        .select('*');

    if (category && category !== 'Tất Cả') {
        query = query.ilike('category', category);
    }

    query = query.order('created_at', { ascending: false });

    const { data: rows, error } = await query;
    if (error) return { products: [], total: 0 };

    const productMap = new Map();
    const normalize = (str: string) => str ? str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
    const searchTerms = search ? normalize(search).split(' ') : [];

    rows.forEach(row => {
        if (searchTerms.length > 0) {
            const rowString = `${normalize(row.name)} ${normalize(row.category)} ${normalize(row.sku)} ${normalize(row.size)} ${normalize(row.color)} ${normalize(row.material)}`;
            const matches = searchTerms.every(term => rowString.includes(term));
            if (!matches) return;
        }

        const groupKey = `${row.name}|${row.material || ''}|${row.color || ''}`;

        if (!productMap.has(groupKey)) {
            let displayName = row.name;

            if (row.material) displayName += ", Gỗ " + row.material;
            if (row.color) displayName += ", Màu " + row.color;

            productMap.set(groupKey, {
                id: row.sku,
                name: displayName,
                baseName: row.name,
                category: row.category,
                price: row.price,
                material: row.material,
                color: row.color,
                description: row.description,
                images: row.images || [],
                variants: []
            });
        }

        const product = productMap.get(groupKey);
        product.variants.push({
            id: row.sku,
            size: row.size,
            color: row.color,
            material: row.material,
            price: row.price,
            stock: row.stock,
            images: row.images
        });
    });

    const allGroups = Array.from(productMap.values());
    const total = allGroups.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = allGroups.slice(startIndex, endIndex);

    return {
        products: paginatedProducts,
        total,
        hasMore: endIndex < total
    };
};

export const addRow = async (tableName: string, row: any) => {
    const { data, error } = await supabaseAdmin.from(tableName.toLowerCase()).insert([row]).select();
    if (error) throw new Error(error.message);
    return data;
};

export const updateRow = async (tableName: string, id: string | number, row: any) => {
    const table = tableName.toLowerCase();
    const idField = table === 'products' ? 'sku' : 'id';
    const { data, error } = await supabaseAdmin.from(table).update(row).eq(idField, id).select();
    if (error) throw new Error(error.message);
    return data;
};

export const deleteRow = async (tableName: string, id: string | number) => {
    const table = tableName.toLowerCase();
    const idField = table === 'products' ? 'sku' : 'id';
    const { error } = await supabaseAdmin.from(table).delete().eq(idField, id);
    if (error) throw new Error(error.message);
    return true;
};
