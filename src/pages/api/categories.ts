
import type { APIRoute } from 'astro';
import { getUniqueCategories } from '../../lib/server/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const categories = await getUniqueCategories();
        return new Response(JSON.stringify(categories), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Categories API Error:", error);
        return new Response(JSON.stringify([]), { status: 500 });
    }
}
