
import type { APIRoute } from 'astro';
import { getPublicProducts } from '../../lib/server/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('admin') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const search = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || '';

    try {
        const result = await getPublicProducts(page, limit, search, category);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ products: [], total: 0, error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
