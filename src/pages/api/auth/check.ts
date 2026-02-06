export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
    const session = cookies.get('admin_session');

    if (session && session.value === 'true') {
        return new Response(JSON.stringify({ authenticated: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
};

export const POST: APIRoute = async ({ cookies }) => {
    // Logout
    cookies.delete('admin_session', { path: '/' });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};
