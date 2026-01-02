

import type { APIRoute } from 'astro';
import { getProducts } from '../../lib/server/googleSheets';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('admin') === 'true'; // simple check for now, should be token based

    const allProducts = await getProducts();

    if (isAdmin) {
        return new Response(JSON.stringify(allProducts), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Filter for public view
    const publicProducts = allProducts.map(p => {
        const { cost, profit, stock, ...publicProps } = p; // Remove sensitive fields
        return publicProps;
    });

    return new Response(JSON.stringify(publicProducts), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const POST: APIRoute = async ({ request }) => {
    const isAdmin = new URL(request.url).searchParams.get('admin') === 'true';
    if (!isAdmin) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return new Response("Missing ID", { status: 400 });

    const { updateProduct } = await import('../../lib/server/googleSheets');
    const success = await updateProduct(id, updates);

    if (success) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
        return new Response("Update Failed", { status: 500 });
    }
}
