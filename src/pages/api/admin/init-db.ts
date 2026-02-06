
import type { APIRoute } from "astro";
import { initializeDatabase } from "../../../lib/server/googleSheets";

export const POST: APIRoute = async ({ request }) => {
    try {
        const result = await initializeDatabase();

        if (result.success) {
            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(JSON.stringify(result), { status: 500 });
        }
    } catch (error: any) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
