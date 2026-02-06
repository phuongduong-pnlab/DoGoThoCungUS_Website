export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const { password } = body;

        // Server-side check
        // In production, process.env.ADMIN_PASSWORD should be set in Vercel settings
        // Locally, it reads from .env
        const validPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

        if (!validPassword) {
            console.error("ADMIN_PASSWORD not set in environment");
            return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
        }

        if (password === validPassword) {
            // Set HttpOnly cookie
            cookies.set('admin_session', 'true', {
                path: '/',
                httpOnly: true, // Not accessible via JS
                secure: import.meta.env.PROD, // Only secure in prod
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }
};
