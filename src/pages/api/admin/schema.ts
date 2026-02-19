
import type { APIRoute } from "astro";

export const SCHEMA = {
    'products': ['sku', 'name', 'material', 'color', 'size', 'price', 'cost_avg', 'shipping_estimate', 'stock', 'category', 'images', 'description', 'note', 'supplier_id'],
    'customers': ['id', 'name', 'phone', 'address', 'email', 'notes'],
    'orders': ['id', 'customer_phone', 'subtotal', 'discount_code', 'discount_amount', 'total_amount', 'status', 'payment_method'],
    'order_items': ['id', 'order_id', 'sku', 'quantity', 'price_sold', 'cost_basis', 'note'],
    'containers': ['id', 'code', 'status', 'departure_date', 'arrival_date', 'shipping_cost', 'customs_tax', 'handling_fees', 'notes'],
    'container_items': ['id', 'container_id', 'sku', 'quantity', 'unit_cost_fob', 'landed_cost_share'],
    'suppliers': ['id', 'name', 'contact', 'material_type'],
    'discounts': ['code', 'type', 'value', 'expiry', 'active'],
    'inventory_logs': ['id', 'log_date', 'sku', 'change', 'reason'],
    'business_activities': ['id', 'date', 'type', 'category', 'description', 'amount'],
    'debts': ['id', 'order_id', 'type', 'amount_paid', 'remaining', 'due_date'],
    'shipping': ['id', 'order_id', 'carrier', 'cost', 'tracking', 'status'],
    'warranty': ['id', 'order_id', 'product_sku', 'end_date', 'claims'],
    'reviews': ['id', 'date', 'sku', 'customer', 'rating', 'comment', 'approved']
};

export const RELATIONS: any = {
    'products': { 'supplier_id': { table: 'suppliers', key: 'id', display: 'name' } },
    'orders': {
        'discount_code': { table: 'discounts', key: 'code', display: 'code' },
        'customer_phone': { table: 'customers', key: 'phone', display: 'name' }
    },
    'order_items': {
        'order_id': { table: 'orders', key: 'id', display: 'id' },
        'sku': { table: 'products', key: 'sku', display: 'name' }
    },
    'inventory_logs': { 'sku': { table: 'products', key: 'sku', display: 'name' } },
    'reviews': { 'sku': { table: 'products', key: 'sku', display: 'name' } },
    'shipping': { 'order_id': { table: 'orders', key: 'id', display: 'id' } },
    'debts': { 'order_id': { table: 'orders', key: 'id', display: 'id' } },
    'warranty': {
        'order_id': { table: 'orders', key: 'id', display: 'id' },
        'product_sku': { table: 'products', key: 'sku', display: 'name' }
    }
};

export const PRESETS: any = {
    'products': {
        'category': ["Bàn Cúng", "Trang Thờ", "Tủ Tài Địa", "Tủ Thờ", "Vật Dụng Thờ Cúng"]
    },
    'business_activities': { 'type': ["Income", "Expense"] },
    'orders': { 'status': ["Pending", "Paid", "Shipped", "Cancelled"] },
    'containers': { 'status': ["Planned", "Shipped", "Arrived", "Cleared"] },
    'debts': { 'type': ["Deposit", "Remaining", "Full"] }
};

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        schema: SCHEMA,
        relations: RELATIONS,
        presets: PRESETS
    }), { status: 200 });
};
