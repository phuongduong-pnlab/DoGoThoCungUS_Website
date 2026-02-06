
import type { APIRoute } from "astro";
import { SHEET_SCHEMA } from "../../../lib/server/googleSheets";

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify(SHEET_SCHEMA), { status: 200 });
};
